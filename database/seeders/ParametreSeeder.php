<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Parametre;

class ParametreSeeder extends Seeder
{
    public function run()
    {
        $parametres = [
            ['cle' => 'COMMISSION_POURCENTAGE', 'valeur' => '1.5', 'description' => 'Commission en pourcentage'],
            ['cle' => 'FRAIS_FIXES', 'valeur' => '1000', 'description' => 'Frais fixes par transaction'],
            ['cle' => 'MONTANT_MIN', 'valeur' => '1000', 'description' => 'Montant minimum de transfert'],
            ['cle' => 'MONTANT_MAX', 'valeur' => '10000000', 'description' => 'Montant maximum de transfert'],
        ];

        foreach ($parametres as $param) {
            Parametre::updateOrCreate(
                ['cle' => $param['cle']],
                $param
            );
        }

        $this->command->info('✅ Paramètres créés!');
    }
}
