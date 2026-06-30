<?php

return [
    'dsn' => env('SENTRY_LARAVEL_DSN'),
    'release' => env('SENTRY_RELEASE'),
    'environment' => env('APP_ENV'),
];
