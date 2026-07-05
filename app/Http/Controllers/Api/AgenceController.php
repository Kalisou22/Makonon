<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agence;
use App\Models\Caisse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AgenceController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            // ✅ SUPERADMIN et ADMIN voient toutes les agences (sauf FRAIS, SYSTEM, CAISSE)
            // ✅ RESPONSABLE et AGENT voient toutes les agences actives (pour les transferts)
            $query = Agence::whereNotIn('code', ['FRAIS', 'SYSTEM', 'CAISSE'])
                ->where('actif', 1);
            
            $perPage = (int) $request->input('per_page', 20);
            $agences = $query->orderBy('id')->paginate($perPage);
            
            // ✅ Ajouter les informations de caisse pour chaque agence
            $agences->getCollection()->transform(function ($agence) {
                $caisse = Caisse::where('agence_id', $agence->id)->first();
                $agence->caisse = $caisse;
                return $agence;
            });
            
            return response()->json($agences);
        } catch (\Exception $e) {
            Log::error('AgenceController@index: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = $request->user();
            if (!in_array($user->role, ['SUPERADMIN', 'ADMIN'])) {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }
            
            $validated = $request->validate([
                'code' => 'required|string|unique:agences,code|max:50',
                'nom' => 'required|string|max:255',
                'adresse' => 'nullable|string',
                'telephone' => 'nullable|string|max:30',
                'email' => 'nullable|email|max:255',
                'responsable' => 'nullable|string|max:255',
                'devise' => 'nullable|string|max:10',
                'actif' => 'boolean'
            ]);
            
            // ✅ Créer l'agence
            $agence = Agence::create($validated);
            
            // ✅ Créer automatiquement une caisse pour l'agence
            Caisse::create([
                'agence_id' => $agence->id,
                'solde_physique' => 0,
                'solde_comptable' => 0,
            ]);
            
            return response()->json([
                'message' => 'Agence créée avec succès',
                'data' => $agence
            ], 201);
        } catch (\Exception $e) {
            Log::error('AgenceController@store: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $agence = Agence::findOrFail($id);
            $caisse = Caisse::where('agence_id', $agence->id)->first();
            $agence->caisse = $caisse;
            return response()->json(['data' => $agence]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Agence non trouvée'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = $request->user();
            if (!in_array($user->role, ['SUPERADMIN', 'ADMIN'])) {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }
            
            $agence = Agence::findOrFail($id);
            $agence->update($request->all());
            return response()->json([
                'message' => 'Agence mise à jour avec succès',
                'data' => $agence
            ]);
        } catch (\Exception $e) {
            Log::error('AgenceController@update: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = $request->user();
            if (!in_array($user->role, ['SUPERADMIN', 'ADMIN'])) {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }
            
            $agence = Agence::findOrFail($id);
            
            // ✅ Empêcher la suppression des agences système
            if (in_array($agence->code, ['FRAIS', 'SYSTEM', 'CAISSE'])) {
                return response()->json(['message' => 'Impossible de supprimer une agence système'], 403);
            }
            
            // ✅ Vérifier si l'agence a des transferts
            if ($agence->transfertsEnvois()->exists() || $agence->transfertsRetraits()->exists()) {
                return response()->json([
                    'message' => 'Impossible de supprimer une agence qui a des transferts'
                ], 422);
            }
            
            // ✅ Supprimer la caisse associée
            Caisse::where('agence_id', $agence->id)->delete();
            
            $agence->delete();
            return response()->json(['message' => 'Agence supprimée avec succès']);
        } catch (\Exception $e) {
            Log::error('AgenceController@destroy: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
