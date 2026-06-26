<?php
namespace App\Services;

use App\Models\Caisse;
use App\Models\MouvementCaisse;

class CaisseService
{
    public function entree(int $caisseId, float $montant, string $motif, int $utilisateurId, ?string $reference = null): MouvementCaisse
    {
        $caisse = Caisse::findOrFail($caisseId);
        $caisse->increment('solde_physique', $montant);
        $caisse->increment('solde_comptable', $montant);
        
        return MouvementCaisse::create([
            'caisse_id' => $caisseId,
            'type' => 'ENTREE',
            'motif' => $motif,
            'montant' => $montant,
            'reference' => $reference,
            'utilisateur_id' => $utilisateurId
        ]);
    }
    
    public function sortie(int $caisseId, float $montant, string $motif, int $utilisateurId, ?string $reference = null): MouvementCaisse
    {
        $caisse = Caisse::findOrFail($caisseId);
        
        if ($caisse->solde_physique < $montant) {
            throw new \Exception("Solde physique insuffisant");
        }
        
        $caisse->decrement('solde_physique', $montant);
        $caisse->decrement('solde_comptable', $montant);
        
        return MouvementCaisse::create([
            'caisse_id' => $caisseId,
            'type' => 'SORTIE',
            'motif' => $motif,
            'montant' => $montant,
            'reference' => $reference,
            'utilisateur_id' => $utilisateurId
        ]);
    }
    
    public function getSolde(int $caisseId): array
    {
        $caisse = Caisse::findOrFail($caisseId);
        return [
            'solde_physique' => $caisse->solde_physique,
            'solde_comptable' => $caisse->solde_comptable,
            'ecart' => $caisse->solde_physique - $caisse->solde_comptable
        ];
    }
}
