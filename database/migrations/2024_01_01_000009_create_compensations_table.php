<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('compensations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agence_source_id')->constrained('agences');
            $table->foreignId('agence_destination_id')->constrained('agences');
            $table->decimal('montant', 15, 2);
            $table->enum('statut', ['EN_ATTENTE','VALIDE','REJETE'])->default('EN_ATTENTE');
            $table->foreignId('utilisateur_id')->constrained('utilisateurs');
            $table->timestamps();
        });
    }
    public function down() { Schema::dropIfExists('compensations'); }
};
