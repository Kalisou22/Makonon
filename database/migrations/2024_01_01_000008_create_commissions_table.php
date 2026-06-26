<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transfert_id')->constrained('transferts');
            $table->decimal('montant', 15, 2);
            $table->decimal('pourcentage', 5, 2);
            $table->timestamps();
        });
    }
    public function down() { Schema::dropIfExists('commissions'); }
};
