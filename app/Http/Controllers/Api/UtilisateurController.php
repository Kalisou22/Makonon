<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UtilisateurController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = User::with('agence');
            
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('nom', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%");
                });
            }
            
            if ($request->has('role') && $request->role) {
                $query->where('role', $request->role);
            }
            
            if ($request->has('agence_id') && $request->agence_id) {
                $query->where('agence_id', $request->agence_id);
            }
            
            $perPage = $request->input('per_page', 20);
            $utilisateurs = $query->orderBy('created_at', 'desc')->paginate($perPage);
            
            return response()->json($utilisateurs);
            
        } catch (\Exception $e) {
            Log::error('Erreur UtilisateurController@index: ' . $e->getMessage());
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
                'email' => 'required|email|unique:utilisateurs,email',
                'password' => 'required|string|min:8',
                'role' => 'required|string|in:SUPERADMIN,ADMIN,RESPONSABLE,AGENT',
                'agence_id' => 'required|exists:agences,id',
                'actif' => 'boolean'
            ]);

            $user = User::create([
                'nom' => $validated['nom'],
                'email' => $validated['email'],
                'password_hash' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'agence_id' => $validated['agence_id'],
                'actif' => $validated['actif'] ?? true
            ]);
            
            return response()->json([
                'message' => 'Utilisateur créé avec succès',
                'data' => $user->load('agence')
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Erreur UtilisateurController@store: ' . $e->getMessage());
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
                'email' => 'sometimes|email|unique:utilisateurs,email,' . $utilisateur->id,
                'password' => 'nullable|string|min:8',
                'role' => 'sometimes|string|in:SUPERADMIN,ADMIN,RESPONSABLE,AGENT',
                'agence_id' => 'sometimes|exists:agences,id',
                'actif' => 'boolean'
            ]);

            $updateData = [];
            
            if (isset($validated['nom'])) $updateData['nom'] = $validated['nom'];
            if (isset($validated['email'])) $updateData['email'] = $validated['email'];
            if (isset($validated['password'])) $updateData['password_hash'] = Hash::make($validated['password']);
            if (isset($validated['role'])) $updateData['role'] = $validated['role'];
            if (isset($validated['agence_id'])) $updateData['agence_id'] = $validated['agence_id'];
            if (isset($validated['actif'])) $updateData['actif'] = $validated['actif'];

            $utilisateur->update($updateData);
            
            return response()->json([
                'message' => 'Utilisateur mis à jour avec succès',
                'data' => $utilisateur->load('agence')
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erreur UtilisateurController@update: ' . $e->getMessage());
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
            Log::error('Erreur UtilisateurController@destroy: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
