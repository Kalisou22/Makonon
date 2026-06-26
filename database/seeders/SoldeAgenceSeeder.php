<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SoldeAgenceSeeder extends Seeder
{
    public function run()
    {
        DB::table('agences')->where('id', 1)->update(['solde_cache' => 1000000]);
        DB::table('agences')->where('id', 2)->update(['solde_cache' => 500000]);
        
        $this->command->info('✅ Soldes des agences mis à jour');
    }
}
