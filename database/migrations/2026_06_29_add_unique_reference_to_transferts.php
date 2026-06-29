<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('transferts', function (Blueprint $table) {
            if (!Schema::hasColumn('transferts', 'reference')) {
                $table->string('reference', 100)->nullable()->unique()->after('code');
            } else {
                $table->unique('reference');
            }
        });
    }

    public function down()
    {
        Schema::table('transferts', function (Blueprint $table) {
            $table->dropUnique(['reference']);
            $table->dropColumn('reference');
        });
    }
};
