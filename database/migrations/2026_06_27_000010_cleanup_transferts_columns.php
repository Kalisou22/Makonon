<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('transferts', function (Blueprint $table) {
            // Supprimer les colonnes dupliquées/inutiles
            if (Schema::hasColumn('transferts', 'code_transfert')) {
                $table->dropColumn('code_transfert');
            }
            if (Schema::hasColumn('transferts', 'client_id')) {
                $table->dropColumn('client_id');
            }
            if (Schema::hasColumn('transferts', 'agence_emetteur_id')) {
                $table->dropColumn('agence_emetteur_id');
            }
            if (Schema::hasColumn('transferts', 'agence_destinataire_id')) {
                $table->dropColumn('agence_destinataire_id');
            }
        });
    }

    public function down()
    {
        Schema::table('transferts', function (Blueprint $table) {
            $table->string('code_transfert', 30)->nullable();
            $table->foreignId('client_id')->nullable();
            $table->foreignId('agence_emetteur_id')->nullable();
            $table->foreignId('agence_destinataire_id')->nullable();
        });
    }
};
