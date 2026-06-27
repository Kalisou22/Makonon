<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('transferts', function (Blueprint $table) {
            if (!Schema::hasColumn('transferts', 'utilisateur_annulation_id')) {
                $table->foreignId('utilisateur_annulation_id')
                    ->nullable()
                    ->constrained('utilisateurs')
                    ->nullOnDelete();
            }
        });
    }

    public function down()
    {
        Schema::table('transferts', function (Blueprint $table) {
            if (Schema::hasColumn('transferts', 'utilisateur_annulation_id')) {
                $table->dropForeign(['utilisateur_annulation_id']);
                $table->dropColumn('utilisateur_annulation_id');
            }
        });
    }
};
