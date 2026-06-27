<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // 1. Copier les données de code_transfert vers code si nécessaire
        // 2. Supprimer code_transfert
        Schema::table('transferts', function (Blueprint $table) {
            if (Schema::hasColumn('transferts', 'code_transfert')) {
                $table->dropColumn('code_transfert');
            }
            // S'assurer que code est NOT NULL et UNIQUE
            $table->string('code', 30)->unique()->change();
        });
    }

    public function down()
    {
        Schema::table('transferts', function (Blueprint $table) {
            $table->string('code_transfert', 30)->nullable();
            $table->index('code_transfert');
        });
    }
};
