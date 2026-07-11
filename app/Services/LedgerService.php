<?php

namespace App\Services;

use App\Models\Ledger;
use App\Models\Agence;
use App\Exceptions\FondsInsuffisantsException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class LedgerService
{
    public const SYSTEM_AGENCE_CODE = 'SYSTEM';
    public const FRAIS_AGENCE_CODE = 'FRAIS';
    public const CAISSE_AGENCE_CODE = 'CAISSE';

    public function getSystemAccount(): Agence
    {
        $system = Agence::where('code', self::SYSTEM_AGENCE_CODE)->first();
        if (!$system) {
            throw new \RuntimeException("Compte système non trouvé");
        }
        return $system;
    }

    public function getFraisAccount(): Agence
    {
        $frais = Agence::where('code', self::FRAIS_AGENCE_CODE)->first();
        if (!$frais) {
            throw new \RuntimeException("Compte frais non trouvé");
        }
        return $frais;
    }

    public function getCaisseAccount(): Agence
    {
        $caisse = Agence::where('code', self::CAISSE_AGENCE_CODE)->first();
        if (!$caisse) {
            throw new \RuntimeException("Compte caisse non trouvé");
        }
        return $caisse;
    }

    public function credit(Agence $agence, float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        $this->validerMontant($montant);
        $agence = Agence::where('id', $agence->id)->lockForUpdate()->first();
        $soldeAvant = $this->calculerSoldeReel($agence->id);
        $soldeApres = $soldeAvant + $montant;

        $ledger = Ledger::create([
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

        $this->mettreAJourSoldeCache($agence->id);
        return $ledger;
    }

    public function debit(Agence $agence, float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        $this->validerMontant($montant);
        $agence = Agence::where('id', $agence->id)->lockForUpdate()->first();
        $soldeAvant = $this->calculerSoldeReel($agence->id);
        $soldeApres = $soldeAvant - $montant;

        $isTransfert = in_array($nature, ['TRANSFERT_SORTIE', 'TRANSFERT_ENTREE']);
        if (!$isTransfert && $soldeApres < 0 && !in_array($agence->code, [self::SYSTEM_AGENCE_CODE, self::FRAIS_AGENCE_CODE, self::CAISSE_AGENCE_CODE])) {
            throw new FondsInsuffisantsException($soldeAvant, $montant);
        }

        $ledger = Ledger::create([
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

        $this->mettreAJourSoldeCache($agence->id);
        return $ledger;
    }

    public function debitSystem(float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        return $this->debit($this->getSystemAccount(), $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    }

    public function creditSystem(float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        return $this->credit($this->getSystemAccount(), $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    }

    public function debitFrais(float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        return $this->debit($this->getFraisAccount(), $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    }

    public function creditFrais(float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        return $this->credit($this->getFraisAccount(), $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    }

    public function debitAgence(Agence $agence, float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        return $this->debit($agence, $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    }

    public function creditAgence(Agence $agence, float $montant, string $nature, ?int $transfertId, int $utilisateurId, ?string $reference = null, ?string $description = null): Ledger
    {
        return $this->credit($agence, $montant, $nature, $transfertId, $utilisateurId, $reference, $description);
    }

    public function getSolde(int $agenceId): float
    {
        return $this->calculerSoldeReel($agenceId);
    }

    private function calculerSoldeReel(int $agenceId): float
    {
        $result = DB::table('ledger')
            ->where('agence_id', $agenceId)
            ->select(DB::raw('
                COALESCE(SUM(CASE WHEN type = "CREDIT" THEN montant ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN type = "DEBIT" THEN montant ELSE 0 END), 0)
                as solde
            '))
            ->first();
        return (float) ($result->solde ?? 0);
    }

    public function mettreAJourSoldeCache(int $agenceId): void
    {
        $solde = $this->calculerSoldeReel($agenceId);
        Agence::where('id', $agenceId)->update(['solde_cache' => $solde]);
        Log::info("Solde_cache mis à jour", ['agence_id' => $agenceId, 'solde' => $solde]);
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

    public function verifierSystemNul(): void
    {
        $system = $this->getSystemAccount();
        $solde = $this->getSolde($system->id);
        if (abs($solde) > 0.01) {
            throw new \RuntimeException("Solde SYSTEM non nul: {$solde}");
        }
    }

    public function verifierSoldeCache(int $agenceId): void
    {
        $agence = Agence::find($agenceId);
        if (!$agence) return;
        $soldeLedger = $this->calculerSoldeReel($agenceId);
        $soldeCache = $agence->solde_cache ?? 0;
        if (abs($soldeCache - $soldeLedger) > 0.01) {
            Log::warning("Solde_cache désynchronisé", [
                'agence' => $agence->code,
                'cache' => $soldeCache,
                'ledger' => $soldeLedger,
            ]);
            $agence->update(['solde_cache' => $soldeLedger]);
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
