<?php
namespace App\Services;
use App\Models\Mouvement;
use Illuminate\Support\Facades\DB;

class MouvementService
{
    public function create(array $data)
    {
        return Mouvement::create($data);
    }
    
    public function getSoldeDisponible($agenceId)
    {
        $solde = DB::table('agences')->where('id', $agenceId)->value('solde_cache') ?? 0;
        return $solde;
    }
}
