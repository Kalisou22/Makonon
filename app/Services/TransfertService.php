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
    private const MAX_MONTANT = 999999999.99;
    protected LedgerService $ledger;

    public function __construct(LedgerService $ledger)
    {
        $this->ledger = $ledger;
    }

    public function creer(array $data, User $user): Transfert
    {
        if (empty($data['idempotency_key'])) {
            throw new TransfertException('Clé idempotence requise', 422);
        }

        return DB::transaction(function () use ($data, $user) {
            $existing = Transfert::where('idempotency_key', $data['idempotency_key'])
                ->lockForUpdate()
                ->first();

            if ($existing) {
                Log::info('Transfert existant retourné (idempotence)', [
                    'idempotency_key' => $data['idempotency_key'],
                    'transfert_id' => $existing->id
                ]);
                return $existing;
            }

            $agenceEmettrice = Agence::where('id', $data['agence_envoi_id'])->lockForUpdate()->first();
            $agenceDestinataire = Agence::where('id', $data['agence_destinataire_id'])->lockForUpdate()->first();
            $system = $this->ledger->getSystemAccount();
            $fraisAccount = $this->ledger->getFraisAccount();

            if (!$agenceEmettrice || !$agenceDestinataire) {
                throw new TransfertException('Agence non trouvée', 404);
            }

            if ($user->role !== 'SUPERADMIN' && $user->agence_id !== $agenceEmettrice->id) {
                throw new TransfertException('Accès interdit: vous ne pouvez pas créer de transfert depuis cette agence', 403);
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

            if ($total > self::MAX_MONTANT) {
                throw new TransfertException("Montant total dépasse la limite", 422);
            }

            $solde = $this->ledger->getSolde($agenceEmettrice->id);
            if ($solde < $total) {
                throw new FondsInsuffisantsException($solde, $total);
            }

            $code = 'TRF' . date('Ymd') . strtoupper(substr(uniqid(), -6));
            $transfert = Transfert::create([
                'code' => strtoupper($code),
                'expediteur_id' => $expediteur->id,
                'beneficiaire_id' => $beneficiaire->id,
                'agence_envoi_id' => $agenceEmettrice->id,
                'agence_retrait_id' => $agenceDestinataire->id,
                'utilisateur_envoi_id' => $user->id,
                'montant' => $data['montant'],
                'frais' => $frais,
                'commission' => $frais * 0.75,
                // ✅ STATUT ENVOYE pour l'agence émettrice
                'statut' => 'ENVOYE',
                'date_envoi' => now(),
                'idempotency_key' => $data['idempotency_key'],
            ]);

            // 6 ÉCRITURES
            $this->ledger->debit($agenceEmettrice, $total, 'ENVOI', $transfert->id, $user->id, $code, "Débit AG001 - Total: {$total}");
            $this->ledger->credit($system, $total, 'ENVOI', $transfert->id, $user->id, $code, "Crédit SYSTEM - Total: {$total}");
            $this->ledger->debit($system, $data['montant'], 'RECEPTION', $transfert->id, $user->id, $code, "Débit SYSTEM - Montant: {$data['montant']}");
            $this->ledger->credit($agenceDestinataire, $data['montant'], 'RECEPTION', $transfert->id, $user->id, $code, "Crédit AG002 - Montant: {$data['montant']}");
            $this->ledger->debit($system, $frais, 'FRAIS', $transfert->id, $user->id, $code, "Débit SYSTEM - Frais: {$frais}");
            $this->ledger->credit($fraisAccount, $frais, 'FRAIS', $transfert->id, $user->id, $code, "Crédit FRAIS - Frais: {$frais}");

            $this->ledger->mettreAJourSoldeCache($agenceEmettrice->id);
            $this->ledger->mettreAJourSoldeCache($agenceDestinataire->id);
            $this->ledger->mettreAJourSoldeCache($system->id);
            $this->ledger->mettreAJourSoldeCache($fraisAccount->id);

            $this->ledger->verifierDoubleEcriture($transfert->id);
            $this->ledger->verifierSystemNul();

            Log::info('Transfert créé avec succès', [
                'id' => $transfert->id,
                'code' => $code,
                'statut' => 'ENVOYE',
                'agence_envoi' => $agenceEmettrice->id,
                'agence_retrait' => $agenceDestinataire->id,
                'montant' => $data['montant']
            ]);
            return $transfert;
        });
    }

    public function retirer(string $code, User $user): Transfert
    {
        return DB::transaction(function () use ($code, $user) {
            $code = strtoupper(trim($code));

            // ✅ Le retrait ne peut se faire que sur un transfert ENVOYE (pas encore retiré)
            $transfert = Transfert::where('code', $code)
                ->where('statut', 'ENVOYE')
                ->lockForUpdate()
                ->first();

            if (!$transfert) {
                Log::warning('Tentative de retrait d\'un transfert non disponible', [
                    'code' => $code,
                    'user_id' => $user->id
                ]);
                throw new TransfertException('Transfert non disponible ou déjà traité', 404);
            }

            // ✅ Vérifier que l'utilisateur appartient à l'agence de retrait
            $agence = Agence::where('id', $transfert->agence_retrait_id)->lockForUpdate()->first();
            if (!$agence) {
                throw new TransfertException('Agence de retrait non trouvée', 404);
            }

            if ($user->role !== 'SUPERADMIN' && $user->agence_id !== $agence->id) {
                Log::warning('Tentative de retrait non autorisée', [
                    'user_id' => $user->id,
                    'user_agence' => $user->agence_id,
                    'transfert_agence_retrait' => $transfert->agence_retrait_id
                ]);
                throw new TransfertException('Accès interdit: vous ne pouvez pas retirer ce transfert', 403);
            }

            // ✅ Vérifier le solde de l'agence
            $solde = $this->ledger->getSolde($agence->id);
            if ($solde < $transfert->montant) {
                throw new FondsInsuffisantsException($solde, $transfert->montant);
            }

            // ✅ Mettre à jour le transfert
            $transfert->update([
                'statut' => 'RETIRE',
                'date_retrait' => now(),
                'utilisateur_retrait_id' => $user->id,
            ]);

            $agenceEmettrice = Agence::where('id', $transfert->agence_envoi_id)->lockForUpdate()->first();
            $system = $this->ledger->getSystemAccount();

            // 4 ÉCRITURES
            $this->ledger->debit($agence, $transfert->montant, 'RETRAIT', $transfert->id, $user->id, $code, "Débit AG002 - Retrait");
            $this->ledger->credit($system, $transfert->montant, 'RETRAIT', $transfert->id, $user->id, $code, "Crédit SYSTEM - Compensation");
            $this->ledger->debit($system, $transfert->montant, 'RETRAIT', $transfert->id, $user->id, $code, "Débit SYSTEM - Fermeture");
            $this->ledger->credit($agenceEmettrice, $transfert->montant, 'RETRAIT', $transfert->id, $user->id, $code, "Crédit AG001 - Remboursement");

            $this->ledger->mettreAJourSoldeCache($agence->id);
            $this->ledger->mettreAJourSoldeCache($agenceEmettrice->id);
            $this->ledger->mettreAJourSoldeCache($system->id);

            $this->ledger->verifierDoubleEcriture($transfert->id);
            $this->ledger->verifierSystemNul();

            Log::info('Transfert retiré avec succès', [
                'id' => $transfert->id,
                'code' => $code,
                'agence_retrait' => $agence->id,
                'utilisateur' => $user->id
            ]);
            return $transfert;
        });
    }

    public function annuler(string $code, User $user, ?string $motif = null): Transfert
    {
        return DB::transaction(function () use ($code, $user, $motif) {
            $code = strtoupper(trim($code));

            // ✅ Annulation uniquement si le transfert n'est pas encore retiré
            $transfert = Transfert::where('code', $code)
                ->whereIn('statut', ['ENVOYE', 'EN_ATTENTE'])
                ->lockForUpdate()
                ->first();

            if (!$transfert) {
                throw new TransfertException('Transfert introuvable ou déjà traité', 404);
            }

            if ($transfert->statut === 'RETIRE') {
                throw new TransfertException('Impossible d\'annuler un transfert déjà retiré', 400);
            }

            $agenceEmettrice = Agence::where('id', $transfert->agence_envoi_id)->lockForUpdate()->first();

            if ($user->role !== 'SUPERADMIN' && $user->agence_id !== $agenceEmettrice->id) {
                throw new TransfertException('Accès interdit: vous ne pouvez pas annuler ce transfert', 403);
            }

            $agenceDestinataire = Agence::where('id', $transfert->agence_retrait_id)->lockForUpdate()->first();
            $system = $this->ledger->getSystemAccount();
            $fraisAccount = $this->ledger->getFraisAccount();

            $totalARembourser = $transfert->montant + $transfert->frais;
            $transfert->update([
                'statut' => 'ANNULE',
                'date_annulation' => now(),
                'utilisateur_annulation_id' => $user->id,
                'motif_annulation' => $motif ?? 'Annulation par l\'utilisateur',
            ]);

            $this->ledger->debit($agenceDestinataire, $transfert->montant, 'ANNULATION', $transfert->id, $user->id, $code, "Débit AG002 - Annulation");
            $this->ledger->credit($system, $transfert->montant, 'ANNULATION', $transfert->id, $user->id, $code, "Crédit SYSTEM - Annulation");
            $this->ledger->debit($system, $totalARembourser, 'ANNULATION', $transfert->id, $user->id, $code, "Débit SYSTEM - Remboursement");
            $this->ledger->credit($agenceEmettrice, $totalARembourser, 'ANNULATION', $transfert->id, $user->id, $code, "Crédit AG001 - Remboursement");
            $this->ledger->debit($fraisAccount, $transfert->frais, 'ANNULATION', $transfert->id, $user->id, $code, "Débit FRAIS - Remboursement");
            $this->ledger->credit($system, $transfert->frais, 'ANNULATION', $transfert->id, $user->id, $code, "Crédit SYSTEM - Remboursement frais");

            $this->ledger->mettreAJourSoldeCache($agenceEmettrice->id);
            $this->ledger->mettreAJourSoldeCache($agenceDestinataire->id);
            $this->ledger->mettreAJourSoldeCache($system->id);
            $this->ledger->mettreAJourSoldeCache($fraisAccount->id);

            $this->ledger->verifierDoubleEcriture($transfert->id);
            $this->ledger->verifierSystemNul();

            Log::info('Transfert annulé', ['id' => $transfert->id, 'code' => $code]);
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
