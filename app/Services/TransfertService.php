<?php

namespace App\Services;

use App\Models\Transfert;
use App\Models\Client;
use App\Models\Agence;
use App\Models\User;
use App\Exceptions\FondsInsuffisantsException;
use App\Exceptions\TransfertException;
use Illuminate\Support\Facades\DB;

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

        // Créer l'expéditeur
        $expediteur = Client::firstOrCreate(
            ['telephone' => $data['telephone_expediteur']],
            ['nom' => $data['nom_expediteur']]
        );

        // Créer le bénéficiaire
        $beneficiaire = Client::firstOrCreate(
            ['telephone' => $data['telephone_beneficiaire']],
            ['nom' => $data['nom_beneficiaire']]
        );

        return DB::transaction(function () use ($data, $user, $agenceEmettrice, $agenceDestinataire, $expediteur, $beneficiaire) {
            // 1. Vérifier le solde
            if (!$this->ledgerService->verifierSolde($agenceEmettrice->id, $data['montant'])) {
                $solde = $this->ledgerService->getSolde($agenceEmettrice->id);
                throw new FondsInsuffisantsException($solde, $data['montant']);
            }

            // 2. Générer le code (via le modèle)
            $code = Transfert::generateCode();

            // 3. Calculer les frais
            $frais = $this->calculerFrais($data['montant']);
            $commission = $frais * 0.75;

            // 4. Créer le transfert (AVEC CODE)
            $transfert = Transfert::create([
                'code' => $code, // 🔥 MAINTENANT PRÉSENT
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

            // 5. Débiter l'agence émettrice
            $this->ledgerService->debit(
                $agenceEmettrice,
                $data['montant'],
                'TRANSFERT_EMIS',
                $transfert->id,
                $user->id,
                $code,
                "Transfert émis vers {$agenceDestinataire->nom}"
            );

            // 6. Créditer l'agence destinataire
            $this->ledgerService->credit(
                $agenceDestinataire,
                $data['montant'],
                'TRANSFERT_RECU',
                $transfert->id,
                $user->id,
                $code,
                "Transfert reçu de {$agenceEmettrice->nom}"
            );

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
