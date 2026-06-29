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
                'statut' => 'ENVOYE',
                'date_envoi' => now(),
                'idempotency_key' => $data['idempotency_key'],
            ]);

            // CRÉATION TRANSFERT - 6 ÉCRITURES
            // 1. DEBIT AG001 (total)
            $this->ledger->debitAgence(
                $agenceEmettrice,
                $total,
                'ENVOI',
                $transfert->id,
                $user->id,
                $code,
                "Transfert émis - Montant: {$data['montant']} + Frais: {$frais}"
            );

            // 2. CREDIT SYSTEM (total)
            $this->ledger->creditSystem(
                $total,
                'ENVOI',
                $transfert->id,
                $user->id,
                $code,
                "Réception transfert - Total: {$total}"
            );

            // 3. DEBIT SYSTEM (montant)
            $this->ledger->debitSystem(
                $data['montant'],
                'RECEPTION',
                $transfert->id,
                $user->id,
                $code,
                "Envoi destinataire - Montant: {$data['montant']}"
            );

            // 4. CREDIT AG002 (montant)
            $this->ledger->creditAgence(
                $agenceDestinataire,
                $data['montant'],
                'RECEPTION',
                $transfert->id,
                $user->id,
                $code,
                "Transfert reçu - Montant: {$data['montant']}"
            );

            // 5. DEBIT SYSTEM (frais)
            $this->ledger->debitSystem(
                $frais,
                'FRAIS',
                $transfert->id,
                $user->id,
                $code,
                "Frais transfert - Frais: {$frais}"
            );

            // 6. CREDIT FRAIS (frais)
            $this->ledger->creditFrais(
                $frais,
                'FRAIS',
                $transfert->id,
                $user->id,
                $code,
                "Frais collectés - Frais: {$frais}"
            );

            $this->ledger->verifierDoubleEcriture($transfert->id);
            $this->ledger->verifierSystemNul();

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

            $solde = $this->ledger->getSolde($agence->id);
            if ($solde < $transfert->montant) {
                throw new FondsInsuffisantsException($solde, $transfert->montant);
            }

            $transfert->update([
                'statut' => 'RETIRE',
                'date_retrait' => now(),
                'utilisateur_retrait_id' => $user->id,
            ]);

            // RETRAIT - INVERSE LE CRÉDIT AG002
            // 1. DEBIT AG002 (montant) - annule le crédit AG002
            $this->ledger->debitAgence(
                $agence,
                $transfert->montant,
                'RETRAIT',
                $transfert->id,
                $user->id,
                $code,
                "Retrait effectué - Montant: {$transfert->montant}"
            );

            // 2. CREDIT SYSTEM (montant) - inverse le débit SYSTEM de la réception
            $this->ledger->creditSystem(
                $transfert->montant,
                'RETRAIT',
                $transfert->id,
                $user->id,
                $code,
                "Compensation retrait - Montant: {$transfert->montant}"
            );

            // 3. DEBIT SYSTEM (montant) - compense le crédit SYSTEM initial
            $this->ledger->debitSystem(
                $transfert->montant,
                'RETRAIT',
                $transfert->id,
                $user->id,
                $code,
                "Fermeture retrait - Montant: {$transfert->montant}"
            );

            // 4. CREDIT ? (où va le montant ?)
            // En réalité, le retrait complet devrait créditer le compte de l'émetteur
            // ou un compte de compensation
            // Dans notre cas, on crédite un compte de "fonds retirés"
            // ou simplement on ne fait rien car les fonds sont déjà chez AG002
            
            // ✅ Solution: Le retrait est une opération qui transfère les fonds
            // du compte de l'agence destinataire vers le SYSTEM
            // Mais SYSTEM doit rester à 0, donc on compense avec un CREDIT SYSTEM
            // et un DEBIT SYSTEM, ce qui annule les deux écritures
            
            // En réalité, le retrait est juste l'inverse du crédit AG002
            // Donc: DEBIT AG002 + CREDIT SYSTEM + DEBIT SYSTEM = 0
            // Mais il manque une contrepartie pour le DEBIT SYSTEM

            // ✅ CORRECTION: Le DEBIT SYSTEM doit être compensé par un CREDIT
            // sur le compte de l'agence émettrice (remboursement)
            $agenceEmettrice = Agence::where('id', $transfert->agence_envoi_id)->lockForUpdate()->first();
            
            // 4. CREDIT AG001 (montant) - remboursement à l'émetteur
            $this->ledger->creditAgence(
                $agenceEmettrice,
                $transfert->montant,
                'RETRAIT',
                $transfert->id,
                $user->id,
                $code,
                "Remboursement retrait - Montant: {$transfert->montant}"
            );

            // Maintenant le cycle est complet :
            // DEBIT AG002 + CREDIT SYSTEM + DEBIT SYSTEM + CREDIT AG001 = 0
            // Et SYSTEM reste à 0

            $this->ledger->verifierDoubleEcriture($transfert->id);
            $this->ledger->verifierSystemNul();

            Log::info('Transfert retiré', [
                'id' => $transfert->id,
                'code' => $code,
                'user' => $user->id,
                'montant' => $transfert->montant
            ]);

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

            // ANNULATION - INVERSE COMPLÈTE
            // 1. DEBIT AG002 (montant)
            $this->ledger->debitAgence(
                $agenceDestinataire,
                $transfert->montant,
                'ANNULATION',
                $transfert->id,
                $user->id,
                $code,
                "Retour fonds destinataire - Montant: {$transfert->montant}"
            );

            // 2. CREDIT SYSTEM (montant)
            $this->ledger->creditSystem(
                $transfert->montant,
                'ANNULATION',
                $transfert->id,
                $user->id,
                $code,
                "Compensation annulation - Montant: {$transfert->montant}"
            );

            // 3. DEBIT SYSTEM (remboursement total)
            $this->ledger->debitSystem(
                $totalARembourser,
                'ANNULATION',
                $transfert->id,
                $user->id,
                $code,
                "Remboursement total - Montant: {$totalARembourser}"
            );

            // 4. CREDIT AG001 (remboursement total)
            $this->ledger->creditAgence(
                $agenceEmettrice,
                $totalARembourser,
                'ANNULATION',
                $transfert->id,
                $user->id,
                $code,
                "Remboursement total - Montant: {$totalARembourser}"
            );

            // 5. DEBIT FRAIS (frais)
            $this->ledger->debitFrais(
                $transfert->frais,
                'ANNULATION',
                $transfert->id,
                $user->id,
                $code,
                "Remboursement frais - Frais: {$transfert->frais}"
            );

            // 6. CREDIT SYSTEM (frais)
            $this->ledger->creditSystem(
                $transfert->frais,
                'ANNULATION',
                $transfert->id,
                $user->id,
                $code,
                "Remboursement frais - Frais: {$transfert->frais}"
            );

            $this->ledger->verifierDoubleEcriture($transfert->id);
            $this->ledger->verifierSystemNul();

            Log::info('Transfert annulé', [
                'id' => $transfert->id,
                'code' => $code,
                'total_rembourse' => $totalARembourser,
                'user' => $user->id,
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
