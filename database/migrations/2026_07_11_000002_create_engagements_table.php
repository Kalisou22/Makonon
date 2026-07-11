<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('engagements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transfert_id')->constrained('transferts')->onDelete('cascade');
            $table->foreignId('agence_id')->constrained('agences');
            $table->decimal('montant', 15, 2);
            $table->enum('statut', ['ENGAGE', 'RETIRE', 'ANNULE'])->default('ENGAGE');
            $table->timestamps();

            $table->index(['agence_id', 'statut']);
            $table->index('transfert_id');
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('engagements');
    }
};
