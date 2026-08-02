<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class IdempotencyMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $key = $request->header('Idempotency-Key');

        if (!$key) {
            return response()->json([
                'error' => 'Idempotency-Key manquant'
            ], 400);
        }

        if (Cache::has($key)) {
            return response()->json([
                'error' => 'Requête déjà traitée'
            ], 409);
        }

        Cache::put($key, true, 60);

        return $next($request);
    }
}