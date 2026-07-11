<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Caisse;
use App\Services\LedgerService;
use App\Services\EngagementService;

class CheckCaisseConsistency
{
    protected LedgerService $ledger;
    protected EngagementService $engagement;

    public function __construct(LedgerService $ledger, EngagementService $engagement)
    {
        $this->ledger = $ledger;
        $this->engagement = $engagement;
    }

    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if (!$user || $user->role === 'SUPERADMIN') {
            return $next($request);
        }

        $agenceId = $user->agence_id;
        if (!$agenceId) {
            return $next($request);
        }

        $caisse = Caisse::where('agence_id', $agenceId)->first();
        if (!$caisse) {
            return $next($request);
        }

        $soldeReel = $this->ledger->getSolde($agenceId);
        $soldeEngage = $this->engagement->getSoldeEngage($agenceId);
        $soldeDisponible = $soldeReel - $soldeEngage;

        if (abs($caisse->solde_physique - $soldeDisponible) > 0.01) {
            \Illuminate\Support\Facades\Log::error('Désynchronisation caisse', [
                'agence_id' => $agenceId,
                'caisse' => $caisse->solde_physique,
                'disponible' => $soldeDisponible,
                'ecart' => $caisse->solde_physique - $soldeDisponible
            ]);
        }

        return $next($request);
    }
}
