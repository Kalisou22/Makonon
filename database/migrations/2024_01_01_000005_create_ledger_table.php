<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('ledger', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agence_id')->constrained('agences');
            $table->foreignId('transfert_id')->nullable()->constrained('transferts')->nullOnDelete();
            $table->enum('type', ['CREDIT','DEBIT']);
            $table->enum('nature', ['ENVOI','RECEPTION','RETRAIT','FRAIS','COMMISSION','COMPENSATION','AJUSTEMENT','ANNULATION','ANNULATION_RETRAIT']);
            $table->decimal('montant', 15, 2);
            $table->decimal('solde_avant', 15, 2);
            $table->decimal('solde_apres', 15, 2);
            $table->foreignId('utilisateur_id')->constrained('utilisateurs');
            $table->timestamp('created_at')->useCurrent();
            $table->index('agence_id');
            $table->index('transfert_id');
            $table->index('type');
            $table->index('nature');
        });
    }
    public function down() { Schema::dropIfExists('ledger'); }
};
