<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('ledger', function (Blueprint $table) {
            if (!Schema::hasIndex('ledger', ['compte_id', 'created_at'])) {
                $table->index(['compte_id', 'created_at']);
            }
            if (!Schema::hasIndex('ledger', ['reference', 'type'])) {
                $table->index(['reference', 'type']);
            }
            if (!Schema::hasIndex('ledger', ['nature', 'created_at'])) {
                $table->index(['nature', 'created_at']);
            }
        });
    }

    public function down()
    {
        Schema::table('ledger', function (Blueprint $table) {
            $table->dropIndex(['compte_id', 'created_at']);
            $table->dropIndex(['reference', 'type']);
            $table->dropIndex(['nature', 'created_at']);
        });
    }
};
