<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Créer SYSTEM
        DB::table('agences')->insertOrIgnore([
            'code' => 'SYSTEM',
            'nom' => 'Compte Système',
            'devise' => 'GNF',
            'solde_cache' => 0,
            'actif' => 1,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Créer CAISSE
        DB::table('agences')->insertOrIgnore([
            'code' => 'CAISSE',
            'nom' => 'Compte Caisse',
            'devise' => 'GNF',
            'solde_cache' => 0,
            'actif' => 1,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    public function down()
    {
        DB::table('agences')->whereIn('code', ['SYSTEM', 'CAISSE'])->delete();
    }
};
