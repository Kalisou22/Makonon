<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckAgenceAccess
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        $agenceId = $request->route('agenceId') ?? $request->input('agence_id');
        
        if (!$user) {
            return response()->json(['error' => 'Non authentifié'], 401);
        }
        
        if ($user->role !== 'SUPERADMIN' && $user->agence_id != $agenceId) {
            return response()->json(['error' => 'Accès interdit à cette agence'], 403);
        }
        
        return $next($request);
    }
}
