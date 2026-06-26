<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('caisses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agence_id')->unique()->constrained('agences');
            $table->decimal('solde_physique', 15, 2)->default(0);
            $table->decimal('solde_comptable', 15, 2)->default(0);
            $table->timestamps();
        });
    }
    public function down() { Schema::dropIfExists('caisses'); }
};
