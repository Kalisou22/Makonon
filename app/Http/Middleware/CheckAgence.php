<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckAgence
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'Non authentifié'
            ], 401);
        }

        // SUPERADMIN peut tout voir
        if ($user->role === 'SUPERADMIN') {
            return $next($request);
        }

        // Les autres ne voient que leur agence
        $agenceId = $request->route('agenceId') ?? $request->input('agence_id');
        
        if ($agenceId && $user->agence_id != $agenceId) {
            return response()->json([
                'message' => 'Accès non autorisé à cette agence'
            ], 403);
        }

        return $next($request);
    }
}
