<?php
namespace App\Services;

class FraisService
{
    public function calculerFrais($montant)
    {
        return ['montant' => $montant * 0.05];
    }
    
    public function enregistrerHistorique($transfert, $montant, $fraisData)
    {
        return true;
    }
}
