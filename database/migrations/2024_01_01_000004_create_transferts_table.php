<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('transferts', function (Blueprint $table) {
            $table->id();
            $table->string('code', 30)->unique();
            $table->foreignId('expediteur_id')->constrained('clients');
            $table->foreignId('beneficiaire_id')->constrained('clients');
            $table->foreignId('agence_envoi_id')->constrained('agences');
            $table->foreignId('agence_retrait_id')->nullable()->constrained('agences');
            $table->foreignId('utilisateur_envoi_id')->constrained('utilisateurs');
            $table->foreignId('utilisateur_retrait_id')->nullable()->constrained('utilisateurs');
            $table->decimal('montant', 15, 2);
            $table->decimal('frais', 15, 2)->default(0);
            $table->decimal('commission', 15, 2)->default(0);
            $table->enum('statut', ['EN_ATTENTE','ENVOYE','RETIRE','ANNULE','EXPIRE'])->default('ENVOYE');
            $table->timestamp('date_envoi')->useCurrent();
            $table->timestamp('date_retrait')->nullable();
            $table->timestamps();
            $table->index('code');
            $table->index('statut');
            $table->index('agence_envoi_id');
            $table->index('agence_retrait_id');
        });
    }
    public function down() { Schema::dropIfExists('transferts'); }
};
