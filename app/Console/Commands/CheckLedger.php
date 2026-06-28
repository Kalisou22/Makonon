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

        $rows = [];
        $hasIncoherence = false;

        foreach (Agence::all() as $agence) {
            $debit = Ledger::where('agence_id', $agence->id)->where('type', 'DEBIT')->sum('montant');
            $credit = Ledger::where('agence_id', $agence->id)->where('type', 'CREDIT')->sum('montant');
            $ecartAgence = abs($debit - $credit);

            $rows[] = [
                $agence->id,
                $agence->code . ' - ' . $agence->nom,
                number_format($debit, 2),
                number_format($credit, 2),
                number_format($ecartAgence, 2),
                $ecartAgence > 0.01 ? '⚠️' : '✅'
            ];

            if ($ecartAgence > 0.01) {
                $hasIncoherence = true;
            }
        }

        $this->table(
            ['ID', 'Agence', 'DEBIT', 'CREDIT', 'Écart', 'Statut'],
            $rows
        );

        if ($hasIncoherence) {
            $this->warn('');
            $this->warn('⚠️  ATTENTION: Des déséquilibres par agence ont été détectés.');
            $this->warn('    Cela peut être normal si les opérations sont en cours,');
            $this->warn('    mais doit être surveillé pour éviter des incohérences.');
            $this->warn('');
            $this->warn('    🔧 Pour analyser plus en détail:');
            $this->warn('       php artisan ledger:check --agence=1');
        } else {
            $this->info('✅ Toutes les agences sont équilibrées');
        }
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
            $this->warn('');
            $this->warn('🔍 Détail des opérations:');

            $entries = Ledger::where('agence_id', $agenceId)
                ->orderBy('id', 'desc')
                ->limit(20)
                ->get();

            $this->table(
                ['ID', 'Type', 'Nature', 'Montant', 'Solde Avant', 'Solde Après', 'Transfert'],
                $entries->map(function ($e) {
                    return [
                        $e->id,
                        $e->type,
                        $e->nature,
                        number_format($e->montant, 2),
                        number_format($e->solde_avant, 2),
                        number_format($e->solde_apres, 2),
                        $e->transfert_id ?? '-'
                    ];
                })->toArray()
            );
        }
    }
}
