<?php
namespace App\Services;

use App\Models\Transfert;
use App\Models\Client;
use App\Models\Agence;
use App\Models\Commission;
use App\Models\Parametre;
use Illuminate\Support\Facades\DB;

class TransfertService
{
    protected LedgerService $ledger;
    protected AuditService $audit;

    public function __construct(LedgerService $ledger, AuditService $audit)
    {
        $this->ledger = $ledger;
        $this->audit = $audit;
    }

    public function creer(array $data, int $utilisateurId): Transfert
    {
        return DB::transaction(function () use ($data, $utilisateurId) {
            $expediteur = Client::firstOrCreate(
                ['telephone' => $data['telephone_expediteur']],
                ['nom' => $data['nom_expediteur']]
            );

            $beneficiaire = Client::firstOrCreate(
                ['telephone' => $data['telephone_beneficiaire']],
                ['nom' => $data['nom_beneficiaire']]
            );

            $paramCommission = Parametre::where('cle', 'COMMISSION_POURCENTAGE')->first();
            $pourcentage = $paramCommission ? (float)$paramCommission->valeur : 1.5;
            
            $paramFrais = Parametre::where('cle', 'FRAIS_FIXES')->first();
            $frais = $paramFrais ? (float)$paramFrais->valeur : 1000;

            $montant = (float)$data['montant'];
            $commission = ($montant * $pourcentage) / 100;
            $montantTotal = $montant + $commission + $frais;

            $transfert = Transfert::create([
                'code' => Transfert::generateCode(),
                'expediteur_id' => $expediteur->id,
                'beneficiaire_id' => $beneficiaire->id,
                'agence_envoi_id' => $data['agence_envoi_id'],
                'agence_retrait_id' => $data['agence_retrait_id'] ?? null,
                'utilisateur_envoi_id' => $utilisateurId,
                'montant' => $montant,
                'frais' => $frais,
                'commission' => $commission,
                'statut' => 'ENVOYE',
                'date_envoi' => now()
            ]);

            Commission::create([
                'transfert_id' => $transfert->id,
                'montant' => $commission,
                'pourcentage' => $pourcentage
            ]);

            $agenceEnvoi = Agence::findOrFail($data['agence_envoi_id']);
            $this->ledger->debit($agenceEnvoi, $montantTotal, 'ENVOI', $transfert->id, $utilisateurId);

            if (!empty($data['agence_retrait_id'])) {
                $agenceRetrait = Agence::findOrFail($data['agence_retrait_id']);
                $montantNet = $montant - $commission - $frais;
                if ($montantNet > 0) {
                    $this->ledger->credit($agenceRetrait, $montantNet, 'RECEPTION', $transfert->id, $utilisateurId);
                }
            }

            $this->audit->log($utilisateurId, 'CREATION', 'transfert', $transfert->id, null, $transfert->toArray());

            return $transfert;
        });
    }

    public function retirer(string $code, int $utilisateurId, int $agenceId): Transfert
    {
        return DB::transaction(function () use ($code, $utilisateurId, $agenceId) {
            $transfert = Transfert::where('code', $code)
                ->whereIn('statut', ['ENVOYE', 'EN_ATTENTE'])
                ->firstOrFail();

            if ($transfert->agence_retrait_id && $transfert->agence_retrait_id != $agenceId) {
                throw new \Exception("Retrait non autorisé dans cette agence");
            }

            if (!$transfert->agence_retrait_id) {
                $transfert->agence_retrait_id = $agenceId;
                $transfert->save();
            }

            $montantNet = $transfert->montant - $transfert->commission - $transfert->frais;
            
            if ($montantNet <= 0) {
                throw new \Exception("Montant net de retrait invalide");
            }

            $agence = Agence::findOrFail($agenceId);
            $this->ledger->debit($agence, $montantNet, 'RETRAIT', $transfert->id, $utilisateurId);

            $transfert->update([
                'statut' => 'RETIRE',
                'date_retrait' => now(),
                'utilisateur_retrait_id' => $utilisateurId
            ]);

            $this->audit->log($utilisateurId, 'RETRAIT', 'transfert', $transfert->id, null, $transfert->toArray());

            return $transfert;
        });
    }

    public function annuler(string $code, int $utilisateurId, int $agenceId): Transfert
    {
        return DB::transaction(function () use ($code, $utilisateurId, $agenceId) {
            $transfert = Transfert::where('code', $code)
                ->whereIn('statut', ['ENVOYE', 'EN_ATTENTE'])
                ->firstOrFail();

            if ($transfert->agence_envoi_id != $agenceId) {
                throw new \Exception("Seule l'agence d'envoi peut annuler ce transfert");
            }

            $agence = Agence::findOrFail($agenceId);
            $montantTotal = $transfert->montant + $transfert->commission + $transfert->frais;
            $this->ledger->credit($agence, $montantTotal, 'ANNULATION', $transfert->id, $utilisateurId);

            if ($transfert->agence_retrait_id) {
                $agenceRetrait = Agence::find($transfert->agence_retrait_id);
                if ($agenceRetrait) {
                    $montantNet = $transfert->montant - $transfert->commission - $transfert->frais;
                    if ($montantNet > 0) {
                        $this->ledger->debit($agenceRetrait, $montantNet, 'ANNULATION_RETRAIT', $transfert->id, $utilisateurId);
                    }
                }
            }

            $transfert->update([
                'statut' => 'ANNULE',
                'utilisateur_retrait_id' => $utilisateurId
            ]);

            $this->audit->log($utilisateurId, 'ANNULATION', 'transfert', $transfert->id, null, $transfert->toArray());

            return $transfert;
        });
    }

    public function getByCode(string $code): Transfert
    {
        return Transfert::with(['expediteur', 'beneficiaire', 'agenceEnvoi', 'agenceRetrait'])
            ->where('code', $code)
            ->firstOrFail();
    }

    public function getTransferts(int $agenceId = null, string $statut = null, int $perPage = 20)
    {
        $query = Transfert::with(['expediteur', 'beneficiaire', 'agenceEnvoi', 'agenceRetrait']);

        if ($agenceId) {
            $query->where(function($q) use ($agenceId) {
                $q->where('agence_envoi_id', $agenceId)
                  ->orWhere('agence_retrait_id', $agenceId);
            });
        }

        if ($statut) {
            $query->where('statut', $statut);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getSoldeAgence(int $agenceId): float
    {
        return $this->ledger->getSolde($agenceId);
    }
}
