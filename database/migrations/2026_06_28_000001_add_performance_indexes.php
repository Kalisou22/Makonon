<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Index pour transferts
        Schema::table('transferts', function (Blueprint $table) {
            if (!Schema::hasIndex('transferts', 'transferts_agence_envoi_id_index')) {
                $table->index('agence_envoi_id');
            }
            if (!Schema::hasIndex('transferts', 'transferts_agence_retrait_id_index')) {
                $table->index('agence_retrait_id');
            }
            if (!Schema::hasIndex('transferts', 'transferts_statut_created_at_index')) {
                $table->index(['statut', 'created_at']);
            }
            if (!Schema::hasIndex('transferts', 'transferts_code_index')) {
                $table->index('code');
            }
        });

        // Index pour ledger
        Schema::table('ledger', function (Blueprint $table) {
            if (!Schema::hasIndex('ledger', 'ledger_transfert_id_index')) {
                $table->index('transfert_id');
            }
            if (!Schema::hasIndex('ledger', 'ledger_created_at_index')) {
                $table->index('created_at');
            }
        });
    }

    public function down()
    {
        Schema::table('transferts', function (Blueprint $table) {
            $table->dropIndex(['agence_envoi_id']);
            $table->dropIndex(['agence_retrait_id']);
            $table->dropIndex(['statut', 'created_at']);
            $table->dropIndex(['code']);
        });

        Schema::table('ledger', function (Blueprint $table) {
            $table->dropIndex(['transfert_id']);
            $table->dropIndex(['created_at']);
        });
    }
};
