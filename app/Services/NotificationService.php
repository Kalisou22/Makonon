<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    public static function send($user, $type, $message)
    {
        Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'message' => $message
        ]);
    }
}
