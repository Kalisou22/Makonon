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
    protected FraisService $fraisService;
    protected MouvementService $mouvementService;

    public function __construct(
        LedgerService $ledger,
        EngagementService $engagement,
        AuditService $audit,
        FraisService $fraisService,
        MouvementService $mouvementService
    ) {
        $this->ledger = $ledger;
        $this->engagement = $engagement;
        $this->audit = $audit;
        $this->fraisService = $fraisService;
        $this->mouvementService = $mouvementService;
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
                return $existing;
            }

            $agenceEmettrice = Agence::where('id', $data['agence_envoi_id'])->lockForUpdate()->first();
            $agenceDestinataire = Agence::where('id', $data['agence_destinataire_id'])->lockForUpdate()->first();

            if (!$agenceEmettrice || !$agenceDestinataire) {
                throw new TransfertException('Agence non trouvée', 404);
            }

            if ($user->role !== 'SUPERADMIN' && $user->agence_id !== $agenceEmettrice->id) {
                throw new TransfertException('Accès interdit', 403);
            }

            // Vérifier solde disponible (cash - dette)
            $soldeDisponible = $this->mouvementService->getSoldeDisponible($agenceEmettrice->id);
            
            $fraisData = $this->fraisService->calculerFrais($data['montant']);
            $frais = $fraisData['montant'];
            $total = $data['montant'] + $frais;

            if ($soldeDisponible < $total) {
                throw new FondsInsuffisantsException($soldeDisponible, $total);
            }

            $expediteur = Client::firstOrCreate(
                ['telephone' => $data['telephone_expediteur']],
                ['nom' => $data['nom_expediteur']]
            );
            $beneficiaire = Client::firstOrCreate(
                ['telephone' => $data['telephone_beneficiaire']],
                ['nom' => $data['nom_beneficiaire']]
            );

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

            $this->engagement->engager($transfert, $agenceEmettrice->id, $total);
            $this->fraisService->enregistrerHistorique($transfert, $data['montant'], $fraisData);

            // ✅ MOUVEMENTS: CASH (entrée du total encaissé)
            $this->mouvementService->create([
                'agence_id' => $agenceEmettrice->id,
                'type' => 'CASH',
                'sens' => 'ENTREE',
                'montant' => $total,
                'transaction_id' => $transfert->id,
                'motif' => 'Dépôt transfert #' . $transfert->code
            ]);

            // ✅ MOUVEMENTS: DETTE (créance vers destination)
            $this->mouvementService->create([
                'agence_id' => $agenceEmettrice->id,
                'type' => 'DETTE',
                'sens' => 'ENTREE',
                'montant' => $data['montant'],
                'transaction_id' => $transfert->id,
                'motif' => 'Dette vers agence destinataire #' . $transfert->code
            ]);

            // ✅ MOUVEMENTS: FRAIS (revenu)
            $this->mouvementService->create([
                'agence_id' => $agenceEmettrice->id,
                'type' => 'FRAIS',
                'sens' => 'ENTREE',
                'montant' => $frais,
                'transaction_id' => $transfert->id,
                'motif' => 'Frais transfert #' . $transfert->code
            ]);

            $caisseService = app(\App\Services\CaisseService::class);
            $caisseService->entree(
                $caisseService->getCaisseIdByAgence($agenceEmettrice->id),
                $total,
                'DEPOT_TRANSFERT',
                $user->id,
                $code,
                $transfert->id
            );

            $this->audit->logTransfertCreation($transfert);

            return $transfert;
        });
    }

    public function retirer(string $code, User $user): Transfert
    {
        return DB::transaction(function () use ($code, $user) {
            $code = strtoupper(trim($code));

            $transfert = Transfert::where('code', $code)
                ->lockForUpdate()
                ->first();

            if (!$transfert) {
                throw new TransfertException('Transfert introuvable', 404);
            }

            $retraitKey = 'ret_' . $code . '_' . date('Ymd_His');
            $existing = Transfert::where('retrait_key', $retraitKey)->first();
            if ($existing) {
                return $existing;
            }

            if ($transfert->statut !== 'ENVOYE') {
                throw new TransfertException('Transfert non disponible', 422);
            }

            if ($user->role !== 'SUPERADMIN' && $user->agence_id !== $transfert->agence_retrait_id) {
                throw new TransfertException('Accès interdit', 403);
            }

            $agenceRetrait = Agence::where('id', $transfert->agence_retrait_id)->lockForUpdate()->first();

            // ✅ Vérifier solde disponible (cash - dette)
            $soldeDisponible = $this->mouvementService->getSoldeDisponible($agenceRetrait->id);
            if ($soldeDisponible < $transfert->montant) {
                throw new FondsInsuffisantsException($soldeDisponible, $transfert->montant);
            }

            $caisse = \App\Models\Caisse::where('agence_id', $agenceRetrait->id)->lockForUpdate()->first();
            if (!$caisse) {
                throw new TransfertException('Caisse non trouvée', 404);
            }

            if ($caisse->solde_physique < $transfert->montant) {
                throw new FondsInsuffisantsException($caisse->solde_physique, $transfert->montant);
            }

            $ancienStatut = $transfert->statut;

            // ✅ MOUVEMENTS: CASH (sortie du retrait)
            $this->mouvementService->create([
                'agence_id' => $agenceRetrait->id,
                'type' => 'CASH',
                'sens' => 'SORTIE',
                'montant' => $transfert->montant,
                'transaction_id' => $transfert->id,
                'motif' => 'Retrait client #' . $transfert->code
            ]);

            // ✅ MOUVEMENTS: DETTE (soldée)
            $this->mouvementService->create([
                'agence_id' => $agenceRetrait->id,
                'type' => 'DETTE',
                'sens' => 'SORTIE',
                'montant' => $transfert->montant,
                'transaction_id' => $transfert->id,
                'motif' => 'Dette soldée #' . $transfert->code
            ]);

            // ✅ Aussi chez l'émetteur (dette diminuée)
            $this->mouvementService->create([
                'agence_id' => $transfert->agence_envoi_id,
                'type' => 'DETTE',
                'sens' => 'SORTIE',
                'montant' => $transfert->montant,
                'transaction_id' => $transfert->id,
                'motif' => 'Dette soldée côté émetteur #' . $transfert->code
            ]);

            $this->ledger->debit(
                $transfert->agenceEnvoi,
                $transfert->montant,
                'TRANSFERT_DEBIT',
                $transfert->id,
                $user->id,
                $code,
                'Dette agence émettrice'
            );

            $this->ledger->credit(
                $agenceRetrait,
                $transfert->montant,
                'TRANSFERT_CREDIT',
                $transfert->id,
                $user->id,
                $code,
                'Créance agence destinataire'
            );

            $caisseService = app(\App\Services\CaisseService::class);
            $caisseService->sortie(
                $caisse->id,
                $transfert->montant,
                'RETRAIT_TRANSFERT',
                $user->id,
                $code,
                $transfert->id
            );

            $this->engagement->desengager($transfert, 'RETIRE');

            $transfert->update([
                'statut' => 'RETIRE',
                'date_retrait' => now(),
                'utilisateur_retrait_id' => $user->id,
                'retrait_key' => $retraitKey
            ]);

            $this->ledger->mettreAJourSoldeCache($transfert->agence_envoi_id);
            $this->ledger->mettreAJourSoldeCache($transfert->agence_retrait_id);

            $this->audit->logTransfertRetrait($transfert);

            return $transfert;
        });
    }

    public function annuler(string $code, User $user, ?string $motif = null): Transfert
    {
        return DB::transaction(function () use ($code, $user, $motif) {
            $code = strtoupper(trim($code));

            $transfert = Transfert::where('code', $code)
                ->lockForUpdate()
                ->first();

            if (!$transfert) {
                throw new TransfertException('Transfert introuvable', 404);
            }

            if ($transfert->statut === 'RETIRE') {
                throw new TransfertException('Impossible d\'annuler un transfert déjà retiré', 422);
            }

            if ($transfert->statut === 'ANNULE') {
                throw new TransfertException('Transfert déjà annulé', 422);
            }

            if ($user->role !== 'SUPERADMIN' && $user->agence_id !== $transfert->agence_envoi_id) {
                throw new TransfertException('Accès interdit', 403);
            }

            $ancienStatut = $transfert->statut;

            // ✅ Annulation: inverser les mouvements
            $this->mouvementService->create([
                'agence_id' => $transfert->agence_envoi_id,
                'type' => 'CASH',
                'sens' => 'SORTIE',
                'montant' => $transfert->montant + $transfert->frais,
                'transaction_id' => $transfert->id,
                'motif' => 'Annulation transfert #' . $transfert->code
            ]);

            $this->mouvementService->create([
                'agence_id' => $transfert->agence_envoi_id,
                'type' => 'DETTE',
                'sens' => 'SORTIE',
                'montant' => $transfert->montant,
                'transaction_id' => $transfert->id,
                'motif' => 'Annulation dette #' . $transfert->code
            ]);

            $this->mouvementService->create([
                'agence_id' => $transfert->agence_envoi_id,
                'type' => 'FRAIS',
                'sens' => 'SORTIE',
                'montant' => $transfert->frais,
                'transaction_id' => $transfert->id,
                'motif' => 'Annulation frais #' . $transfert->code
            ]);

            $this->engagement->desengager($transfert, 'ANNULE');

            $transfert->update([
                'statut' => 'ANNULE',
                'date_annulation' => now(),
                'utilisateur_annulation_id' => $user->id,
                'motif_annulation' => $motif ?? 'Annulation par utilisateur',
            ]);

            $this->audit->logTransfertAnnulation($transfert, $motif ?? 'Annulation');

            return $transfert;
        });
    }
}
