<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agence;
use Illuminate\Http\Request;

class AgenceController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Agence::query();
            
            if ($request->search) {
                $query->where('nom', 'like', '%' . $request->search . '%')
                      ->orWhere('code', 'like', '%' . $request->search . '%');
            }
            
            if ($request->has('actif')) {
                $query->where('actif', $request->actif);
            }
            
            $perPage = $request->per_page ?? 20;
            $agences = $query->orderBy('created_at', 'desc')->paginate($perPage);
            
            return response()->json($agences);
        } catch (\Exception $e) {
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
                'code' => 'required|string|unique:agences,code',
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
            return response()->json([
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Agence $agence)
    {
        try {
            return response()->json(['data' => $agence]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Agence non trouvée',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, Agence $agence)
    {
        try {
            $validated = $request->validate([
                'code' => 'sometimes|string|unique:agences,code,' . $agence->id,
                'nom' => 'sometimes|string|max:255',
                'adresse' => 'nullable|string',
                'telephone' => 'nullable|string|max:30',
                'email' => 'nullable|email|max:255',
                'responsable' => 'nullable|string|max:255',
                'devise' => 'nullable|string|max:10',
                'actif' => 'boolean'
            ]);

            $agence->update($validated);
            
            return response()->json([
                'message' => 'Agence mise à jour avec succès',
                'data' => $agence
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Agence $agence)
    {
        try {
            $agence->delete();
            return response()->json(['message' => 'Agence supprimée avec succès']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
