<?php

namespace App\Console\Commands;

use App\Models\Agence;
use App\Models\Caisse;
use App\Services\LedgerService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncCaisseLedger extends Command
{
    protected $signature = 'ledger:sync-caisse {--agence= : Synchroniser une agence spécifique}';
    protected $description = 'Synchroniser la caisse avec le ledger';

    public function handle(LedgerService $ledgerService)
    {
        $this->info('🔄 SYNCHRONISATION CAISSE ↔ LEDGER');
        $this->newLine();

        $agenceId = $this->option('agence');

        if ($agenceId) {
            $this->syncAgence($agenceId, $ledgerService);
            return 0;
        }

        $agences = Agence::whereNotIn('code', ['FRAIS', 'SYSTEM'])->get();

        foreach ($agences as $agence) {
            $this->syncAgence($agence->id, $ledgerService);
        }

        $this->newLine();
        $this->info('✅ Synchronisation terminée !');

        return 0;
    }

    private function syncAgence(int $agenceId, LedgerService $ledgerService)
    {
        $agence = Agence::find($agenceId);
        $caisse = Caisse::where('agence_id', $agenceId)->first();

        if (!$caisse) {
            $this->line("⚠️  Aucune caisse pour l'agence {$agence->code}");
            return;
        }

        $soldeLedger = $ledgerService->getSolde($agenceId);
        $soldeCaisse = $caisse->solde_physique;
        $ecart = $soldeCaisse - $soldeLedger;

        if (abs($ecart) < 0.01) {
            $this->line("✅ {$agence->code} - déjà synchronisé");
            return;
        }

        $this->line("🔄 {$agence->code} - Écart: " . number_format($ecart, 2) . " GNF");

        DB::transaction(function () use ($agenceId, $ecart, $soldeCaisse, $ledgerService) {
            // Si l'écart est positif, la caisse a plus d'argent que le ledger
            // → on crédite le ledger
            if ($ecart > 0) {
                $ledgerService->credit(
                    Agence::find($agenceId),
                    $ecart,
                    'AJUSTEMENT',
                    null,
                    1,
                    'SYNC_CAISSE',
                    'Synchronisation caisse/ledger'
                );
            } else {
                // Si l'écart est négatif, la caisse a moins d'argent que le ledger
                // → on débite le ledger
                $ledgerService->debit(
                    Agence::find($agenceId),
                    abs($ecart),
                    'AJUSTEMENT',
                    null,
                    1,
                    'SYNC_CAISSE',
                    'Synchronisation caisse/ledger'
                );
            }

            // Mettre à jour le solde_cache
            $ledgerService->mettreAJourSoldeCache($agenceId);

            // Mettre à jour la caisse
            $caisse = Caisse::where('agence_id', $agenceId)->first();
            $caisse->solde_comptable = $soldeCaisse;
            $caisse->save();
        });

        $this->line("✅ {$agence->code} - synchronisé");
    }
}
