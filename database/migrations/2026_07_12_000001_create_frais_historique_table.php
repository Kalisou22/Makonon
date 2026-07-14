<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('frais_historique', function (Blueprint $table) {
            $table->id();
            $table->foreignId('frais_configuration_id')->nullable();
            $table->foreignId('transfert_id')->nullable();
            $table->decimal('montant_initial', 15, 2);
            $table->decimal('montant_frais', 15, 2);
            $table->string('type_frais', 50);
            $table->dateTime('date_application')->useCurrent();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('frais_historique');
    }
};
