<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Agence;

return new class extends Migration
{
    public function up()
    {
        Agence::firstOrCreate(
            ['code' => 'FRAIS'],
            [
                'nom' => 'Compte Frais de Transfert',
                'devise' => 'GNF',
                'actif' => true,
                'solde_cache' => 0,
            ]
        );
    }

    public function down()
    {
        Agence::where('code', 'FRAIS')->delete();
    }
};
