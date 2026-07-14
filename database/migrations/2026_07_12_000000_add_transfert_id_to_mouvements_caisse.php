<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('mouvements_caisse', function (Blueprint $table) {
            if (!Schema::hasColumn('mouvements_caisse', 'transfert_id')) {
                $table->foreignId('transfert_id')->nullable()->constrained('transferts')->nullOnDelete();
                $table->index('transfert_id');
            }
        });
    }

    public function down()
    {
        Schema::table('mouvements_caisse', function (Blueprint $table) {
            if (Schema::hasColumn('mouvements_caisse', 'transfert_id')) {
                $table->dropForeign(['transfert_id']);
                $table->dropColumn('transfert_id');
            }
        });
    }
};
