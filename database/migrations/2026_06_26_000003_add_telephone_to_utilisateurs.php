<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('utilisateurs', function (Blueprint $table) {
            if (!Schema::hasColumn('utilisateurs', 'telephone')) {
                $table->string('telephone', 30)->nullable()->after('email');
            }
            if (!Schema::hasColumn('utilisateurs', 'actif')) {
                $table->boolean('actif')->default(true)->after('role');
            }
        });
    }

    public function down()
    {
        Schema::table('utilisateurs', function (Blueprint $table) {
            if (Schema::hasColumn('utilisateurs', 'telephone')) {
                $table->dropColumn('telephone');
            }
            if (Schema::hasColumn('utilisateurs', 'actif')) {
                $table->dropColumn('actif');
            }
        });
    }
};
