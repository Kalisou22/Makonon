<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Agence;
use App\Models\Compte;
use App\Models\Ledger;

return new class extends Migration
{
    public function up()
    {
        // Créer SYSTEM
        if (!Compte::where('code', 'SYSTEM')->exists()) {
            Compte::create([
                'agence_id' => 1,
                'code' => 'SYSTEM',
                'nom' => 'Compte Système',
                'type' => 'SYSTEM',
                'solde_cache' => 0,
                'actif' => true,
            ]);
        }

        // Créer FRAIS
        if (!Compte::where('code', 'FRAIS')->exists()) {
            Compte::create([
                'agence_id' => 1,
                'code' => 'FRAIS',
                'nom' => 'Compte Frais',
                'type' => 'FRAIS',
                'solde_cache' => 0,
                'actif' => true,
            ]);
        }

        // Créer comptes principaux et migrer ledger
        foreach (Agence::all() as $agence) {
            $code = $agence->code . '_PRINCIPAL';
            
            $compte = Compte::firstOrCreate([
                'code' => $code,
            ], [
                'agence_id' => $agence->id,
                'nom' => 'Compte Principal ' . $agence->nom,
                'type' => 'PRINCIPAL',
                'solde_cache' => $agence->solde_cache ?? 0,
                'actif' => true,
            ]);

            // Migrer les écritures
            Ledger::where('agence_id', $agence->id)
                  ->whereNull('compte_id')
                  ->update(['compte_id' => $compte->id]);
        }

        // Migrer SYSTEM
        $system = Compte::where('code', 'SYSTEM')->first();
        if ($system) {
            Ledger::whereIn('nature', ['ENVOI', 'RECEPTION', 'TRANSFERT_EMIS', 'TRANSFERT_RECU'])
                  ->whereNull('compte_id')
                  ->update(['compte_id' => $system->id]);
        }

        // Migrer FRAIS
        $frais = Compte::where('code', 'FRAIS')->first();
        if ($frais) {
            Ledger::where('nature', 'FRAIS')
                  ->whereNull('compte_id')
                  ->update(['compte_id' => $frais->id]);
        }
    }

    public function down()
    {
        // Ne rien faire
    }
};
