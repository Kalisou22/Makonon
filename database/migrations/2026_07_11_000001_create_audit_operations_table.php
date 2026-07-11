<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('audit_operations', function (Blueprint $table) {
            $table->id();
            $table->string('operation', 50);
            $table->string('transfert_code', 30);
            $table->foreignId('utilisateur_id')->constrained('utilisateurs');
            $table->foreignId('agence_id')->constrained('agences');
            $table->decimal('montant', 15, 2);
            $table->string('ancien_statut', 20)->nullable();
            $table->string('nouveau_statut', 20)->nullable();
            $table->text('motif')->nullable();
            $table->timestamps();
            
            $table->index('transfert_code');
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('audit_operations');
    }
};
