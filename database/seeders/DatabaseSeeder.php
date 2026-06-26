<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            AgenceSeeder::class,
            UtilisateurSeeder::class,
            ParametreSeeder::class,
        ]);

        $this->command->info('✅ Base de données initialisée!');
        $this->command->info('👤 Admin: admin@makonon.com / admin123');
        $this->command->info('🏢 Agence par défaut: AG-001 - Agence Centrale');
    }
}
