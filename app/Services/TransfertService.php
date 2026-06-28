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

            if ($total > self::MAX_MONTANT) {
                throw new TransfertException(
                    "Le montant total (incluant les frais) ne peut dépasser " . number_format(self::MAX_MONTANT, 0) . " GNF",
                    422
                );
            }

            $solde = $this->ledger->getSoldeWithLock($agenceEmettrice->id);
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
                'statut' => 'ENVOYE',
                'date_envoi' => now(),
                'idempotency_key' => $data['idempotency_key'],
            ]);

            // ============================================================
            // 🔥 FLUX COMPTABLE AVEC SYSTEM COMME PIVOT (STRICT)
            // ============================================================
            // 1. AG001 (DEBIT) → SYSTEM (CREDIT) pour total (montant + frais)
            $this->ledger->debit($agenceEmettrice, $total, 'TRANSFERT_EMIS', $transfert->id, $user->id, $code, "Transfert émis");
            $this->ledger->creditSystem($total, 'TRANSFERT_EMIS', $transfert->id, $user->id, $code, "Réception transfert");

            // 2. SYSTEM (DEBIT) → AG002 (CREDIT) pour montant uniquement
            $this->ledger->debitSystem($data['montant'], 'TRANSFERT_RECU', $transfert->id, $user->id, $code, "Envoi au destinataire");
            $this->ledger->credit($agenceDestinataire, $data['montant'], 'TRANSFERT_RECU', $transfert->id, $user->id, $code, "Transfert reçu");

            // 3. Vérification que SYSTEM = 0 (frais uniquement)
            $this->verifierSoldeSystem($frais);

            $this->ledger->verifierDoubleEcriture($transfert->id);

            Log::info('Transfert créé', [
                'id' => $transfert->id,
                'code' => $code,
                'montant' => $data['montant'],
                'frais' => $frais,
                'total' => $total
            ]);

            return $transfert;
        });
    }

    public function retirer(string $code, User $user): Transfert
    {
        return DB::transaction(function () use ($code, $user) {
            $code = strtoupper(trim($code));
            $transfert = Transfert::where('code', $code)->lockForUpdate()->first();

            if (!$transfert) {
                throw new TransfertException('Transfert introuvable', 404);
            }

            if ($transfert->statut === 'RETIRE') {
                throw new TransfertException('Déjà retiré', 400);
            }
            if ($transfert->statut === 'ANNULE') {
                throw new TransfertException('Annulé', 400);
            }
            if ($transfert->statut !== 'ENVOYE') {
                throw new TransfertException('Non disponible', 400);
            }

            $agence = Agence::where('id', $transfert->agence_retrait_id)->lockForUpdate()->first();

            if ($user->agence_id !== $agence->id && $user->role !== 'SUPERADMIN') {
                throw new TransfertException('Accès interdit', 403);
            }

            $solde = $this->ledger->getSoldeWithLock($agence->id);
            if ($solde < $transfert->montant) {
                throw new FondsInsuffisantsException($solde, $transfert->montant);
            }

            $transfert->update([
                'statut' => 'RETIRE',
                'date_retrait' => now(),
                'utilisateur_retrait_id' => $user->id,
            ]);

            // 🔥 RETRAIT : AG002 (DEBIT) → SYSTEM (CREDIT)
            $this->ledger->debit($agence, $transfert->montant, 'RETRAIT_EFFECTUE', $transfert->id, $user->id, $code, "Retrait effectué");
            $this->ledger->creditSystem($transfert->montant, 'RETRAIT_EFFECTUE', $transfert->id, $user->id, $code, "Compensation retrait");

            // Vérification que SYSTEM = 0
            $this->verifierSoldeSystem(0);

            $this->ledger->verifierDoubleEcriture($transfert->id);

            Log::info('Transfert retiré', ['id' => $transfert->id, 'code' => $code]);

            return $transfert;
        });
    }

    public function annuler(string $code, User $user, ?string $motif = null): Transfert
    {
        return DB::transaction(function () use ($code, $user, $motif) {
            $code = strtoupper(trim($code));
            $transfert = Transfert::where('code', $code)->lockForUpdate()->first();

            if (!$transfert) {
                throw new TransfertException('Transfert introuvable', 404);
            }

            if ($transfert->statut === 'RETIRE') {
                throw new TransfertException('Impossible d\'annuler un transfert déjà retiré', 400);
            }
            if ($transfert->statut === 'ANNULE') {
                throw new TransfertException('Transfert déjà annulé', 400);
            }
            if ($transfert->statut !== 'ENVOYE') {
                throw new TransfertException('Transfert déjà traité', 400);
            }

            $agenceEmettrice = Agence::where('id', $transfert->agence_envoi_id)->lockForUpdate()->first();
            $agenceDestinataire = Agence::where('id', $transfert->agence_retrait_id)->lockForUpdate()->first();

            if ($user->agence_id !== $agenceEmettrice->id && $user->role !== 'SUPERADMIN') {
                throw new TransfertException('Accès interdit', 403);
            }

            $totalARembourser = $transfert->montant + $transfert->frais;

            $transfert->update([
                'statut' => 'ANNULE',
                'date_annulation' => now(),
                'utilisateur_annulation_id' => $user->id,
                'motif_annulation' => $motif ?? 'Annulation par l\'utilisateur',
            ]);

            // 🔥 ANNULATION : INVERSION COMPLETE
            // 1. AG002 (DEBIT) → SYSTEM (CREDIT) pour le montant
            $this->ledger->debit($agenceDestinataire, $transfert->montant, 'ANNULATION_TRANSFERT', $transfert->id, $user->id, $code, "Retour fonds destinataire");
            $this->ledger->creditSystem($transfert->montant, 'ANNULATION_TRANSFERT', $transfert->id, $user->id, $code, "Compensation annulation");

            // 2. SYSTEM (DEBIT) → AG001 (CREDIT) pour remboursement total
            $this->ledger->debitSystem($totalARembourser, 'ANNULATION_TRANSFERT', $transfert->id, $user->id, $code, "Remboursement total");
            $this->ledger->credit($agenceEmettrice, $totalARembourser, 'ANNULATION_TRANSFERT', $transfert->id, $user->id, $code, "Remboursement total");

            // Vérification que SYSTEM = 0
            $this->verifierSoldeSystem(0);

            $this->ledger->verifierDoubleEcriture($transfert->id);

            Log::info('Transfert annulé', [
                'id' => $transfert->id,
                'code' => $code,
                'total_rembourse' => $totalARembourser,
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

    private function verifierSoldeSystem(float $frais): void
    {
        $system = $this->ledger->getSystemAccount();
        $solde = $this->ledger->getSolde($system->id);

        if (abs($solde - $frais) > 0.01) {
            Log::warning('Solde SYSTEM anormal', [
                'solde_actuel' => $solde,
                'frais' => $frais
            ]);
        }
    }
}
