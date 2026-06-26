<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->string('telephone', 30)->unique();
            $table->string('email', 100)->nullable();
            $table->string('piece_identite', 50)->nullable();
            $table->string('numero_piece', 50)->nullable();
            $table->timestamps();
            $table->index('telephone');
            $table->index('email');
        });
    }
    public function down() { Schema::dropIfExists('clients'); }
};
