<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('utilisateurs', function (Blueprint $table) {
            if (!Schema::hasColumn('utilisateurs', 'agence_id')) {
                $table->foreignId('agence_id')->nullable()->after('role');
                $table->foreign('agence_id')->references('id')->on('agences');
            }
            if (!Schema::hasColumn('utilisateurs', 'telephone')) {
                $table->string('telephone', 30)->nullable()->after('email');
            }
            if (!Schema::hasColumn('utilisateurs', 'actif')) {
                $table->boolean('actif')->default(true);
            }
        });
    }

    public function down()
    {
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->dropForeign(['agence_id']);
            $table->dropColumn(['agence_id', 'telephone', 'actif']);
        });
    }
};
