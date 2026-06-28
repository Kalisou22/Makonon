    protected $middlewareGroups = [
        'api' => [
            \App\Http\Middleware\ForceJsonResponse::class,
            \Illuminate\Routing\Middleware\ThrottleRequests::class . ':api',
        ],
    ];

    protected $middlewareAliases = [
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'throttle.api' => \Illuminate\Routing\Middleware\ThrottleRequests::class . ':api',
    ];
