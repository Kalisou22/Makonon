<?php

namespace App\Services;

use App\Models\Transfert;
use App\Models\Client;
use App\Models\Agence;
use App\Models\User;
use App\Models\Ledger;
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
        $agenceEmettrice = Agence::findOrFail($data['agence_envoi_id']);
        $agenceDestinataire = Agence::findOrFail($data['agence_destinataire_id']);

        $expediteur = Client::firstOrCreate(
            ['telephone' => $data['telephone_expediteur']],
            ['nom' => $data['nom_expediteur']]
        );

        $beneficiaire = Client::firstOrCreate(
            ['telephone' => $data['telephone_beneficiaire']],
            ['nom' => $data['nom_beneficiaire']]
        );

        return DB::transaction(function () use ($data, $user, $agenceEmettrice, $agenceDestinataire, $expediteur, $beneficiaire) {
            $frais = $this->calculerFrais($data['montant']);
            $total = $data['montant'] + $frais;

            // Vérification idempotence
            if (!empty($data['idempotency_key'])) {
                $existing = Transfert::where('idempotency_key', $data['idempotency_key'])->first();
                if ($existing) {
                    return $existing;
                }
            }

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
                'idempotency_key' => $data['idempotency_key'] ?? null,
            ]);

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

            Log::channel('audit')->info('transfert_cree', [
                'transfert_id' => $transfert->id,
                'code' => $code,
                'montant' => $data['montant'],
                'frais' => $frais,
                'total' => $total,
                'user_id' => $user->id,
                'agence_source' => $agenceEmettrice->id,
                'agence_dest' => $agenceDestinataire->id,
                'ip' => request()->ip()
            ]);

            return $transfert;
        });
    }

    public function retirer(string $code, User $user): Transfert
    {
        return DB::transaction(function () use ($code, $user) {
            $transfert = Transfert::where('code', $code)
                ->where('statut', 'ENVOYE')
                ->lockForUpdate()
                ->first();

            if (!$transfert) {
                throw new TransfertException('Transfert introuvable ou déjà retiré', 404);
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

            Log::channel('audit')->info('transfert_retire', [
                'transfert_id' => $transfert->id,
                'code' => $code,
                'user_id' => $user->id,
                'agence' => $agence->id,
                'ip' => request()->ip()
            ]);

            return $transfert;
        });
    }

    public function annuler(string $code, User $user, ?string $motif = null): Transfert
    {
        return DB::transaction(function () use ($code, $user, $motif) {
            $transfert = Transfert::where('code', $code)
                ->lockForUpdate()
                ->first();

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

            // Vérification critique: solde de l'agence destinataire
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

            $totalARembourser = $transfert->montant + $transfert->frais;

            $this->ledgerService->credit(
                $agenceEmettrice,
                $totalARembourser,
                'ANNULATION_TRANSFERT',
                $transfert->id,
                $user->id,
                $code,
                "Annulation transfert - Remboursement total"
            );

            $this->ledgerService->debit(
                $agenceDestinataire,
                $transfert->montant,
                'ANNULATION_TRANSFERT',
                $transfert->id,
                $user->id,
                $code,
                "Annulation transfert - Retrait fonds"
            );

            Log::channel('audit')->info('transfert_annule', [
                'transfert_id' => $transfert->id,
                'code' => $code,
                'montant' => $transfert->montant,
                'frais' => $transfert->frais,
                'total_rembourse' => $totalARembourser,
                'motif' => $motif,
                'user_id' => $user->id,
                'agence_source' => $agenceEmettrice->id,
                'agence_dest' => $agenceDestinataire->id,
                'ip' => request()->ip()
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
