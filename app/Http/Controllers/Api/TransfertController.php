<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TransfertRequest;
use App\Models\Transfert;
use App\Models\Client;
use App\Models\Agence;
use App\Models\User;
use App\Services\LedgerService;
use App\Exceptions\FondsInsuffisantsException;
use App\Exceptions\TransfertException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransfertController extends Controller
{
    protected LedgerService $ledgerService;

    public function __construct(LedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    /**
     * Créer un transfert
     */
    public function creer(Request $request)
    {
        $user = auth()->user();
        
        // Validation manuelle
        $validated = $request->validate([
            'nom_expediteur' => 'required|string|max:100',
            'telephone_expediteur' => 'required|string|max:30',
            'nom_beneficiaire' => 'required|string|max:100',
            'telephone_beneficiaire' => 'required|string|max:30',
            'montant' => 'required|numeric|min:100|max:999999999.99',
            'agence_envoi_id' => 'required|exists:agences,id',
            'agence_destinataire_id' => 'required|exists:agences,id|different:agence_envoi_id',
        ]);

        $agenceEmettrice = Agence::findOrFail($validated['agence_envoi_id']);
        $agenceDestinataire = Agence::findOrFail($validated['agence_destinataire_id']);

        // Créer ou récupérer l'expéditeur
        $expediteur = Client::firstOrCreate(
            ['telephone' => $validated['telephone_expediteur']],
            ['nom' => $validated['nom_expediteur']]
        );

        // Créer ou récupérer le bénéficiaire
        $beneficiaire = Client::firstOrCreate(
            ['telephone' => $validated['telephone_beneficiaire']],
            ['nom' => $validated['nom_beneficiaire']]
        );

        return DB::transaction(function () use ($validated, $user, $agenceEmettrice, $agenceDestinataire, $expediteur, $beneficiaire) {
            // 1. Vérifier le solde de l'agence émettrice
            if (!$this->ledgerService->verifierSolde($agenceEmettrice->id, $validated['montant'])) {
                $solde = $this->ledgerService->getSolde($agenceEmettrice->id);
                throw new FondsInsuffisantsException($solde, $validated['montant']);
            }

            // 2. Générer le code unique
            $code = $this->genererCodeTransfert();

            // 3. Calculer les frais
            $frais = $this->calculerFrais($validated['montant']);
            $commission = $frais * 0.75; // 75% des frais

            // 4. Créer le transfert
            $transfert = Transfert::create([
                'code' => $code,
                'expediteur_id' => $expediteur->id,
                'beneficiaire_id' => $beneficiaire->id,
                'agence_envoi_id' => $agenceEmettrice->id,
                'agence_retrait_id' => $agenceDestinataire->id,
                'utilisateur_envoi_id' => $user->id,
                'montant' => $validated['montant'],
                'frais' => $frais,
                'commission' => $commission,
                'statut' => 'ENVOYE',
                'date_envoi' => now(),
            ]);

            // 5. Débiter l'agence émettrice
            $this->ledgerService->debit(
                $agenceEmettrice,
                $validated['montant'],
                'TRANSFERT_EMIS',
                $transfert->id,
                $user->id,
                $code,
                "Transfert émis vers {$agenceDestinataire->nom}"
            );

            // 6. Créditer l'agence destinataire
            $this->ledgerService->credit(
                $agenceDestinataire,
                $validated['montant'],
                'TRANSFERT_RECU',
                $transfert->id,
                $user->id,
                $code,
                "Transfert reçu de {$agenceEmettrice->nom} - Code: {$code}"
            );

            return response()->json([
                'message' => 'Transfert créé avec succès',
                'data' => [
                    'transfert' => $transfert,
                    'code' => $code,
                    'montant' => $validated['montant'],
                    'frais' => $frais,
                    'commission' => $commission,
                    'solde_agence' => $this->ledgerService->getSolde($agenceEmettrice->id),
                ]
            ], 201);
        });
    }

    /**
     * Générer un code de transfert unique
     */
    private function genererCodeTransfert(): string
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
        if ($montant <= 100000) {
            return 1000;
        } elseif ($montant <= 500000) {
            return 2000;
        } elseif ($montant <= 1000000) {
            return 3000;
        } else {
            return 5000;
        }
    }

    // Les autres méthodes (retirer, annuler, verifier, index, soldeAgence) restent identiques
    // À copier depuis l'ancien fichier si nécessaire
}
