<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class UtilisateurController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 20);
            $users = User::with('agence')->paginate($perPage);
            return response()->json($users);
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

            $rules = [
                'nom' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:utilisateurs,email,' . $id,
                'role' => 'sometimes|string|in:SUPERADMIN,ADMIN,RESPONSABLE,AGENT',
                'agence_id' => 'nullable|exists:agences,id',
                'actif' => 'boolean'
            ];

            if ($request->has('password') && !empty($request->password)) {
                $rules['password'] = 'string|min:8';
            }

            $validated = $request->validate($rules);

            $userData = [];
            if (isset($validated['nom'])) $userData['nom'] = $validated['nom'];
            if (isset($validated['email'])) $userData['email'] = $validated['email'];
            if (isset($validated['role'])) $userData['role'] = $validated['role'];
            if (isset($validated['agence_id'])) $userData['agence_id'] = $validated['agence_id'];
            if (isset($validated['actif'])) $userData['actif'] = $validated['actif'];
            if (isset($validated['password']) && !empty($validated['password'])) {
                $userData['password_hash'] = Hash::make($validated['password']);
            }

            $user->update($userData);

            return response()->json([
                'message' => 'Utilisateur mis à jour avec succès',
                'data' => $user->load('agence')
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
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

            // Empêcher la suppression du SUPERADMIN
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
