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
        $agenceId = $request->route('agenceId');

        if (!$user) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if ($user->role !== 'SUPERADMIN' && $user->agence_id != $agenceId) {
            return response()->json(['message' => 'Accès non autorisé à cette agence'], 403);
        }

        return $next($request);
    }
}
