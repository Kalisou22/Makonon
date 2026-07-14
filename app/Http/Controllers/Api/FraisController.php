<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FraisService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FraisController extends Controller
{
    protected FraisService $fraisService;

    public function __construct(FraisService $fraisService)
    {
        $this->fraisService = $fraisService;
    }

    public function configurationActuelle()
    {
        try {
            $config = $this->fraisService->getConfigurationActuelle();
            return response()->json($config);
        } catch (\Exception $e) {
            Log::error('FraisController@configurationActuelle: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function historique()
    {
        try {
            $historique = $this->fraisService->getHistorique();
            return response()->json($historique);
        } catch (\Exception $e) {
            Log::error('FraisController@historique: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function calculer(Request $request)
    {
        try {
            $validated = $request->validate([
                'montant' => 'required|numeric|min:0',
            ]);

            $result = $this->fraisService->calculerFrais($validated['montant']);
            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('FraisController@calculer: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:100',
                'description' => 'nullable|string',
                'type' => 'required|in:FIXE,POURCENTAGE,ECHELONNE',
                'valeur' => 'required|numeric|min:0',
                'seuil_min' => 'nullable|numeric|min:0',
                'seuil_max' => 'nullable|numeric|min:0',
                'actif' => 'boolean',
                'date_debut' => 'nullable|date',
                'date_fin' => 'nullable|date|after:date_debut',
            ]);

            $user = $request->user();
            if (!$user || !in_array($user->role, ['SUPERADMIN', 'ADMIN'])) {
                return response()->json(['error' => 'Accès non autorisé'], 403);
            }

            $config = $this->fraisService->creerConfiguration($validated, $user->id);
            return response()->json($config, 201);
        } catch (\Exception $e) {
            Log::error('FraisController@store: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function desactiver(Request $request, $id)
    {
        try {
            $user = $request->user();
            if (!$user || !in_array($user->role, ['SUPERADMIN', 'ADMIN'])) {
                return response()->json(['error' => 'Accès non autorisé'], 403);
            }

            $result = $this->fraisService->desactiverConfiguration((int)$id);
            return response()->json(['success' => $result]);
        } catch (\Exception $e) {
            Log::error('FraisController@desactiver: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
