<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'agence_id')) {
                $table->unsignedBigInteger('agence_id')->nullable()->after('id');
                $table->foreign('agence_id')->references('id')->on('agences')->onDelete('cascade');
            }
            
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['SUPERADMIN', 'ADMIN', 'AGENT'])->default('AGENT')->after('email');
            }
            
            if (!Schema::hasColumn('users', 'telephone')) {
                $table->string('telephone', 30)->nullable()->after('role');
            }
            
            if (!Schema::hasColumn('users', 'actif')) {
                $table->boolean('actif')->default(true)->after('telephone');
            }
        });

        Schema::table('ledger', function (Blueprint $table) {
            if (!Schema::hasColumn('ledger', 'reference')) {
                $table->string('reference', 100)->nullable()->after('utilisateur_id');
                $table->index('reference');
            }
            
            if (!Schema::hasColumn('ledger', 'description')) {
                $table->text('description')->nullable()->after('reference');
            }
            
            $table->index('agence_id');
            $table->index('transfert_id');
            $table->index('type');
            $table->index('nature');
            $table->index('created_at');
            $table->index(['agence_id', 'created_at']);
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['agence_id']);
            $table->dropColumn(['agence_id', 'role', 'telephone', 'actif']);
        });

        Schema::table('ledger', function (Blueprint $table) {
            $table->dropIndex(['agence_id', 'created_at']);
            $table->dropColumn(['reference', 'description']);
        });
    }
};
