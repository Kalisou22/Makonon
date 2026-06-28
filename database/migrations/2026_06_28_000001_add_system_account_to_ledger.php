<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('ledger', function (Blueprint $table) {
            if (!Schema::hasColumn('ledger', 'agence_id')) {
                $table->foreignId('agence_id')->nullable()->change();
            }
        });

        // Ajouter une entrée système pour l'agence 0
        DB::table('agences')->insert([
            'id' => 0,
            'code' => 'SYSTEM',
            'nom' => 'Compte Système',
            'devise' => 'GNF',
            'actif' => 1,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    public function down()
    {
        DB::table('agences')->where('id', 0)->delete();
    }
};
