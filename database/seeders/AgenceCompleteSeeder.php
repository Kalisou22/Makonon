<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AgenceCompleteSeeder extends Seeder
{
    public function run()
    {
        // Désactiver les contraintes
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Vider les tables concernées
        DB::table('ledger')->truncate();
        DB::table('caisses')->truncate();
        DB::table('agences')->truncate();
        
        // Réactiver les contraintes
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        
        // Créer les agences
        DB::table('agences')->insert([
            [
                'code' => 'AG-001',
                'nom' => 'Agence Centrale',
                'adresse' => 'Conakry',
                'telephone' => '620000001',
                'email' => 'contact@makonon.com',
                'responsable' => 'Admin',
                'devise' => 'GNF',
                'solde_cache' => 1000000,
                'actif' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'code' => 'AG-002',
                'nom' => 'Agence Conakry 1',
                'adresse' => 'Conakry - Kaloum',
                'telephone' => '620000002',
                'email' => 'conakry1@makonon.com',
                'responsable' => 'M. Diallo',
                'devise' => 'GNF',
                'solde_cache' => 500000,
                'actif' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
        
        $this->command->info('✅ Agences créées avec solde');
        
        $agences = DB::table('agences')->get();
        foreach ($agences as $agence) {
            $this->command->info("Agence {$agence->id} ({$agence->nom}): {$agence->solde_cache} GNF");
        }
    }
}
