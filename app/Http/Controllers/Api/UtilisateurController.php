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
            $user = $request->user();
            if (!in_array($user->role, ['SUPERADMIN', 'ADMIN'])) {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }
            
            $perPage = (int) $request->input('per_page', 20);
            $users = User::with('agence')->paginate($perPage);
            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('UtilisateurController@index: ' . $e->getMessage());
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
            $newUser = User::create($userData);
            return response()->json(['message' => 'Utilisateur créé avec succès', 'data' => $newUser], 201);
        } catch (\Exception $e) {
            Log::error('UtilisateurController@store: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur'], 500);
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
            $user = $request->user();
            if (!in_array($user->role, ['SUPERADMIN', 'ADMIN'])) {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }
            
            $utilisateur = User::findOrFail($id);
            $data = $request->all();
            if (isset($data['password']) && !empty($data['password'])) {
                $data['password_hash'] = Hash::make($data['password']);
            }
            unset($data['password']);
            $utilisateur->update($data);
            return response()->json(['message' => 'Utilisateur mis à jour avec succès', 'data' => $utilisateur]);
        } catch (\Exception $e) {
            Log::error('UtilisateurController@update: ' . $e->getMessage());
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
            
            $utilisateur = User::findOrFail($id);
            if ($utilisateur->role === 'SUPERADMIN') {
                return response()->json(['message' => 'Impossible de supprimer le compte SUPERADMIN'], 403);
            }
            $utilisateur->delete();
            return response()->json(['message' => 'Utilisateur supprimé avec succès']);
        } catch (\Exception $e) {
            Log::error('UtilisateurController@destroy: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur'], 500);
        }
    }
}
