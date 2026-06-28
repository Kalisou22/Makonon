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
        $system = Agence::where('code', self::SYSTEM_AGENCE_CODE)->first();
        if (!$system) {
            throw new \RuntimeException("Compte système non trouvé");
        }
        return $system;
    }

    public function debitSystem(float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        $system = $this->getSystemAccount();
        return $this->debit($system, $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    }

    public function creditSystem(float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        $system = $this->getSystemAccount();
        return $this->credit($system, $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
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

        $agence = Agence::where('id', $agence->id)->lockForUpdate()->first();

        $soldeAvant = $this->getSoldeWithLock($agence->id);
        $soldeApres = $soldeAvant + $montant;

        return Ledger::create([
            'agence_id' => $agence->id,
            'transfert_id' => $transfertId,
            'type' => 'CREDIT',
            'nature' => $nature,
            'montant' => $montant,
            'solde_avant' => $soldeAvant,
            'solde_apres' => $soldeApres,
            'utilisateur_id' => $utilisateurId,
            'reference' => $reference ?? Str::uuid()->toString(),
            'description' => $description ?? $nature,
        ]);
    }

    public function debit(Agence $agence, float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        $this->validerMontant($montant);

        $agence = Agence::where('id', $agence->id)->lockForUpdate()->first();

        $soldeAvant = $this->getSoldeWithLock($agence->id);
        $soldeApres = $soldeAvant - $montant;

        if ($soldeApres < 0 && $agence->code !== self::SYSTEM_AGENCE_CODE) {
            throw new FondsInsuffisantsException($soldeAvant, $montant);
        }

        return Ledger::create([
            'agence_id' => $agence->id,
            'transfert_id' => $transfertId,
            'type' => 'DEBIT',
            'nature' => $nature,
            'montant' => $montant,
            'solde_avant' => $soldeAvant,
            'solde_apres' => $soldeApres,
            'utilisateur_id' => $utilisateurId,
            'reference' => $reference ?? Str::uuid()->toString(),
            'description' => $description ?? $nature,
        ]);
    }

    public function getSoldeWithLock(int $agenceId): float
    {
        Agence::where('id', $agenceId)->lockForUpdate()->firstOrFail();
        return $this->getSolde($agenceId);
    }

    public function getSolde(int $agenceId): float
    {
        return (float) Ledger::where('agence_id', $agenceId)
            ->select(DB::raw('COALESCE(SUM(CASE WHEN type = "CREDIT" THEN montant ELSE -montant END), 0) as solde'))
            ->value('solde');
    }

    public function verifierDoubleEcriture(?int $transfertId): void
    {
        if ($transfertId === null) return;

        $totalDebit = (float) Ledger::where('transfert_id', $transfertId)->where('type', 'DEBIT')->sum('montant');
        $totalCredit = (float) Ledger::where('transfert_id', $transfertId)->where('type', 'CREDIT')->sum('montant');

        if (abs($totalDebit - $totalCredit) > 0.01) {
            throw new \RuntimeException("Incohérence ledger: DEBIT={$totalDebit}, CREDIT={$totalCredit}");
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
