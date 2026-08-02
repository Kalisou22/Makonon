<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Services\AntiFraudService;
use App\Services\NotificationService;
use App\Services\PdfService;
use Exception;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'amount' => 'required|numeric|min:1',
            'receiver' => 'required|string'
        ]);

        try {
            AntiFraudService::checkDailyLimit($user, $request->amount);

            $transaction = Transaction::create([
                'user_id' => $user->id,
                'agency_id' => $user->agency_id,
                'amount' => $request->amount,
                'receiver' => $request->receiver,
                'status' => 'completed'
            ]);

            NotificationService::send(
                $user,
                'transaction',
                'Transaction de ' . number_format($request->amount, 0, ',', ' ') . ' FCFA effectuée'
            );

            return response()->json([
                'message' => 'Transaction réussie',
                'data' => $transaction
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function receipt($id)
    {
        $transaction = Transaction::findOrFail($id);
        return PdfService::receipt($transaction);
    }
}
