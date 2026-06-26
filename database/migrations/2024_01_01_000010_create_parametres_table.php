<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('parametres', function (Blueprint $table) {
            $table->id();
            $table->string('cle', 50)->unique();
            $table->string('valeur', 255);
            $table->string('description', 255)->nullable();
            $table->timestamps();
            $table->index('cle');
        });
    }
    public function down() { Schema::dropIfExists('parametres'); }
};
