<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('ledger', function (Blueprint $table) {
            // Index composite pour les requêtes de solde
            $table->index(['compte_id', 'created_at']);
            
            // Index pour les doublons
            $table->index(['reference', 'type']);
            
            // Index pour les audits
            $table->index(['nature', 'created_at']);
        });
    }

    public function down()
    {
        Schema::table('ledger', function (Blueprint $table) {
            $table->dropIndex(['compte_id', 'created_at']);
            $table->dropIndex(['reference', 'type']);
            $table->dropIndex(['nature', 'created_at']);
        });
    }
};
