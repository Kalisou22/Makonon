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
                $table->string('idempotency_key', 100)->unique()->after('code');
            } else {
                DB::table('transferts')->whereNull('idempotency_key')->update([
                    'idempotency_key' => DB::raw('CONCAT("legacy_", UUID())')
                ]);
                $table->string('idempotency_key', 100)->nullable(false)->unique()->change();
            }

            $table->index(['statut', 'created_at']);
            $table->index('code');
            $table->index('agence_envoi_id');
            $table->index('agence_retrait_id');
            $table->unique(['code', 'statut']);
        });
    }

    public function down()
    {
        Schema::table('transferts', function (Blueprint $table) {
            $table->dropUnique(['idempotency_key']);
            $table->dropIndex(['statut', 'created_at']);
            $table->dropIndex(['code']);
            $table->dropIndex(['agence_envoi_id']);
            $table->dropIndex(['agence_retrait_id']);
            $table->dropUnique(['code', 'statut']);
            $table->string('idempotency_key', 100)->nullable()->change();
        });
    }
};
