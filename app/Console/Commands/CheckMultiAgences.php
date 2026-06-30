<?php

namespace App\Console\Commands;

use App\Models\Ledger;
use App\Models\Agence;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CheckMultiAgences extends Command
{
    protected $signature = 'multi:check {--agence= : Vérifier une agence spécifique}';
    protected $description = 'Vérifier l\'intégrité du ledger multi-agences';

    public function handle()
    {
        $this->info('🔍 Vérification du ledger multi-agences...');
        $this->newLine();

        $agenceCode = $this->option('agence');

        if ($agenceCode) {
            $this->checkAgence($agenceCode);
        } else {
            $this->checkGlobal();
        }

        return 0;
    }

    private function checkGlobal(): void
    {
        $totalDebit = Ledger::where('type', 'DEBIT')->sum('montant');
        $totalCredit = Ledger::where('type', 'CREDIT')->sum('montant');
        $ecartGlobal = abs($totalDebit - $totalCredit);

        $this->info('📊 SYNTHÈSE GLOBALE');
        $this->line("DEBIT total: " . number_format($totalDebit, 2) . " GNF");
        $this->line("CREDIT total: " . number_format($totalCredit, 2) . " GNF");
        $this->line("Écart: " . number_format($ecartGlobal, 2) . " GNF");

        if ($ecartGlobal < 0.01) {
            $this->info('✅ Ledger global équilibré');
        } else {
            $this->error('❌ Incohérence globale détectée !');
        }

        $this->newLine();
        $this->info('📊 DÉTAIL PAR AGENCE');
        
        $rows = [];
        $systemNonNul = false;

        foreach (Agence::all() as $agence) {
            $debit = Ledger::where('agence_id', $agence->id)->where('type', 'DEBIT')->sum('montant');
            $credit = Ledger::where('agence_id', $agence->id)->where('type', 'CREDIT')->sum('montant');
            $solde = $credit - $debit;

            $statut = '✅';
            if (abs($solde) > 0.01) {
                $statut = '⚠️';
            }

            if ($agence->code === 'SYSTEM' && abs($solde) > 0.01) {
                $statut = '🔴 SYSTEM NON NUL';
                $systemNonNul = true;
            }

            $rows[] = [
                $agence->id,
                $agence->code,
                $agence->nom,
                number_format($debit, 2),
                number_format($credit, 2),
                number_format($solde, 2),
                $statut
            ];
        }

        $this->table(
            ['ID', 'Code', 'Nom', 'DEBIT', 'CREDIT', 'SOLDE', 'Statut'],
            $rows
        );

        $this->newLine();

        if ($systemNonNul) {
            $this->error('🚨 ALERTE : SYSTEM n\'est pas à 0 !');
        } else {
            $this->info('✅ SYSTEM = 0');
            $this->info('✅ Système comptable cohérent');
        }
    }

    private function checkAgence(string $code): void
    {
        $agence = Agence::where('code', $code)->first();
        if (!$agence) {
            $this->error("Agence {$code} non trouvée");
            return;
        }

        $debit = Ledger::where('agence_id', $agence->id)->where('type', 'DEBIT')->sum('montant');
        $credit = Ledger::where('agence_id', $agence->id)->where('type', 'CREDIT')->sum('montant');
        $solde = $credit - $debit;

        $this->line("Agence: {$agence->code} - {$agence->nom}");
        $this->line("DEBIT: " . number_format($debit, 2) . " GNF");
        $this->line("CREDIT: " . number_format($credit, 2) . " GNF");
        $this->line("SOLDE: " . number_format($solde, 2) . " GNF");
        $this->line("solde_cache: " . number_format($agence->solde_cache ?? 0, 2) . " GNF");

        if (abs($solde) < 0.01) {
            $this->info('✅ Ledger équilibré');
        } else {
            $this->error('❌ Incohérence détectée !');
            $this->newLine();
            $this->warn('🔍 Dernières opérations:');

            $entries = Ledger::where('agence_id', $agence->id)
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
