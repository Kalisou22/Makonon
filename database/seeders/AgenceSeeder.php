<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Agence;

class AgenceSeeder extends Seeder
{
    public function run()
    {
        Agence::create([
            'code' => 'AG-001',
            'nom' => 'Agence Centrale',
            'adresse' => 'Conakry',
            'telephone' => '620000001',
            'email' => 'contact@makonon.com',
            'responsable' => 'Admin',
            'devise' => 'GNF',
            'solde_cache' => 100000000,
            'actif' => true
        ]);

        Agence::create([
            'code' => 'AG-002',
            'nom' => 'Agence Conakry 1',
            'adresse' => 'Conakry - Kaloum',
            'telephone' => '620000002',
            'email' => 'conakry1@makonon.com',
            'responsable' => 'M. Diallo',
            'devise' => 'GNF',
            'solde_cache' => 50000000,
            'actif' => true
        ]);
    }
}
