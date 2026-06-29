<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('comptes')) {
            Schema::create('comptes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('agence_id')->constrained('agences');
                $table->string('code', 50)->unique();
                $table->string('nom', 100);
                $table->enum('type', ['PRINCIPAL', 'SYSTEM', 'FRAIS', 'AUXILIAIRE']);
                $table->decimal('solde_cache', 15, 2)->default(0);
                $table->boolean('actif')->default(true);
                $table->timestamps();
                $table->index(['agence_id', 'type']);
                $table->index('code');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('comptes');
    }
};
