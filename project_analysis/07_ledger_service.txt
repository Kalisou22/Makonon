<?php
namespace App\Services;

use App\Models\Ledger;
use App\Models\Agence;
use Illuminate\Support\Facades\DB;

class LedgerService
{
    public function credit(Agence $agence, float $montant, string $nature, ?int $transfertId, int $utilisateurId): Ledger
    {
        $soldeAvant = $this->getSolde($agence->id);
        $soldeApres = $soldeAvant + $montant;
        
        return Ledger::create([
            'agence_id' => $agence->id,
            'transfert_id' => $transfertId,
            'type' => 'CREDIT',
            'nature' => $nature,
            'montant' => $montant,
            'solde_avant' => $soldeAvant,
            'solde_apres' => $soldeApres,
            'utilisateur_id' => $utilisateurId
        ]);
    }
    
    public function debit(Agence $agence, float $montant, string $nature, ?int $transfertId, int $utilisateurId): Ledger
    {
        $soldeAvant = $this->getSolde($agence->id);
        $soldeApres = $soldeAvant - $montant;
        
        if ($soldeApres < 0) {
            throw new \Exception("Solde insuffisant. Solde: {$soldeAvant}, Montant: {$montant}");
        }
        
        return Ledger::create([
            'agence_id' => $agence->id,
            'transfert_id' => $transfertId,
            'type' => 'DEBIT',
            'nature' => $nature,
            'montant' => $montant,
            'solde_avant' => $soldeAvant,
            'solde_apres' => $soldeApres,
            'utilisateur_id' => $utilisateurId
        ]);
    }
    
    public function getSolde(int $agenceId): float
    {
        return Ledger::where('agence_id', $agenceId)
            ->sum(DB::raw("CASE WHEN type = 'CREDIT' THEN montant ELSE -montant END")) ?: 0;
    }
}
