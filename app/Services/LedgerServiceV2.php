<?php

namespace App\Services;

use App\Models\Compte;
use App\Models\Ledger;
use App\Models\Agence;
use App\Exceptions\FondsInsuffisantsException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LedgerServiceV2
{
    public function getCompteByCode(string $code): Compte
    {
        $compte = Compte::where('code', $code)->first();
        if (!$compte) {
            throw new \RuntimeException("Compte non trouvé: {$code}");
        }
        return $compte;
    }

    public function getSystemCompte(): Compte
    {
        return $this->getCompteByCode('SYSTEM');
    }

    public function getFraisCompte(): Compte
    {
        return $this->getCompteByCode('FRAIS');
    }

    public function credit(Compte $compte, float $montant, string $nature, ?int $transactionId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        $this->validerMontant($montant);
        
        return DB::transaction(function () use ($compte, $montant, $nature, $transactionId, $utilisateurId, $reference, $description) {
            $compte = Compte::where('id', $compte->id)->lockForUpdate()->first();
            
            $soldeAvant = $this->getSolde($compte->id);
            $soldeApres = $soldeAvant + $montant;
            
            $compte->solde_cache = $soldeApres;
            $compte->save();
            
            return Ledger::create([
                'compte_id' => $compte->id,
                'agence_id' => $compte->agence_id,
                'transaction_id' => $transactionId,
                'type' => 'CREDIT',
                'nature' => $nature,
                'montant' => $montant,
                'solde_avant' => $soldeAvant,
                'solde_apres' => $soldeApres,
                'utilisateur_id' => $utilisateurId,
                'reference' => $reference ?? Str::uuid()->toString(),
                'description' => $description ?? $nature,
            ]);
        });
    }

    public function debit(Compte $compte, float $montant, string $nature, ?int $transactionId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        $this->validerMontant($montant);
        
        return DB::transaction(function () use ($compte, $montant, $nature, $transactionId, $utilisateurId, $reference, $description) {
            $compte = Compte::where('id', $compte->id)->lockForUpdate()->first();
            
            $soldeAvant = $this->getSolde($compte->id);
            $soldeApres = $soldeAvant - $montant;
            
            // Vérification solde (sauf pour SYSTEM et FRAIS)
            if ($soldeApres < 0 && !in_array($compte->code, ['SYSTEM', 'FRAIS'])) {
                throw new FondsInsuffisantsException($soldeAvant, $montant);
            }
            
            $compte->solde_cache = $soldeApres;
            $compte->save();
            
            return Ledger::create([
                'compte_id' => $compte->id,
                'agence_id' => $compte->agence_id,
                'transaction_id' => $transactionId,
                'type' => 'DEBIT',
                'nature' => $nature,
                'montant' => $montant,
                'solde_avant' => $soldeAvant,
                'solde_apres' => $soldeApres,
                'utilisateur_id' => $utilisateurId,
                'reference' => $reference ?? Str::uuid()->toString(),
                'description' => $description ?? $nature,
            ]);
        });
    }

    public function getSolde(int $compteId): float
    {
        return (float) Ledger::where('compte_id', $compteId)
            ->select(DB::raw('COALESCE(SUM(CASE WHEN type = "CREDIT" THEN montant ELSE -montant END), 0) as solde'))
            ->value('solde');
    }

    public function getSoldeByCode(string $code): float
    {
        $compte = $this->getCompteByCode($code);
        return $this->getSolde($compte->id);
    }

    public function verifierDoubleEcriture(?int $transactionId): void
    {
        if ($transactionId === null) return;

        $totalDebit = (float) Ledger::where('transaction_id', $transactionId)->where('type', 'DEBIT')->sum('montant');
        $totalCredit = (float) Ledger::where('transaction_id', $transactionId)->where('type', 'CREDIT')->sum('montant');

        if (abs($totalDebit - $totalCredit) > 0.01) {
            throw new \RuntimeException("Incohérence ledger: DEBIT={$totalDebit}, CREDIT={$totalCredit}");
        }
    }

    public function verifierSystemNul(): void
    {
        $solde = $this->getSoldeByCode('SYSTEM');
        if (abs($solde) > 0.01) {
            throw new \RuntimeException("Solde SYSTEM non nul: {$solde}");
        }
    }

    private function validerMontant(float $montant): void
    {
        if ($montant <= 0) {
            throw new \InvalidArgumentException("Le montant doit être supérieur à 0");
        }
        if ($montant > 999999999.99) {
            throw new \InvalidArgumentException("Montant trop élevé");
        }
    }
}
