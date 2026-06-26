<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\Utilisateur;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $user = Utilisateur::where('email', $request->email)->first();
        
        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            return response()->json(['error' => 'Identifiants incorrects'], 401);
        }
        
        if (!$user->actif) {
            return response()->json(['error' => 'Compte désactivé'], 403);
        }
        
        $token = $user->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'email' => $user->email,
                'role' => $user->role,
                'agence_id' => $user->agence_id
            ]
        ]);
    }
    
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté']);
    }
    
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
