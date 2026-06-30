<?php

return [
    'backup' => [
        'name' => env('APP_NAME', 'makonon-backup'),
        'source' => [
            'files' => [
                'include' => [
                    base_path(),
                ],
                'exclude' => [
                    base_path('vendor'),
                    base_path('node_modules'),
                    base_path('storage/framework'),
                    base_path('storage/logs'),
                ],
                'follow_links' => false,
            ],
            'databases' => [
                'mysql',
            ],
        ],
        'destination' => [
            'filename_prefix' => 'makonon-backup-',
            'disks' => [
                'local',
            ],
        ],
        'temporary_directory' => storage_path('app/backup-temp'),
    ],
    'notifications' => [
        'notifications' => [
            \Spatie\Backup\Notifications\Notifications\BackupHasFailedNotification::class => [],
            \Spatie\Backup\Notifications\Notifications\UnhealthyBackupWasFoundNotification::class => [],
            \Spatie\Backup\Notifications\Notifications\CleanupHasFailedNotification::class => [],
            \Spatie\Backup\Notifications\Notifications\BackupWasSuccessfulNotification::class => [],
            \Spatie\Backup\Notifications\Notifications\CleanupWasSuccessfulNotification::class => [],
        ],
        'notifiable' => \Spatie\Backup\Notifications\Notifiable::class,
        'mail' => [
            'to' => env('BACKUP_MAIL_TO', 'admin@example.com'),
        ],
    ],
    'cleanup' => [
        'strategy' => \Spatie\Backup\Tasks\Cleanup\Strategies\DefaultStrategy::class,
        'default_strategy' => [
            'keep_all_backups_for_days' => 7,
            'keep_daily_backups_for_days' => 16,
            'keep_weekly_backups_for_weeks' => 8,
            'keep_monthly_backups_for_months' => 4,
            'keep_yearly_backups_for_years' => 2,
            'delete_oldest_backups_when_using_more_megabytes_than' => 5000,
        ],
    ],
];
