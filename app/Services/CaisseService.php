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

    public function entree(int $caisseId, float $montant, string $motif, int $utilisateurId, ?string $reference = null): MouvementCaisse
    {
        return DB::transaction(function () use ($caisseId, $montant, $motif, $utilisateurId, $reference) {
            $caisse = Caisse::lockForUpdate()->findOrFail($caisseId);
            $agence = $caisse->agence;

            $caisse->increment('solde_physique', $montant);
            $caisse->increment('solde_comptable', $montant);

            $this->ledgerService->credit(
                $agence,
                $montant,
                'DEPOT_CAISSE',
                null,
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
                'utilisateur_id' => $utilisateurId
            ]);
        });
    }

    public function sortie(int $caisseId, float $montant, string $motif, int $utilisateurId, ?string $reference = null): MouvementCaisse
    {
        return DB::transaction(function () use ($caisseId, $montant, $motif, $utilisateurId, $reference) {
            $caisse = Caisse::lockForUpdate()->findOrFail($caisseId);
            $agence = $caisse->agence;

            if ($caisse->solde_physique < $montant) {
                throw new \Exception("Solde physique insuffisant");
            }

            $soldeLedger = $this->ledgerService->getSolde($agence->id);
            if ($soldeLedger < $montant) {
                throw new \Exception("Solde ledger insuffisant");
            }

            $caisse->decrement('solde_physique', $montant);
            $caisse->decrement('solde_comptable', $montant);

            $this->ledgerService->debit(
                $agence,
                $montant,
                'RETRAIT_CAISSE',
                null,
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
                'utilisateur_id' => $utilisateurId
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
            'ecart' => $caisse->solde_physique - $soldeLedger,
            'statut' => $caisse->solde_physique == $soldeLedger ? 'SYNCHRONISÉ' : 'DÉSYNCHRONISÉ'
        ];
    }
}
