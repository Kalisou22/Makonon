<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('transferts', function (Blueprint $table) {
            // Ajout des colonnes manquantes pour compatibilité
            if (!Schema::hasColumn('transferts', 'client_id')) {
                $table->foreignId('client_id')->nullable()->after('id');
                $table->foreign('client_id')->references('id')->on('clients');
            }
            
            if (!Schema::hasColumn('transferts', 'agence_emetteur_id')) {
                $table->foreignId('agence_emetteur_id')->nullable()->after('client_id');
                $table->foreign('agence_emetteur_id')->references('id')->on('agences');
            }
            
            if (!Schema::hasColumn('transferts', 'agence_destinataire_id')) {
                $table->foreignId('agence_destinataire_id')->nullable()->after('agence_emetteur_id');
                $table->foreign('agence_destinataire_id')->references('id')->on('agences');
            }
            
            if (!Schema::hasColumn('transferts', 'code_transfert')) {
                $table->string('code_transfert', 30)->nullable()->after('id');
                $table->index('code_transfert');
            }
            
            if (!Schema::hasColumn('transferts', 'total')) {
                $table->decimal('total', 15, 2)->nullable()->after('montant');
            }
            
            if (!Schema::hasColumn('transferts', 'telephone_destinataire')) {
                $table->string('telephone_destinataire', 30)->nullable()->after('total');
            }
            
            if (!Schema::hasColumn('transferts', 'nom_destinataire')) {
                $table->string('nom_destinataire', 100)->nullable()->after('telephone_destinataire');
            }
            
            if (!Schema::hasColumn('transferts', 'date_emission')) {
                $table->timestamp('date_emission')->nullable()->after('statut');
            }
            
            if (!Schema::hasColumn('transferts', 'date_annulation')) {
                $table->timestamp('date_annulation')->nullable()->after('date_retrait');
            }
            
            if (!Schema::hasColumn('transferts', 'motif_annulation')) {
                $table->text('motif_annulation')->nullable()->after('date_annulation');
            }
        });
    }

    public function down()
    {
        Schema::table('transferts', function (Blueprint $table) {
            $columns = [
                'client_id', 'agence_emetteur_id', 'agence_destinataire_id',
                'code_transfert', 'total', 'telephone_destinataire',
                'nom_destinataire', 'date_emission', 'date_annulation',
                'motif_annulation'
            ];
            
            foreach ($columns as $column) {
                if (Schema::hasColumn('transferts', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
