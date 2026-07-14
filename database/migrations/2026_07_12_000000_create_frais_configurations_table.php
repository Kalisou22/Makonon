<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('frais_configurations', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->text('description')->nullable();
            $table->enum('type', ['FIXE', 'POURCENTAGE', 'ECHELONNE'])->default('FIXE');
            $table->decimal('valeur', 15, 2);
            $table->decimal('seuil_min', 15, 2)->default(0);
            $table->decimal('seuil_max', 15, 2)->nullable();
            $table->boolean('actif')->default(true);
            $table->dateTime('date_debut');
            $table->dateTime('date_fin')->nullable();
            $table->foreignId('created_by')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('frais_configurations');
    }
};
