// app/Http/Middleware/RoleMiddleware.php

namespace App\Http\Middleware;

use Closure;

class RoleMiddleware
{
    public function handle($request, Closure $next, ...$roles)
    {
        $user = $request->user();

        if (!$user || !in_array($user->role, $roles)) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        return $next($request);
    }
}