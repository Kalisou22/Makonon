<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('ledger', function (Blueprint $table) {
            if (!Schema::hasColumn('ledger', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }
            if (!Schema::hasColumn('ledger', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('ledger', function (Blueprint $table) {
            if (Schema::hasColumn('ledger', 'created_at')) {
                $table->dropColumn('created_at');
            }
            if (Schema::hasColumn('ledger', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
        });
    }
};
