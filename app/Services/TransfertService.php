<?php

namespace App\Services;

use App\Models\Transfert;
use App\Models\Client;
use App\Models\Agence;
use App\Models\User;
use App\Models\Engagement;
use App\Exceptions\FondsInsuffisantsException;
use App\Exceptions\TransfertException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TransfertService
{
    private const MAX_MONTANT = 999999999.99;
    protected LedgerService $ledger;
    protected EngagementService $engagement;
    protected AuditService $audit;

    public function __construct(
        LedgerService $ledger,
        EngagementService $engagement,
        AuditService $audit
    ) {
        $this->ledger = $ledger;
        $this->engagement = $engagement;
        $this->audit = $audit;
    }

    public function creer(array $data, User $user): Transfert
    {
        if (empty($data['idempotency_key'])) {
            throw new TransfertException('Clé idempotence requise', 422);
        }

        return DB::transaction(function () use ($data, $user) {
            // 1. Idempotence
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

            // 2. Vérifications
            $agenceEmettrice = Agence::where('id', $data['agence_envoi_id'])->lockForUpdate()->first();
            $agenceDestinataire = Agence::where('id', $data['agence_destinataire_id'])->lockForUpdate()->first();

            if (!$agenceEmettrice || !$agenceDestinataire) {
                throw new TransfertException('Agence non trouvée', 404);
            }

            if ($user->role !== 'SUPERADMIN' && $user->agence_id !== $agenceEmettrice->id) {
                throw new TransfertException('Accès interdit', 403);
            }

            // 3. Vérifier le solde disponible
            $soldeDisponible = $this->engagement->getSoldeDisponible($agenceEmettrice->id, $this->ledger);
            $total = $data['montant'] + $this->calculerFrais($data['montant']);

            if ($soldeDisponible < $total) {
                throw new FondsInsuffisantsException($soldeDisponible, $total);
            }

            // 4. Créer les clients
            $expediteur = Client::firstOrCreate(
                ['telephone' => $data['telephone_expediteur']],
                ['nom' => $data['nom_expediteur']]
            );
            $beneficiaire = Client::firstOrCreate(
                ['telephone' => $data['telephone_beneficiaire']],
                ['nom' => $data['nom_beneficiaire']]
            );

            // 5. Créer le transfert (statut ENVOYE)
            $frais = $this->calculerFrais($data['montant']);
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
                'statut' => 'ENVOYE',
                'date_envoi' => now(),
                'idempotency_key' => $data['idempotency_key'],
            ]);

            // 6. Engager l'argent (PAS de ledger)
            $this->engagement->engager($transfert, $agenceEmettrice->id, $total);

            $this->audit->logTransfertCreation($transfert);

            Log::info('Transfert créé avec engagement', [
                'id' => $transfert->id,
                'code' => $code,
                'montant' => $data['montant'],
                'engage' => $total
            ]);

            return $transfert;
        });
    }

    public function retirer(string $code, User $user): Transfert
    {
        return DB::transaction(function () use ($code, $user) {
            $code = strtoupper(trim($code));

            // 1. Verrou pessimiste sur le transfert
            $transfert = Transfert::where('code', $code)
                ->lockForUpdate()
                ->first();

            if (!$transfert) {
                throw new TransfertException('Transfert introuvable', 404);
            }

            // 2. Vérifier idempotence (retrait_key)
            $retraitKey = 'ret_' . $code . '_' . date('Ymd_His');
            $existing = Transfert::where('retrait_key', $retraitKey)->first();
            if ($existing) {
                Log::info('Retrait déjà effectué (idempotence)', [
                    'code' => $code,
                    'retrait_key' => $retraitKey
                ]);
                return $existing;
            }

            // 3. Vérifier statut
            if ($transfert->statut !== 'ENVOYE') {
                throw new TransfertException('Transfert non disponible (statut: ' . $transfert->statut . ')', 422);
            }

            // 4. Vérifier droits
            if ($user->role !== 'SUPERADMIN' && $user->agence_id !== $transfert->agence_retrait_id) {
                throw new TransfertException('Accès interdit: vous ne pouvez pas retirer ce transfert', 403);
            }

            // 5. Vérifier caisse (solde disponible)
            $agenceRetrait = Agence::where('id', $transfert->agence_retrait_id)->lockForUpdate()->first();
            $soldeDisponible = $this->engagement->getSoldeDisponible($agenceRetrait->id, $this->ledger);

            if ($soldeDisponible < $transfert->montant) {
                throw new FondsInsuffisantsException($soldeDisponible, $transfert->montant);
            }

            $ancienStatut = $transfert->statut;

            // 6. Verrou sur la caisse
            $caisse = \App\Models\Caisse::where('agence_id', $agenceRetrait->id)->lockForUpdate()->first();
            if (!$caisse) {
                throw new TransfertException('Caisse non trouvée', 404);
            }

            if ($caisse->solde_physique < $transfert->montant) {
                throw new FondsInsuffisantsException($caisse->solde_physique, $transfert->montant);
            }

            // 7. ÉCRITURES LEDGER (argent réel)
            $system = $this->ledger->getSystemAccount();
            $fraisAccount = $this->ledger->getFraisAccount();

            // DEBIT agence émettrice
            $this->ledger->debit(
                $transfert->agenceEnvoi,
                $transfert->montant + $transfert->frais,
                'TRANSFERT_SORTIE',
                $transfert->id,
                $user->id,
                $code,
                'Sortie transfert #' . $code
            );

            // CREDIT agence destinataire
            $this->ledger->credit(
                $agenceRetrait,
                $transfert->montant,
                'TRANSFERT_ENTREE',
                $transfert->id,
                $user->id,
                $code,
                'Entrée transfert #' . $code
            );

            // CREDIT SYSTEM (frais)
            $this->ledger->credit(
                $system,
                $transfert->frais,
                'FRAIS',
                $transfert->id,
                $user->id,
                $code,
                'Frais transfert #' . $code
            );

            // 8. SORTIE DE CAISSE
            $caisseService = app(\App\Services\CaisseService::class);
            $caisseService->sortie(
                $caisse->id,
                $transfert->montant,
                'RETRAIT_TRANSFERT',
                $user->id,
                $code
            );

            // 9. Désengager
            $this->engagement->desengager($transfert, 'RETIRE');

            // 10. Mettre à jour le transfert
            $transfert->update([
                'statut' => 'RETIRE',
                'date_retrait' => now(),
                'utilisateur_retrait_id' => $user->id,
                'retrait_key' => $retraitKey
            ]);

            // 11. Mettre à jour solde_cache
            $this->ledger->mettreAJourSoldeCache($transfert->agence_envoi_id);
            $this->ledger->mettreAJourSoldeCache($transfert->agence_retrait_id);

            // 12. Audit
            $this->audit->logTransfertRetrait($transfert);

            // 13. Audit détaillé
            \App\Models\AuditOperation::create([
                'operation' => 'RETRAIT',
                'transfert_code' => $code,
                'utilisateur_id' => $user->id,
                'agence_id' => $user->agence_id,
                'montant' => $transfert->montant,
                'ancien_statut' => $ancienStatut,
                'nouveau_statut' => 'RETIRE',
                'motif' => null,
            ]);

            Log::info('Transfert retiré avec succès', [
                'id' => $transfert->id,
                'code' => $code,
                'retrait_key' => $retraitKey,
                'agence_retrait' => $transfert->agence_retrait_id,
                'utilisateur' => $user->id
            ]);

            return $transfert;
        });
    }

    public function annuler(string $code, User $user, ?string $motif = null): Transfert
    {
        return DB::transaction(function () use ($code, $user, $motif) {
            $code = strtoupper(trim($code));

            // 1. Verrou pessimiste
            $transfert = Transfert::where('code', $code)
                ->lockForUpdate()
                ->first();

            if (!$transfert) {
                throw new TransfertException('Transfert introuvable', 404);
            }

            // 2. Vérifier statut
            if ($transfert->statut === 'RETIRE') {
                throw new TransfertException('Impossible d\'annuler un transfert déjà retiré', 422);
            }

            if ($transfert->statut === 'ANNULE') {
                throw new TransfertException('Transfert déjà annulé', 422);
            }

            // 3. Vérifier droits
            if ($user->role !== 'SUPERADMIN' && $user->agence_id !== $transfert->agence_envoi_id) {
                throw new TransfertException('Accès interdit: vous ne pouvez pas annuler ce transfert', 403);
            }

            $ancienStatut = $transfert->statut;

            // 4. Désengager (PAS de ledger)
            $this->engagement->desengager($transfert, 'ANNULE');

            // 5. Mettre à jour le transfert
            $transfert->update([
                'statut' => 'ANNULE',
                'date_annulation' => now(),
                'utilisateur_annulation_id' => $user->id,
                'motif_annulation' => $motif ?? 'Annulation par l\'utilisateur',
            ]);

            // 6. Audit
            $this->audit->logTransfertAnnulation($transfert, $motif ?? 'Annulation');

            // 7. Audit détaillé
            \App\Models\AuditOperation::create([
                'operation' => 'ANNULATION',
                'transfert_code' => $code,
                'utilisateur_id' => $user->id,
                'agence_id' => $user->agence_id,
                'montant' => $transfert->montant,
                'ancien_statut' => $ancienStatut,
                'nouveau_statut' => 'ANNULE',
                'motif' => $motif ?? 'Annulation par utilisateur',
            ]);

            Log::info('Transfert annulé avec succès', [
                'id' => $transfert->id,
                'code' => $code,
                'agence_envoi' => $transfert->agence_envoi_id,
                'motif' => $motif
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
