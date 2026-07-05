
namespace App\Http;
use Illuminate\Foundation\Http\Kernel as HttpKernel;
class Kernel extends HttpKernel
    protected $middleware = [
        \Illuminate\Foundation\Http\Middleware\TrimStrings::class,

    protected $middlewareGroups = [
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    ];

    protected $routeMiddleware = [
        'can' => \Illuminate\Auth\Middleware\Authorize::class,
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
}
