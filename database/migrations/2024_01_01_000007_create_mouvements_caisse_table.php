<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('mouvements_caisse', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caisse_id')->constrained('caisses');
            $table->enum('type', ['ENTREE','SORTIE']);
            $table->enum('motif', ['ENVOI','RETRAIT','DEPOT','AJUSTEMENT']);
            $table->decimal('montant', 15, 2);
            $table->string('reference', 50)->nullable();
            $table->foreignId('utilisateur_id')->constrained('utilisateurs');
            $table->timestamps();
        });
    }
    public function down() { Schema::dropIfExists('mouvements_caisse'); }
};
