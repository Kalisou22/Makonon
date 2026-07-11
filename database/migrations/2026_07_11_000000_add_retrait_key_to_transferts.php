<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('transferts', function (Blueprint $table) {
            if (!Schema::hasColumn('transferts', 'retrait_key')) {
                $table->string('retrait_key', 100)->nullable()->unique()->after('idempotency_key');
                $table->index('retrait_key');
            }
        });
    }

    public function down()
    {
        Schema::table('transferts', function (Blueprint $table) {
            if (Schema::hasColumn('transferts', 'retrait_key')) {
                $table->dropIndex(['retrait_key']);
                $table->dropColumn('retrait_key');
            }
        });
    }
};
