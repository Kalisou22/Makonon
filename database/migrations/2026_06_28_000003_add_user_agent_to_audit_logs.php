<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            if (!Schema::hasColumn('audit_logs', 'user_agent')) {
                $table->text('user_agent')->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            if (Schema::hasColumn('audit_logs', 'user_agent')) {
                $table->dropColumn('user_agent');
            }
        });
    }
};
