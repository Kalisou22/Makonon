<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string'
            ]);

            $user = User::where('email', $validated['email'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password_hash)) {
                return response()->json([
                    'message' => 'Identifiants invalides'
                ], 401);
            }

            if (!$user->actif) {
                return response()->json([
                    'message' => 'Compte désactivé'
                ], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Connexion réussie',
                'user' => $user->load('agence'),
                'token' => $token
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur AuthController@login: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la connexion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'Déconnexion réussie']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la déconnexion'], 500);
        }
    }

    public function me(Request $request)
    {
        try {
            return response()->json([
                'user' => $request->user()->load('agence')
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur'], 500);
        }
    }
}
