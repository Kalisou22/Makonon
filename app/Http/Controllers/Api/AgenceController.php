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
            $perPage = $request->input('per_page', 20);
            $agences = Agence::paginate($perPage);
            
            return response()->json($agences);
        } catch (\Exception $e) {
            Log::error('Erreur AgenceController@index: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la récupération des agences',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
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
            
            return response()->json([
                'message' => 'Agence créée avec succès',
                'data' => $agence
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erreur AgenceController@store: ' . $e->getMessage());
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
            return response()->json(['data' => $agence]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Agence non trouvée'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $agence = Agence::findOrFail($id);
            $agence->update($request->all());
            return response()->json([
                'message' => 'Agence mise à jour avec succès',
                'data' => $agence
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur AgenceController@update: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $agence = Agence::findOrFail($id);
            $agence->delete();
            return response()->json(['message' => 'Agence supprimée avec succès']);
        } catch (\Exception $e) {
            Log::error('Erreur AgenceController@destroy: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
