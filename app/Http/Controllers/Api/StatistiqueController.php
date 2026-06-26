<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transfert;
use App\Models\Ledger;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatistiqueController extends Controller
{
    public function dashboard(Request $request)
    {
        $agenceId = $request->user()->agence_id;
        
        $stats = [
            'total_transferts' => Transfert::where('agence_envoi_id', $agenceId)
                ->orWhere('agence_retrait_id', $agenceId)
                ->count(),
            'transferts_en_attente' => Transfert::where('statut', 'EN_ATTENTE')
                ->where(function($q) use ($agenceId) {
                    $q->where('agence_envoi_id', $agenceId)
                      ->orWhere('agence_retrait_id', $agenceId);
                })
                ->count(),
            'total_clients' => Client::count(),
            'volume_journalier' => Ledger::where('agence_id', $agenceId)
                ->whereDate('created_at', now()->toDateString())
                ->sum(DB::raw("CASE WHEN type = 'CREDIT' THEN montant ELSE -montant END")),
            'solde_agence' => Ledger::where('agence_id', $agenceId)
                ->sum(DB::raw("CASE WHEN type = 'CREDIT' THEN montant ELSE -montant END"))
        ];
        
        return response()->json($stats);
    }
}
