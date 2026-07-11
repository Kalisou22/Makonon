<?php

namespace App\Services;

use App\Models\Engagement;
use App\Models\Transfert;
use App\Exceptions\TransfertException;
use Illuminate\Support\Facades\DB;

class EngagementService
{
    public function engager(Transfert $transfert, int $agenceId, float $montant): Engagement
    {
        return Engagement::create([
            'transfert_id' => $transfert->id,
            'agence_id' => $agenceId,
            'montant' => $montant,
            'statut' => 'ENGAGE'
        ]);
    }

    public function desengager(Transfert $transfert, string $statut = 'RETIRE'): void
    {
        Engagement::where('transfert_id', $transfert->id)
            ->where('statut', 'ENGAGE')
            ->update(['statut' => $statut]);
    }

    public function getSoldeEngage(int $agenceId): float
    {
        return (float) Engagement::where('agence_id', $agenceId)
            ->where('statut', 'ENGAGE')
            ->sum('montant');
    }

    public function getSoldeDisponible(int $agenceId, LedgerService $ledgerService): float
    {
        $soldeReel = $ledgerService->getSolde($agenceId);
        $soldeEngage = $this->getSoldeEngage($agenceId);
        return $soldeReel - $soldeEngage;
    }
}
