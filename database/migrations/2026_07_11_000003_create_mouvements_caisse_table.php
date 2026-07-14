<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('mouvement_caisses')) {
            Schema::create('mouvement_caisses', function (Blueprint $table) {
                $table->id();
                $table->foreignId('caisse_id')->constrained('caisses')->onDelete('cascade');
                $table->enum('type', ['ENTREE', 'SORTIE']);
                $table->string('motif', 50);
                $table->decimal('montant', 15, 2);
                $table->string('reference', 50)->nullable();
                $table->foreignId('utilisateur_id')->constrained('utilisateurs');
                $table->timestamps();

                $table->index('caisse_id');
                $table->index('type');
                $table->index('motif');
                $table->index('created_at');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('mouvement_caisses');
    }
};
