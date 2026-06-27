<?php

namespace App\Services;

use App\Models\Transfert;
use App\Models\Client;
use App\Models\Agence;
use App\Models\User;
use App\Exceptions\FondsInsuffisantsException;
use App\Exceptions\TransfertException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransfertService
{
    protected LedgerService $ledgerService;

    public function __construct(LedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    /**
     * Créer un transfert
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

        return DB::transaction(function () use ($data, $user, $agenceEmettrice, $agenceDestinataire, $expediteur, $beneficiaire) {
            // 1. Vérifier le solde
            if (!$this->ledgerService->verifierSolde($agenceEmettrice->id, $data['montant'])) {
                $solde = $this->ledgerService->getSolde($agenceEmettrice->id);
                throw new FondsInsuffisantsException($solde, $data['montant']);
            }

            // 2. Générer le code unique
            $code = $this->genererCode();

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

    /**
     * Générer un code unique
     */
    private function genererCode(): string
    {
        do {
            $code = 'TRF' . now()->format('YmdHis') . rand(1000, 9999);
        } while (Transfert::where('code', $code)->exists());

        return $code;
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
