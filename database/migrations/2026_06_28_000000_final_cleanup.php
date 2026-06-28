<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Supprimer les colonnes dupliquées
        Schema::table('transferts', function (Blueprint $table) {
            $columns = ['code_transfert', 'client_id', 'agence_emetteur_id', 'agence_destinataire_id'];
            foreach ($columns as $col) {
                if (Schema::hasColumn('transferts', $col)) {
                    try {
                        $table->dropForeign([$col]);
                    } catch (\Exception $e) {}
                    $table->dropColumn($col);
                }
            }
        });

        // Ajouter idempotency_key si absent
        Schema::table('transferts', function (Blueprint $table) {
            if (!Schema::hasColumn('transferts', 'idempotency_key')) {
                $table->string('idempotency_key', 100)->nullable()->unique()->after('code');
            }
        });

        // Ajouter utilisateur_annulation_id si absent
        Schema::table('transferts', function (Blueprint $table) {
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
