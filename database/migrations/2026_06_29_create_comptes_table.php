<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('comptes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agence_id')->constrained('agences')->onDelete('cascade');
            $table->string('code', 50)->unique();
            $table->string('nom', 100);
            $table->enum('type', ['PRINCIPAL', 'SYSTEM', 'FRAIS', 'AUXILIAIRE']);
            $table->decimal('solde_cache', 15, 2)->default(0);
            $table->boolean('actif')->default(true);
            $table->timestamps();
            
            $table->index(['agence_id', 'type']);
            $table->index('code');
        });
        
        // Créer les comptes par défaut
        $agences = DB::table('agences')->get();
        foreach ($agences as $agence) {
            // Compte principal
            DB::table('comptes')->insert([
                'agence_id' => $agence->id,
                'code' => $agence->code . '_PRINCIPAL',
                'nom' => 'Compte Principal ' . $agence->nom,
                'type' => 'PRINCIPAL',
                'solde_cache' => $agence->solde_cache ?? 0,
                'actif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        
        // Compte SYSTEM
        DB::table('comptes')->insert([
            'agence_id' => 1,
            'code' => 'SYSTEM',
            'nom' => 'Compte Système de Transit',
            'type' => 'SYSTEM',
            'solde_cache' => 0,
            'actif' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        // Compte FRAIS
        DB::table('comptes')->insert([
            'agence_id' => 1,
            'code' => 'FRAIS',
            'nom' => 'Compte de Collecte des Frais',
            'type' => 'FRAIS',
            'solde_cache' => 0,
            'actif' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('comptes');
    }
};
