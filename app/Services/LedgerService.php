<?php

namespace App\Services;

use App\Models\Ledger;
use App\Models\Agence;
use App\Exceptions\FondsInsuffisantsException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LedgerService
{
    public const SYSTEM_AGENCE_CODE = 'SYSTEM';

    public function getSystemAccount(): Agence
    {
        return Agence::where('code', self::SYSTEM_AGENCE_CODE)->firstOrFail();
    }

    public function creditSystem(float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        $system = $this->getSystemAccount();
        return $this->credit($system, $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    }

    public function debitSystem(float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        $system = $this->getSystemAccount();
        return $this->debit($system, $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    }

    public function creditAgence(Agence $agence, float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        return $this->credit($agence, $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    }

    public function debitAgence(Agence $agence, float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        return $this->debit($agence, $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    }

    public function credit(Agence $agence, float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        $this->validerMontant($montant);

        return DB::transaction(function () use ($agence, $montant, $nature, $transfertId, $utilisateurId, $reference, $description) {
            $agence = Agence::where('id', $agence->id)->lockForUpdate()->first();

            $soldeAvant = $this->getSoldeWithLock($agence->id);
            $soldeApres = $soldeAvant + $montant;

            return $this->creerEntreeLedger(
                $agence->id,
                'CREDIT',
                $montant,
                $soldeAvant,
                $soldeApres,
                $nature,
                $transfertId,
                $utilisateurId,
                $reference,
                $description
            );
        });
    }

    public function debit(Agence $agence, float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        $this->validerMontant($montant);

        return DB::transaction(function () use ($agence, $montant, $nature, $transfertId, $utilisateurId, $reference, $description) {
            $agence = Agence::where('id', $agence->id)->lockForUpdate()->first();

            $soldeAvant = $this->getSoldeWithLock($agence->id);
            $soldeApres = $soldeAvant - $montant;

            if ($soldeApres < 0 && $agence->code !== self::SYSTEM_AGENCE_CODE) {
                throw new FondsInsuffisantsException($soldeAvant, $montant);
            }

            return $this->creerEntreeLedger(
                $agence->id,
                'DEBIT',
                $montant,
                $soldeAvant,
                $soldeApres,
                $nature,
                $transfertId,
                $utilisateurId,
                $reference,
                $description
            );
        });
    }

    public function getSoldeWithLock(int $agenceId): float
    {
        return DB::transaction(function () use ($agenceId) {
            $agence = Agence::where('id', $agenceId)->lockForUpdate()->first();
            if (!$agence) {
                throw new \RuntimeException("Agence non trouvée");
            }
            return (float) Ledger::where('agence_id', $agenceId)
                ->select(DB::raw('COALESCE(SUM(CASE WHEN type = "CREDIT" THEN montant ELSE -montant END), 0) as solde'))
                ->value('solde');
        });
    }

    public function getSolde(int $agenceId): float
    {
        return (float) Ledger::where('agence_id', $agenceId)
            ->select(DB::raw('COALESCE(SUM(CASE WHEN type = "CREDIT" THEN montant ELSE -montant END), 0) as solde'))
            ->value('solde');
    }

    public function verifierSolde(int $agenceId, float $montant): bool
    {
        $solde = $this->getSolde($agenceId);
        return $solde >= $montant;
    }

    public function verifierDoubleEcriture(?int $transfertId): void
    {
        if ($transfertId === null) {
            return;
        }

        $totalDebit = (float) Ledger::where('transfert_id', $transfertId)
            ->where('type', 'DEBIT')
            ->sum('montant');

        $totalCredit = (float) Ledger::where('transfert_id', $transfertId)
            ->where('type', 'CREDIT')
            ->sum('montant');

        if (abs($totalDebit - $totalCredit) > 0.01) {
            throw new \RuntimeException(
                "Incohérence ledger: DEBIT={$totalDebit}, CREDIT={$totalCredit}"
            );
        }
    }

    private function creerEntreeLedger(
        int $agenceId,
        string $type,
        float $montant,
        float $soldeAvant,
        float $soldeApres,
        string $nature,
        ?int $transfertId,
        int $utilisateurId,
        ?string $reference,
        ?string $description
    ): Ledger {
        return Ledger::create([
            'agence_id' => $agenceId,
            'transfert_id' => $transfertId,
            'type' => $type,
            'nature' => $nature,
            'montant' => $montant,
            'solde_avant' => $soldeAvant,
            'solde_apres' => $soldeApres,
            'utilisateur_id' => $utilisateurId,
            'reference' => $reference ?? Str::uuid()->toString(),
            'description' => $description ?? $nature,
        ]);
    }

    private function validerMontant(float $montant): void
    {
        if ($montant <= 0) {
            throw new \InvalidArgumentException(
                sprintf('Le montant doit être supérieur à 0. Reçu: %s', $montant)
            );
        }

        if ($montant > 999999999.99) {
            throw new \InvalidArgumentException(
                sprintf('Le montant est trop élevé. Max: 999,999,999.99. Reçu: %s', $montant)
            );
        }
    }
}
