<?php

namespace App\Services;

use App\Models\Ledger;
use App\Models\Agence;
use App\Exceptions\FondsInsuffisantsException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LedgerService
{
    /**
     * Créditer une agence avec lockForUpdate
     */
    public function credit(
        Agence $agence,
        float $montant,
        string $nature,
        ?int $transfertId,
        int $utilisateurId,
        ?string $reference = null,
        ?string $description = null
    ): Ledger {
        $this->validerMontant($montant);

        return DB::transaction(function () use ($agence, $montant, $nature, $transfertId, $utilisateurId, $reference, $description) {
            // 🔒 Verrouillage pour éviter les race conditions
            $agence = Agence::where('id', $agence->id)->lockForUpdate()->first();

            $soldeAvant = $this->getSolde($agence->id);
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

    /**
     * Débiter une agence avec lockForUpdate
     */
    public function debit(
        Agence $agence,
        float $montant,
        string $nature,
        ?int $transfertId,
        int $utilisateurId,
        ?string $reference = null,
        ?string $description = null
    ): Ledger {
        $this->validerMontant($montant);

        return DB::transaction(function () use ($agence, $montant, $nature, $transfertId, $utilisateurId, $reference, $description) {
            // 🔒 Verrouillage pour éviter les race conditions
            $agence = Agence::where('id', $agence->id)->lockForUpdate()->first();

            $soldeAvant = $this->getSolde($agence->id);
            $soldeApres = $soldeAvant - $montant;

            if ($soldeApres < 0) {
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

    /**
     * Récupérer le solde d'une agence
     */
    public function getSolde(int $agenceId): float
    {
        return (float) Ledger::where('agence_id', $agenceId)
            ->select(DB::raw('COALESCE(SUM(CASE WHEN type = "CREDIT" THEN montant ELSE -montant END), 0) as solde'))
            ->value('solde');
    }

    /**
     * Vérifier si une agence a un solde suffisant
     */
    public function verifierSolde(int $agenceId, float $montant): bool
    {
        $solde = $this->getSolde($agenceId);
        return $solde >= $montant;
    }

    /**
     * Créer une entrée dans le ledger
     */
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

    /**
     * Valider le montant
     */
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
# Vérifier que le LedgerService utilise lockForUpdate
cat app/Services/LedgerService.php | grep -A 10 "lockForUpdate"

# Si ce n'est pas le cas, ajouter la méthode
cat > app/Services/LedgerService.php << 'EOF'
<?php

namespace App\Services;

use App\Models\Ledger;
use App\Models\Agence;
use App\Exceptions\FondsInsuffisantsException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LedgerService
{
    /**
     * Créditer une agence avec lockForUpdate
     */
    public function credit(
        Agence $agence,
        float $montant,
        string $nature,
        ?int $transfertId,
        int $utilisateurId,
        ?string $reference = null,
        ?string $description = null
    ): Ledger {
        $this->validerMontant($montant);

        return DB::transaction(function () use ($agence, $montant, $nature, $transfertId, $utilisateurId, $reference, $description) {
            // 🔒 Verrouillage pour éviter les race conditions
            $agence = Agence::where('id', $agence->id)->lockForUpdate()->first();

            $soldeAvant = $this->getSolde($agence->id);
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

    /**
     * Débiter une agence avec lockForUpdate
     */
    public function debit(
        Agence $agence,
        float $montant,
        string $nature,
        ?int $transfertId,
        int $utilisateurId,
        ?string $reference = null,
        ?string $description = null
    ): Ledger {
        $this->validerMontant($montant);

        return DB::transaction(function () use ($agence, $montant, $nature, $transfertId, $utilisateurId, $reference, $description) {
            // 🔒 Verrouillage pour éviter les race conditions
            $agence = Agence::where('id', $agence->id)->lockForUpdate()->first();

            $soldeAvant = $this->getSolde($agence->id);
            $soldeApres = $soldeAvant - $montant;

            if ($soldeApres < 0) {
                throw new FondsInsuffisantsException($soldeAvant, $montant);
            }

            return $this->creerEntreeLedger(
                $agence->id,
                'DEBIT',
                $montant,

# Ajouter la route dans routes/api.php
cat >> routes/api.php << 'EOF'

    // 🔥 Route d'audit du ledger
    Route::get('/ledger', [App\Http\Controllers\Api\LedgerController::class, 'index']);
    Route::get('/ledger/agence/{agenceId}', [App\Http\Controllers\Api\LedgerController::class, 'byAgence']);

    /**
     * Récupérer les écritures ledger d'une agence
     */
    public function getByAgence(int $agenceId, int $perPage = 10)
    {
        return Ledger::where('agence_id', $agenceId)
            ->with(['utilisateur', 'transfert'])
            ->latest('created_at')
            ->paginate($perPage);
    }
