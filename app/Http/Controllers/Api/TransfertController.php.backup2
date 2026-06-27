<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TransfertService;
use App\Exceptions\TransfertException;
use Illuminate\Http\Request;

class TransfertController extends Controller
{
    protected TransfertService $transfertService;

    public function __construct(TransfertService $transfertService)
    {
        $this->transfertService = $transfertService;
    }

    /**
     * Créer un transfert
     */
    public function creer(Request $request)
    {
        $validated = $request->validate([
            'nom_expediteur' => 'required|string|max:100',
            'telephone_expediteur' => 'required|string|max:30',
            'nom_beneficiaire' => 'required|string|max:100',
            'telephone_beneficiaire' => 'required|string|max:30',
            'montant' => 'required|numeric|min:100|max:999999999.99',
            'agence_envoi_id' => 'required|exists:agences,id',
            'agence_destinataire_id' => 'required|exists:agences,id|different:agence_envoi_id',
        ]);

        $user = auth()->user();

        try {
            $transfert = $this->transfertService->creer($validated, $user);

            return response()->json([
                'message' => 'Transfert créé avec succès',
                'data' => [
                    'id' => $transfert->id,
                    'code' => $transfert->code,
                    'montant' => $transfert->montant,
                    'frais' => $transfert->frais,
                    'statut' => $transfert->statut,
                ]
            ], 201);
        } catch (\Exception $e) {
            throw new TransfertException($e->getMessage(), 422);
        }
    }

    // Les autres méthodes restent identiques
}
