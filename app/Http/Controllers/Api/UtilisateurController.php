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
            $perPage = (int) $request->input('per_page', 20);
            $user = $request->user();

            $query = User::with('agence');

            // ✅ SUPERADMIN voit tous les utilisateurs
            // ✅ Les autres voient uniquement les utilisateurs de leur agence
            if ($user && $user->role !== 'SUPERADMIN' && $user->agence_id) {
                $query->where('agence_id', $user->agence_id);
            }

            $users = $query->paginate($perPage);
            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Erreur UtilisateurController@index: ' . $e->getMessage() . ' - Ligne: ' . $e->getLine());
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
                'agence_id' => 'nullable|exists:agences,id',
                'actif' => 'boolean'
            ]);

            $userData = [
                'nom' => $validated['nom'],
                'email' => $validated['email'],
                'password_hash' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'agence_id' => $validated['agence_id'] ?? null,
                'actif' => $validated['actif'] ?? true
            ];

            $user = User::create($userData);

            return response()->json([
                'message' => 'Utilisateur créé avec succès',
                'data' => $user->load('agence')
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erreur UtilisateurController@store: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = User::with('agence')->findOrFail($id);
            return response()->json(['data' => $user]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            $data = $request->all();

            if (isset($data['password']) && !empty($data['password'])) {
                $data['password_hash'] = Hash::make($data['password']);
            }
            unset($data['password']);

            $user->update($data);

            return response()->json([
                'message' => 'Utilisateur mis à jour avec succès',
                'data' => $user->load('agence')
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur UtilisateurController@update: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            if ($user->role === 'SUPERADMIN') {
                return response()->json([
                    'message' => 'Impossible de supprimer le compte SUPERADMIN'
                ], 403);
            }

            $user->delete();

            return response()->json([
                'message' => 'Utilisateur supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur UtilisateurController@destroy: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
