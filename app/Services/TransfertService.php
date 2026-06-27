<?php

namespace App\Services;

use App\Models\Transfert;
use App\Models\Client;
use App\Models\Agence;
use App\Models\User;
use App\Exceptions\FondsInsuffisantsException;
use App\Exceptions\TransfertException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TransfertService
{
    protected LedgerService $ledgerService;

    public function __construct(LedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    public function creer(array $data, User $user): Transfert
    {
        if (empty($data['idempotency_key'])) {
            throw new TransfertException('La clé d\'idempotence est requise', 422);
        }

        $existing = Transfert::where('idempotency_key', $data['idempotency_key'])->first();
        if ($existing) {
            return $existing;
        }

        return DB::transaction(function () use ($data, $user) {
            $agenceEmettrice = Agence::where('id', $data['agence_envoi_id'])->lockForUpdate()->first();
            $agenceDestinataire = Agence::where('id', $data['agence_destinataire_id'])->lockForUpdate()->first();

            if (!$agenceEmettrice || !$agenceDestinataire) {
                throw new TransfertException('Agence non trouvée', 404);
            }

            $expediteur = Client::firstOrCreate(
                ['telephone' => $data['telephone_expediteur']],
                ['nom' => $data['nom_expediteur']]
            );

            $beneficiaire = Client::firstOrCreate(
                ['telephone' => $data['telephone_beneficiaire']],
                ['nom' => $data['nom_beneficiaire']]
            );

            $frais = $this->calculerFrais($data['montant']);
            $total = $data['montant'] + $frais;

            $solde = $this->ledgerService->getSoldeWithLock($agenceEmettrice->id);
            if ($solde < $total) {
                throw new FondsInsuffisantsException($solde, $total);
            }

            $code = Transfert::generateCode();

            $transfert = Transfert::create([
                'code' => $code,
                'expediteur_id' => $expediteur->id,
                'beneficiaire_id' => $beneficiaire->id,
                'agence_envoi_id' => $agenceEmettrice->id,
                'agence_retrait_id' => $agenceDestinataire->id,
                'utilisateur_envoi_id' => $user->id,
                'montant' => $data['montant'],
                'frais' => $frais,
                'commission' => $frais * 0.75,
                'statut' => 'ENVOYE',
                'date_envoi' => now(),
                'idempotency_key' => $data['idempotency_key'],
            ]);

            // Écritures ledger (DEBIT = CREDIT = total)
            $this->ledgerService->debit(
                $agenceEmettrice,
                $total,
                'TRANSFERT_EMIS',
                $transfert->id,
                $user->id,
                $code,
                "Transfert émis vers {$agenceDestinataire->nom}"
            );

            $this->ledgerService->credit(
                $agenceDestinataire,
                $data['montant'],
                'TRANSFERT_RECU',
                $transfert->id,
                $user->id,
                $code,
                "Transfert reçu de {$agenceEmettrice->nom}"
            );

            $this->ledgerService->credit(
                $agenceEmettrice,
                $frais,
                'FRAIS_TRANSFERT',
                $transfert->id,
                $user->id,
                $code,
                "Frais transfert - Code: {$code}"
            );

            $this->ledgerService->verifierDoubleEcriture($transfert->id);

            Log::channel('audit')->info('transfert_cree', [
                'transfert_id' => $transfert->id,
                'code' => $code,
                'montant' => $data['montant'],
                'frais' => $frais,
                'total' => $total,
                'idempotency_key' => $data['idempotency_key'],
                'user_id' => $user->id
            ]);

            return $transfert;
        });
    }

    public function retirer(string $code, User $user): Transfert
    {
        return DB::transaction(function () use ($code, $user) {
            $transfert = Transfert::where('code', $code)->lockForUpdate()->first();

            if (!$transfert) {
                throw new TransfertException('Transfert introuvable', 404);
            }

            if ($transfert->statut === 'RETIRE') {
                throw new TransfertException('Transfert déjà retiré', 400);
            }

            if ($transfert->statut === 'ANNULE') {
                throw new TransfertException('Impossible de retirer un transfert annulé', 400);
            }

            if ($transfert->statut !== 'ENVOYE') {
                throw new TransfertException('Transfert non disponible', 400);
            }

            $agence = Agence::where('id', $transfert->agence_retrait_id)->lockForUpdate()->first();
            if (!$agence) {
                throw new TransfertException('Agence de retrait non trouvée', 404);
            }

            if ($user->agence_id !== $agence->id && $user->role !== 'SUPERADMIN') {
                throw new TransfertException('Accès interdit à ce transfert', 403);
            }

            $solde = $this->ledgerService->getSoldeWithLock($agence->id);
            if ($solde < $transfert->montant) {
                throw new FondsInsuffisantsException($solde, $transfert->montant);
            }

            $transfert->update([
                'statut' => 'RETIRE',
                'date_retrait' => now(),
                'utilisateur_retrait_id' => $user->id,
            ]);

            $this->ledgerService->debit(
                $agence,
                $transfert->montant,
                'RETRAIT_EFFECTUE',
                $transfert->id,
                $user->id,
                $code,
                "Retrait effectué - Code: {$code}"
            );

            $this->ledgerService->verifierDoubleEcriture($transfert->id);

            Log::channel('audit')->info('transfert_retire', [
                'transfert_id' => $transfert->id,
                'code' => $code,
                'user_id' => $user->id
            ]);

            return $transfert;
        });
    }

    public function annuler(string $code, User $user, ?string $motif = null): Transfert
    {
        return DB::transaction(function () use ($code, $user, $motif) {
            $transfert = Transfert::where('code', $code)->lockForUpdate()->first();

            if (!$transfert) {
                throw new TransfertException('Transfert introuvable', 404);
            }

            if ($transfert->statut === 'ANNULE') {
                throw new TransfertException('Transfert déjà annulé', 400);
            }

            if ($transfert->statut === 'RETIRE') {
                throw new TransfertException('Impossible d\'annuler un transfert déjà retiré', 400);
            }

            if ($transfert->statut !== 'ENVOYE') {
                throw new TransfertException('Transfert déjà traité', 400);
            }

            $agenceEmettrice = Agence::where('id', $transfert->agence_envoi_id)->lockForUpdate()->first();
            $agenceDestinataire = Agence::where('id', $transfert->agence_retrait_id)->lockForUpdate()->first();

            if (!$agenceEmettrice || !$agenceDestinataire) {
                throw new TransfertException('Agence non trouvée', 404);
            }

            if ($user->agence_id !== $agenceEmettrice->id && $user->role !== 'SUPERADMIN') {
                throw new TransfertException('Accès interdit', 403);
            }

            $soldeDestinataire = $this->ledgerService->getSoldeWithLock($agenceDestinataire->id);
            if ($soldeDestinataire < $transfert->montant) {
                throw new FondsInsuffisantsException($soldeDestinataire, $transfert->montant);
            }

            $transfert->update([
                'statut' => 'ANNULE',
                'date_annulation' => now(),
                'utilisateur_annulation_id' => $user->id,
                'motif_annulation' => $motif ?? 'Annulation par l\'utilisateur',
            ]);

            // 🔥 CORRECTION: ÉQUILIBRAGE COMPLET
            // 1. Remboursement du montant à l'agence émettrice
            $this->ledgerService->credit(
                $agenceEmettrice,
                $transfert->montant,
                'ANNULATION_TRANSFERT',
                $transfert->id,
                $user->id,
                $code,
                "Remboursement montant - Code: {$code}"
            );

            // 2. Remboursement des frais à l'agence émettrice
            $this->ledgerService->credit(
                $agenceEmettrice,
                $transfert->frais,
                'ANNULATION_FRAIS',
                $transfert->id,
                $user->id,
                $code,
                "Remboursement frais - Code: {$code}"
            );

            // 3. Débit du montant chez l'agence destinataire
            $this->ledgerService->debit(
                $agenceDestinataire,
                $transfert->montant,
                'ANNULATION_TRANSFERT',
                $transfert->id,
                $user->id,
                $code,
                "Retrait fonds destinataire - Code: {$code}"
            );

            // 4. Débit des frais chez l'agence émettrice (compensation)
            $this->ledgerService->debit(
                $agenceEmettrice,
                $transfert->frais,
                'ANNULATION_FRAIS',
                $transfert->id,
                $user->id,
                $code,
                "Compensation frais - Code: {$code}"
            );

            // Vérification finale: DEBIT = CREDIT
            $this->ledgerService->verifierDoubleEcriture($transfert->id);

            Log::channel('audit')->info('transfert_annule', [
                'transfert_id' => $transfert->id,
                'code' => $code,
                'montant' => $transfert->montant,
                'frais' => $transfert->frais,
                'motif' => $motif,
                'user_id' => $user->id
            ]);

            return $transfert;
        });
    }

    private function calculerFrais(float $montant): float
    {
        if ($montant <= 100000) return 1000;
        if ($montant <= 500000) return 2000;
        if ($montant <= 1000000) return 3000;
        return 5000;
    }
}
