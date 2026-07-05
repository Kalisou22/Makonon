<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AgenceController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            // ✅ SUPERADMIN et ADMIN voient toutes les agences
            // ✅ RESPONSABLE et AGENT voient toutes les agences (pour les transferts)
            // ✅ On filtre juste les agences système
            $query = Agence::whereNotIn('code', ['FRAIS', 'SYSTEM', 'CAISSE']);
            
            $perPage = (int) $request->input('per_page', 20);
            $agences = $query->orderBy('id')->paginate($perPage);
            
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
            $agence = Agence::create($validated);
            return response()->json(['message' => 'Agence créée avec succès', 'data' => $agence], 201);
        } catch (\Exception $e) {
            Log::error('AgenceController@store: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur'], 500);
        }
    }

    public function show($id)
    {
        try {
            $agence = Agence::findOrFail($id);
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
            return response()->json(['message' => 'Agence mise à jour avec succès', 'data' => $agence]);
        } catch (\Exception $e) {
            Log::error('AgenceController@update: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur'], 500);
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
            if (in_array($agence->code, ['FRAIS', 'SYSTEM', 'CAISSE'])) {
                return response()->json(['message' => 'Impossible de supprimer une agence système'], 403);
            }
            $agence->delete();
            return response()->json(['message' => 'Agence supprimée avec succès']);
        } catch (\Exception $e) {
            Log::error('AgenceController@destroy: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur'], 500);
        }
    }
}
