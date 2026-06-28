<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::statement("ALTER TABLE ledger MODIFY COLUMN nature ENUM(
            'ENVOI',
            'RECEPTION',
            'RETRAIT',
            'FRAIS',
            'COMMISSION',
            'COMPENSATION',
            'AJUSTEMENT',
            'ANNULATION',
            'ANNULATION_RETRAIT',
            'DEPOT_INITIAL',
            'TRANSFERT_EMIS',
            'TRANSFERT_RECU'
        )");
    }

    public function down()
    {
        DB::statement("ALTER TABLE ledger MODIFY COLUMN nature ENUM(
            'ENVOI',
            'RECEPTION',
            'RETRAIT',
            'FRAIS',
            'COMMISSION',
            'COMPENSATION',
            'AJUSTEMENT',
            'ANNULATION',
            'ANNULATION_RETRAIT'
        )");
    }
};
