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

    /**
     * Créer un transfert avec son ledger
     */
    public function creer(array $data, User $user): Transfert
    {
        $agenceEmettrice = Agence::findOrFail($data['agence_envoi_id']);
        $agenceDestinataire = Agence::findOrFail($data['agence_destinataire_id']);

        // Créer ou récupérer l'expéditeur
        $expediteur = Client::firstOrCreate(
            ['telephone' => $data['telephone_expediteur']],
            ['nom' => $data['nom_expediteur']]
        );

        // Créer ou récupérer le bénéficiaire
        $beneficiaire = Client::firstOrCreate(
            ['telephone' => $data['telephone_beneficiaire']],
            ['nom' => $data['nom_beneficiaire']]
        );

        // 🔥 TRANSACTION UNIQUE - TOUT OU RIEN
        return DB::transaction(function () use ($data, $user, $agenceEmettrice, $agenceDestinataire, $expediteur, $beneficiaire) {
            // 1. Vérifier le solde de l'agence émettrice
            if (!$this->ledgerService->verifierSolde($agenceEmettrice->id, $data['montant'])) {
                $solde = $this->ledgerService->getSolde($agenceEmettrice->id);
                throw new FondsInsuffisantsException($solde, $data['montant']);
            }

            // 2. Générer le code unique
            $code = Transfert::generateCode();

            // 3. Calculer les frais
            $frais = $this->calculerFrais($data['montant']);
            $commission = $frais * 0.75;

            // 4. Créer le transfert
            $transfert = Transfert::create([
                'code' => $code,
                'expediteur_id' => $expediteur->id,
                'beneficiaire_id' => $beneficiaire->id,
                'agence_envoi_id' => $agenceEmettrice->id,
                'agence_retrait_id' => $agenceDestinataire->id,
                'utilisateur_envoi_id' => $user->id,
                'montant' => $data['montant'],
                'frais' => $frais,
                'commission' => $commission,
                'statut' => 'ENVOYE',
                'date_envoi' => now(),
            ]);

            // 5. 🔥 CRÉER LE LEDGER POUR LE DÉBIT (AVEC transfert_id)
            $this->creerLedgerDebit(
                $agenceEmettrice,
                $transfert,
                $user,
                $code
            );

            // 6. 🔥 CRÉER LE LEDGER POUR LE CRÉDIT (AVEC transfert_id)
            $this->creerLedgerCredit(
                $agenceDestinataire,
                $transfert,
                $user,
                $code
            );

            // 7. Mettre à jour le solde de l'agence (optionnel selon votre logique)
            // $this->updateAgenceSolde($agenceEmettrice, $transfert);

            Log::info('Transfert créé avec succès', [
                'transfert_id' => $transfert->id,
                'code' => $code,
                'montant' => $data['montant'],
                'utilisateur' => $user->id
            ]);

            return $transfert;
        });
    }

    /**
     * Créer l'entrée ledger pour le débit
     */
    private function creerLedgerDebit(Agence $agence, Transfert $transfert, User $user, string $code): Ledger
    {
        // 🔥 CRÉER LE LEDGER AVEC LE transfert_id DÉJÀ CRÉÉ
        return $this->ledgerService->debit(
            $agence,
            $transfert->montant,
            'TRANSFERT_EMIS',
            $transfert->id, // 🔥 transfert_id EXISTE
            $user->id,
            $code,
            "Transfert émis vers {$agence->nom} - Code: {$code}"
        );
    }

    /**
     * Créer l'entrée ledger pour le crédit
     */
    private function creerLedgerCredit(Agence $agence, Transfert $transfert, User $user, string $code): Ledger
    {
        // 🔥 CRÉER LE LEDGER AVEC LE transfert_id DÉJÀ CRÉÉ
        return $this->ledgerService->credit(
            $agence,
            $transfert->montant,
            'TRANSFERT_RECU',
            $transfert->id, // 🔥 transfert_id EXISTE
            $user->id,
            $code,
            "Transfert reçu de {$agence->nom} - Code: {$code}"
        );
    }

    /**
     * Calculer les frais
     */
    private function calculerFrais(float $montant): float
    {
        if ($montant <= 100000) return 1000;
        if ($montant <= 500000) return 2000;
        if ($montant <= 1000000) return 3000;
        return 5000;
    }
}
