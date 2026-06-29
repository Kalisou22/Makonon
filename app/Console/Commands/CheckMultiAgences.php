<?php

namespace App\Console\Commands;

use App\Models\Ledger;
use App\Models\Compte;
use App\Models\Agence;
use Illuminate\Console\Command;

class CheckMultiAgences extends Command
{
    protected $signature = 'multi:check {--compte= : Vérifier un compte spécifique}';
    protected $description = 'Vérifier l\'intégrité du ledger multi-agences';

    public function handle()
    {
        $this->info('🔍 Vérification du ledger multi-agences...');
        $this->newLine();

        $compteCode = $this->option('compte');

        if ($compteCode) {
            $this->checkCompte($compteCode);
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
        $this->info('📊 DÉTAIL PAR COMPTE');
        
        $rows = [];
        $systemNonNul = false;

        foreach (Compte::all() as $compte) {
            $debit = Ledger::where('compte_id', $compte->id)->where('type', 'DEBIT')->sum('montant');
            $credit = Ledger::where('compte_id', $compte->id)->where('type', 'CREDIT')->sum('montant');
            $solde = $credit - $debit;
            
            $agence = Agence::find($compte->agence_id);
            $agenceCode = $agence ? $agence->code : 'N/A';

            $statut = '✅';
            if (abs($solde) > 0.01) {
                $statut = '⚠️';
            }

            if ($compte->code === 'SYSTEM' && abs($solde) > 0.01) {
                $statut = '🔴 SYSTEM NON NUL';
                $systemNonNul = true;
            }

            $rows[] = [
                $compte->id,
                $agenceCode,
                $compte->code,
                $compte->nom,
                number_format($debit, 2),
                number_format($credit, 2),
                number_format($solde, 2),
                $statut
            ];
        }

        $this->table(
            ['ID', 'Agence', 'Code', 'Nom', 'DEBIT', 'CREDIT', 'SOLDE', 'Statut'],
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

    private function checkCompte(string $code): void
    {
        $compte = Compte::where('code', $code)->first();
        if (!$compte) {
            $this->error("Compte {$code} non trouvé");
            return;
        }

        $debit = Ledger::where('compte_id', $compte->id)->where('type', 'DEBIT')->sum('montant');
        $credit = Ledger::where('compte_id', $compte->id)->where('type', 'CREDIT')->sum('montant');
        $solde = $credit - $debit;

        $this->line("Compte: {$compte->code} - {$compte->nom}");
        $this->line("DEBIT: " . number_format($debit, 2) . " GNF");
        $this->line("CREDIT: " . number_format($credit, 2) . " GNF");
        $this->line("SOLDE: " . number_format($solde, 2) . " GNF");
        $this->line("solde_cache: " . number_format($compte->solde_cache ?? 0, 2) . " GNF");

        if (abs($solde) < 0.01) {
            $this->info('✅ Ledger équilibré');
        } else {
            $this->error('❌ Incohérence détectée !');
        }
    }
}
