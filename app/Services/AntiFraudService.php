<?php

namespace App\Services;

use App\Models\Transaction;
use Carbon\Carbon;
use Exception;

class AntiFraudService
{
    public static function checkDailyLimit($user, $amount)
    {
        if (!$user->daily_limit) {
            return true;
        }

        $total = Transaction::where('user_id', $user->id)
            ->whereDate('created_at', Carbon::today())
            ->sum('amount');

        if (($total + $amount) > $user->daily_limit) {
            throw new Exception('Plafond journalier dépassé');
        }

        return true;
    }
}
