<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('ledger', function (Blueprint $table) {
            if (!Schema::hasColumn('ledger', 'compte_id')) {
                $table->foreignId('compte_id')->nullable()->after('agence_id');
                $table->foreign('compte_id')->references('id')->on('comptes');
                $table->index('compte_id');
            }
        });
    }

    public function down()
    {
        Schema::table('ledger', function (Blueprint $table) {
            if (Schema::hasColumn('ledger', 'compte_id')) {
                $table->dropForeign(['compte_id']);
                $table->dropColumn('compte_id');
            }
        });
    }
};
