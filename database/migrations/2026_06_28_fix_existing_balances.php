<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Agence;
use App\Models\Ledger;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        foreach (Agence::all() as $agence) {
            $solde = (float) Ledger::where('agence_id', $agence->id)
                ->select(DB::raw('COALESCE(SUM(CASE WHEN type = "CREDIT" THEN montant ELSE -montant END), 0) as solde'))
                ->value('solde');
            
            $agence->solde_cache = $solde;
            $agence->save();
        }
    }

    public function down()
    {
        // Ne rien faire
    }
};
