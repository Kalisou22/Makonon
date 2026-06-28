<?php

namespace App\Console\Commands;

use App\Models\Ledger;
use App\Models\Agence;
use Illuminate\Console\Command;

class CheckLedger extends Command
{
    protected $signature = 'ledger:check {--agence= : Vérifier une agence spécifique}';
    protected $description = 'Vérifier l\'intégrité du ledger (DEBIT = CREDIT)';

    public function handle()
    {
        $this->info('🔍 Vérification du ledger...');

        $agenceId = $this->option('agence');

        if ($agenceId) {
            $this->checkAgence((int) $agenceId);
        } else {
            $this->checkGlobal();
        }

        return 0;
    }

    private function checkGlobal(): void
    {
        $totalDebit = Ledger::where('type', 'DEBIT')->sum('montant');
        $totalCredit = Ledger::where('type', 'CREDIT')->sum('montant');
        $ecart = abs($totalDebit - $totalCredit);

        $this->line("DEBIT total: " . number_format($totalDebit, 2) . " GNF");
        $this->line("CREDIT total: " . number_format($totalCredit, 2) . " GNF");
        $this->line("Écart: " . number_format($ecart, 2) . " GNF");

        if ($ecart < 0.01) {
            $this->info('✅ Ledger global équilibré');
        } else {
            $this->error('❌ Incohérence détectée !');
        }

        $this->line("");
        $this->info('📊 Détail par agence:');
        $this->table(
            ['ID', 'Agence', 'DEBIT', 'CREDIT', 'Écart'],
            Agence::all()->map(function ($agence) {
                $debit = Ledger::where('agence_id', $agence->id)->where('type', 'DEBIT')->sum('montant');
                $credit = Ledger::where('agence_id', $agence->id)->where('type', 'CREDIT')->sum('montant');
                return [
                    $agence->id,
                    $agence->code . ' - ' . $agence->nom,
                    number_format($debit, 2),
                    number_format($credit, 2),
                    number_format(abs($debit - $credit), 2)
                ];
            })->toArray()
        );
    }

    private function checkAgence(int $agenceId): void
    {
        $agence = Agence::find($agenceId);
        if (!$agence) {
            $this->error("Agence ID {$agenceId} non trouvée");
            return;
        }

        $debit = Ledger::where('agence_id', $agenceId)->where('type', 'DEBIT')->sum('montant');
        $credit = Ledger::where('agence_id', $agenceId)->where('type', 'CREDIT')->sum('montant');
        $ecart = abs($debit - $credit);

        $this->line("Agence: {$agence->code} - {$agence->nom}");
        $this->line("DEBIT: " . number_format($debit, 2) . " GNF");
        $this->line("CREDIT: " . number_format($credit, 2) . " GNF");
        $this->line("Écart: " . number_format($ecart, 2) . " GNF");

        if ($ecart < 0.01) {
            $this->info('✅ Ledger équilibré');
        } else {
            $this->error('❌ Incohérence détectée !');
        }
    }
}
