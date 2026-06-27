<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('transferts', function (Blueprint $table) {
            if (!Schema::hasColumn('transferts', 'idempotency_key')) {
                $table->string('idempotency_key', 100)->nullable()->unique()->after('code');
                $table->index('idempotency_key');
            }
        });

        // 🔥 Contrainte unique pour empêcher double annulation
        Schema::table('transferts', function (Blueprint $table) {
            $table->unique(['code', 'statut']);
        });
    }

    public function down()
    {
        Schema::table('transferts', function (Blueprint $table) {
            if (Schema::hasColumn('transferts', 'idempotency_key')) {
                $table->dropIndex(['idempotency_key']);
                $table->dropColumn('idempotency_key');
            }
        });
    }
};
