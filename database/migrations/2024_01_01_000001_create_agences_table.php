<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('agences', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();
            $table->string('nom', 100);
            $table->string('adresse')->nullable();
            $table->string('telephone', 30)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('responsable', 100)->nullable();
            $table->string('devise', 10)->default('GNF');
            $table->decimal('solde_cache', 15, 2)->default(0);
            $table->boolean('actif')->default(true);
            $table->timestamps();
            $table->index('code');
        });
    }
    public function down() { Schema::dropIfExists('agences'); }
};
