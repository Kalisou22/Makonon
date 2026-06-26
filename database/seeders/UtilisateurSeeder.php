<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;
use Illuminate\Support\Facades\Hash;

class UtilisateurSeeder extends Seeder
{
    public function run()
    {
        Utilisateur::create([
            'nom' => 'Admin',
            'email' => 'admin@makonon.com',
            'password_hash' => Hash::make('admin123'),
            'role' => 'SUPERADMIN',
            'agence_id' => 1,
            'actif' => true
        ]);

        Utilisateur::create([
            'nom' => 'Agent Conakry',
            'email' => 'agent1@makonon.com',
            'password_hash' => Hash::make('admin123'),
            'role' => 'AGENT',
            'agence_id' => 1,
            'actif' => true
        ]);

        Utilisateur::create([
            'nom' => 'Agent Conakry 2',
            'email' => 'agent2@makonon.com',
            'password_hash' => Hash::make('admin123'),
            'role' => 'AGENT',
            'agence_id' => 2,
            'actif' => true
        ]);
    }
}
