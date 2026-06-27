<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ledger;
use App\Models\Agence;
use Illuminate\Http\Request;

class LedgerController extends Controller
{
    /**
     * Liste des écritures ledger
     */
    public function index(Request $request)
    {
        $query = Ledger::with(['agence', 'utilisateur', 'transfert']);

        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->nature) {
            $query->where('nature', $request->nature);
        }

        if ($request->date_debut) {
            $query->whereDate('created_at', '>=', $request->date_debut);
        }

        if ($request->date_fin) {
            $query->whereDate('created_at', '<=', $request->date_fin);
        }

        $ledger = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($ledger);
    }

    /**
     * Ledger par agence
     */
    public function byAgence(int $agenceId, Request $request)
    {
        $agence = Agence::findOrFail($agenceId);

        $query = Ledger::where('agence_id', $agenceId)
            ->with(['utilisateur', 'transfert']);

        if ($request->type) {
            $query->where('type', $request->type);
        }

        $ledger = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json([
            'agence' => $agence,
            'ledger' => $ledger,
            'solde' => (new \App\Services\LedgerService())->getSolde($agenceId)
        ]);
    }
}
