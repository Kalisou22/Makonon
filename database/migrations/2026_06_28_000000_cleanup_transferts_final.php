<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('transferts', function (Blueprint $table) {
            // Supprimer les colonnes dupliquées
            if (Schema::hasColumn('transferts', 'code_transfert')) {
                $table->dropColumn('code_transfert');
            }
            if (Schema::hasColumn('transferts', 'client_id')) {
                $table->dropForeign(['client_id']);
                $table->dropColumn('client_id');
            }
            if (Schema::hasColumn('transferts', 'agence_emetteur_id')) {
                $table->dropForeign(['agence_emetteur_id']);
                $table->dropColumn('agence_emetteur_id');
            }
            if (Schema::hasColumn('transferts', 'agence_destinataire_id')) {
                $table->dropForeign(['agence_destinataire_id']);
                $table->dropColumn('agence_destinataire_id');
            }
        });

        Schema::table('transferts', function (Blueprint $table) {
            // Ajouter idempotency_key si absent
            if (!Schema::hasColumn('transferts', 'idempotency_key')) {
                $table->string('idempotency_key', 100)->unique();
            }
            // Ajouter utilisateur_annulation_id si absent
            if (!Schema::hasColumn('transferts', 'utilisateur_annulation_id')) {
                $table->foreignId('utilisateur_annulation_id')->nullable()->constrained('utilisateurs')->nullOnDelete();
            }
        });
    }

    public function down()
    {
        //
    }
};
