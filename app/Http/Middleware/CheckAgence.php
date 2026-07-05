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

        // Récupérer l'agence depuis la route ou la requête
        $agenceId = $request->route('agenceId') ?? $request->input('agence_id');

        // ✅ SOURCE DE VÉRITÉ = user->agence_id
        // ✅ Ignorer X-Agency-ID du frontend

        if ($agenceId && $user->agence_id != $agenceId) {
            return response()->json([
                'message' => 'Accès non autorisé à cette agence',
                'user_agence' => $user->agence_id,
                'requested_agence' => $agenceId
            ], 403);
        }

        return $next($request);
    }
}
