<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Agence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UtilisateurController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = User::with('agence');
            
            if ($request->search) {
                $query->where('nom', 'like', '%' . $request->search . '%')
                      ->orWhere('email', 'like', '%' . $request->search . '%');
            }
            
            if ($request->role) {
                $query->where('role', $request->role);
            }
            
            if ($request->agence_id) {
                $query->where('agence_id', $request->agence_id);
            }
            
            $perPage = $request->per_page ?? 20;
            $utilisateurs = $query->orderBy('created_at', 'desc')->paginate($perPage);
            
            return response()->json($utilisateurs);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des utilisateurs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
                'role' => 'required|string|in:SUPERADMIN,ADMIN,RESPONSABLE,AGENT',
                'agence_id' => 'required|exists:agences,id',
                'actif' => 'boolean'
            ]);

            $validated['password'] = Hash::make($validated['password']);
            $user = User::create($validated);
            
            return response()->json([
                'message' => 'Utilisateur créé avec succès',
                'data' => $user->load('agence')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(User $utilisateur)
    {
        try {
            return response()->json(['data' => $utilisateur->load('agence')]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Utilisateur non trouvé',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, User $utilisateur)
    {
        try {
            $validated = $request->validate([
                'nom' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $utilisateur->id,
                'password' => 'nullable|string|min:8',
                'role' => 'sometimes|string|in:SUPERADMIN,ADMIN,RESPONSABLE,AGENT',
                'agence_id' => 'sometimes|exists:agences,id',
                'actif' => 'boolean'
            ]);

            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            } else {
                unset($validated['password']);
            }

            $utilisateur->update($validated);
            
            return response()->json([
                'message' => 'Utilisateur mis à jour avec succès',
                'data' => $utilisateur->load('agence')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(User $utilisateur)
    {
        try {
            $utilisateur->delete();
            return response()->json(['message' => 'Utilisateur supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
