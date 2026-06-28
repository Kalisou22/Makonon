<?php

return [
    'default' => 'default',
    'documentations' => [
        'default' => [
            'api' => [
                'title' => 'Makonon Transfert API',
                'description' => 'API de transfert d\'argent avec ledger',
                'version' => '2.0.0',
            ],
            'routes' => [
                'docs' => 'api/documentation',
            ],
            'paths' => [
                'use_absolute_path' => true,
                'docs_json' => 'api-docs.json',
                'docs_yaml' => 'api-docs.yaml',
                'annotations' => [
                    base_path('app'),
                ],
            ],
        ],
    ],
    'security' => [
        'sanctum' => [
            'type' => 'http',
            'scheme' => 'bearer',
        ],
    ],
];
