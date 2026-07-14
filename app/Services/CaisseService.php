<?php
namespace App\Services;

use App\Models\Caisse;
use App\Models\MouvementCaisse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CaisseService
{
    protected LedgerService $ledgerService;

    public function __construct(LedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    public function entree(
        int $caisseId,
        float $montant,
        string $motif,
        int $utilisateurId,
        ?string $reference = null,
        ?int $transfertId = null
    ): MouvementCaisse {
        return DB::transaction(function () use ($caisseId, $montant, $motif, $utilisateurId, $reference, $transfertId) {
            $caisse = Caisse::lockForUpdate()->findOrFail($caisseId);
            $agence = $caisse->agence;

            $caisse->increment('solde_physique', $montant);
            $caisse->increment('solde_comptable', $montant);

            $this->ledgerService->credit(
                $agence,
                $montant,
                'DEPOT_CAISSE',
                $transfertId,
                $utilisateurId,
                $reference ?? 'DEPOT_CAISSE_' . time(),
                "Dépôt en caisse - " . $motif
            );

            $this->ledgerService->mettreAJourSoldeCache($agence->id);

            return MouvementCaisse::create([
                'caisse_id' => $caisseId,
                'type' => 'ENTREE',
                'motif' => $motif,
                'montant' => $montant,
                'reference' => $reference,
                'utilisateur_id' => $utilisateurId,
                'transfert_id' => $transfertId,
            ]);
        });
    }

    public function sortie(
        int $caisseId,
        float $montant,
        string $motif,
        int $utilisateurId,
        ?string $reference = null,
        ?int $transfertId = null
    ): MouvementCaisse {
        return DB::transaction(function () use ($caisseId, $montant, $motif, $utilisateurId, $reference, $transfertId) {
            $caisse = Caisse::lockForUpdate()->findOrFail($caisseId);
            $agence = $caisse->agence;

            if ($caisse->solde_physique < $montant) {
                throw new \Exception("Solde physique insuffisant : {$caisse->solde_physique} < {$montant}");
            }

            $soldeLedger = $this->ledgerService->getSolde($agence->id);
            if ($soldeLedger < $montant) {
                throw new \Exception("Solde ledger insuffisant : {$soldeLedger} < {$montant}");
            }

            $caisse->decrement('solde_physique', $montant);
            $caisse->decrement('solde_comptable', $montant);

            $this->ledgerService->debit(
                $agence,
                $montant,
                'RETRAIT_CAISSE',
                $transfertId,
                $utilisateurId,
                $reference ?? 'RETRAIT_CAISSE_' . time(),
                "Retrait de caisse - " . $motif
            );

            $this->ledgerService->mettreAJourSoldeCache($agence->id);

            return MouvementCaisse::create([
                'caisse_id' => $caisseId,
                'type' => 'SORTIE',
                'motif' => $motif,
                'montant' => $montant,
                'reference' => $reference,
                'utilisateur_id' => $utilisateurId,
                'transfert_id' => $transfertId,
            ]);
        });
    }

    public function getSolde(int $caisseId): array
    {
        $caisse = Caisse::findOrFail($caisseId);
        $soldeLedger = $this->ledgerService->getSolde($caisse->agence_id);

        return [
            'solde_physique' => $caisse->solde_physique,
            'solde_comptable' => $caisse->solde_comptable,
            'solde_ledger' => $soldeLedger,
            'ecart' => round($caisse->solde_physique - $soldeLedger, 2),
            'statut' => abs($caisse->solde_physique - $soldeLedger) < 0.01 ? 'SYNCHRONISÉ' : 'DÉSYNCHRONISÉ'
        ];
    }
}

    public function getCaisseIdByAgence(int $agenceId): int
    {
        $caisse = \App\Models\Caisse::where('agence_id', $agenceId)->first();
        if (!$caisse) {
            throw new \Exception("Caisse non trouvée pour l'agence $agenceId");
        }
        return $caisse->id;
    }
