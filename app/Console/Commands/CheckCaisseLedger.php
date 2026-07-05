<?php

namespace App\Console\Commands;

use App\Models\Agence;
use App\Models\Caisse;
use App\Services\LedgerService;
use Illuminate\Console\Command;

class CheckCaisseLedger extends Command
{
    protected $signature = 'check:caisse-ledger';
    protected $description = 'Vérifier la synchronisation entre la caisse et le ledger';

    public function handle(LedgerService $ledgerService)
    {
        $this->info('🔍 VÉRIFICATION CAISSE ↔ LEDGER');
        $this->newLine();

        $agences = Agence::whereNotIn('code', ['FRAIS', 'SYSTEM'])->get();

        $totalOk = 0;
        $totalKo = 0;

        foreach ($agences as $agence) {
            $caisse = Caisse::where('agence_id', $agence->id)->first();
            $soldeLedger = $ledgerService->getSolde($agence->id);

            $this->line("📌 Agence: {$agence->code} - {$agence->nom}");

            if ($caisse) {
                $soldeCaisse = $caisse->solde_physique;
                $ecart = $soldeCaisse - $soldeLedger;

                $this->line("   💰 Solde ledger: " . number_format($soldeLedger, 2) . " GNF");
                $this->line("   💳 Solde caisse: " . number_format($soldeCaisse, 2) . " GNF");

                if (abs($ecart) < 0.01) {
                    $this->line("   ✅ Écart: " . number_format($ecart, 2) . " GNF (SYNCHRONISÉ)");
                    $totalOk++;
                } else {
                    $this->error("   ❌ Écart: " . number_format($ecart, 2) . " GNF (DÉSYNCHRONISÉ)");
                    $totalKo++;
                }
            } else {
                $this->line("   ⚠️  Aucune caisse trouvée pour cette agence");
                $this->line("   💰 Solde ledger: " . number_format($soldeLedger, 2) . " GNF");
            }

            $this->newLine();
        }

        $this->newLine();
        $this->info("📊 RÉSUMÉ:");
        $this->line("   ✅ Synchronisées: {$totalOk}");
        $this->line("   ❌ Désynchronisées: {$totalKo}");

        if ($totalKo > 0) {
            $this->error("⚠️  Des agences sont désynchronisées !");
            $this->line("   Exécutez: php artisan ledger:sync-caisse pour corriger");
        } else {
            $this->info("🎉 Toutes les agences sont synchronisées !");
        }

        return 0;
    }
}
