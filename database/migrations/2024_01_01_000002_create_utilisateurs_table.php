<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('utilisateurs', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->string('email', 100)->unique();
            $table->string('password_hash');
            $table->enum('role', ['SUPERADMIN','ADMIN','RESPONSABLE','AGENT'])->default('AGENT');
            $table->foreignId('agence_id')->nullable()->constrained('agences')->nullOnDelete();
            $table->boolean('actif')->default(true);
            $table->timestamps();
            $table->index('email');
            $table->index('agence_id');
        });
    }
    public function down() { Schema::dropIfExists('utilisateurs'); }
};
