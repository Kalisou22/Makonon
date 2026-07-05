<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        // ✅ Vérifier que l'utilisateur a un des rôles autorisés
        if (!in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'Accès non autorisé. Rôle requis: ' . implode(', ', $roles),
                'user_role' => $user->role
            ], 403);
        }

        return $next($request);
    }
}
