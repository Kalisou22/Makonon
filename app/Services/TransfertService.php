<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Models\Transfert;
use App\Models\Client;
use App\Models\Agence;
use App\Models\Transaction;
use Exception;
use Illuminate\Support\Facades\Log;

class TransfertService
{
    /**
     * Créer un nouveau transfert
     */
    public function createTransfert(array $data): Transfert
    {
        DB::beginTransaction();

        try {
            // Vérifier le client
            $client = Client::findOrFail($data['client_id']);

            // Vérifier l'agence source
            $agenceSource = Agence::findOrFail($data['agence_source_id']);

            // Vérifier l'agence destination
            $agenceDest = Agence::findOrFail($data['agence_destination_id']);

            // Calculer les frais
            $frais = $this->calculerFrais($data['montant']);

            // Créer le transfert
            $transfert = Transfert::create([
                'client_id' => $data['client_id'],
                'agence_source_id' => $data['agence_source_id'],
                'agence_destination_id' => $data['agence_destination_id'],
                'montant' => $data['montant'],
                'frais' => $frais,
                'montant_total' => $data['montant'] + $frais,
                'statut' => 'PENDING',
                'reference' => $this->genererReference(),
            ]);

            // Créer la transaction associée
            Transaction::create([
                'transfert_id' => $transfert->id,
                'type' => 'DEBIT',
                'montant' => $data['montant'] + $frais,
                'description' => 'Transfert vers ' . $agenceDest->nom,
                'statut' => 'PENDING',
            ]);

            DB::commit();

            Log::info('Transfert créé avec succès', ['transfert_id' => $transfert->id]);

            return $transfert;

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la création du transfert', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw new Exception('Erreur lors de la création du transfert: ' . $e->getMessage());
        }
    }

    /**
     * Valider un transfert
     */
    public function validerTransfert(int $id, array $data): Transfert
    {
        DB::beginTransaction();

        try {
            $transfert = Transfert::findOrFail($id);

            if ($transfert->statut !== 'PENDING') {
                throw new Exception('Ce transfert ne peut pas être validé.');
            }

            $transfert->update([
                'statut' => 'COMPLETED',
                'date_validation' => now(),
                'valide_par' => $data['valide_par'] ?? null,
            ]);

            // Mettre à jour la transaction
            Transaction::where('transfert_id', $transfert->id)
                ->update(['statut' => 'COMPLETED']);

            DB::commit();

            Log::info('Transfert validé', ['transfert_id' => $transfert->id]);

            return $transfert;

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la validation du transfert', [
                'error' => $e->getMessage(),
                'transfert_id' => $id
            ]);
            throw new Exception('Erreur lors de la validation du transfert: ' . $e->getMessage());
        }
    }

    /**
     * Annuler un transfert
     */
    public function annulerTransfert(int $id, string $motif): Transfert
    {
        DB::beginTransaction();

        try {
            $transfert = Transfert::findOrFail($id);

            if ($transfert->statut === 'COMPLETED') {
                throw new Exception('Un transfert déjà validé ne peut pas être annulé.');
            }

            $transfert->update([
                'statut' => 'CANCELLED',
                'motif_annulation' => $motif,
                'date_annulation' => now(),
            ]);

            // Mettre à jour la transaction
            Transaction::where('transfert_id', $transfert->id)
                ->update(['statut' => 'CANCELLED']);

            DB::commit();

            Log::info('Transfert annulé', ['transfert_id' => $transfert->id]);

            return $transfert;

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de l\'annulation du transfert', [
                'error' => $e->getMessage(),
                'transfert_id' => $id
            ]);
            throw new Exception('Erreur lors de l\'annulation du transfert: ' . $e->getMessage());
        }
    }

    /**
     * Calculer les frais de transfert
     */
    private function calculerFrais(float $montant): float
    {
        if ($montant <= 10000) {
            return 500;
        } elseif ($montant <= 50000) {
            return 1000;
        } elseif ($montant <= 100000) {
            return 2000;
        } elseif ($montant <= 500000) {
            return 5000;
        } else {
            return $montant * 0.02;
        }
    }

    /**
     * Générer une référence unique
     */
    private function genererReference(): string
    {
        return 'TRF-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
    }

    /**
     * Récupérer tous les transferts
     */
    public function getAllTransferts(array $filters = [])
    {
        $query = Transfert::with(['client', 'agenceSource', 'agenceDestination']);

        if (isset($filters['statut'])) {
            $query->where('statut', $filters['statut']);
        }

        if (isset($filters['client_id'])) {
            $query->where('client_id', $filters['client_id']);
        }

        if (isset($filters['agence_id'])) {
            $query->where(function($q) use ($filters) {
                $q->where('agence_source_id', $filters['agence_id'])
                  ->orWhere('agence_destination_id', $filters['agence_id']);
            });
        }

        if (isset($filters['date_debut']) && isset($filters['date_fin'])) {
            $query->whereBetween('created_at', [$filters['date_debut'], $filters['date_fin']]);
        }

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    /**
     * Récupérer un transfert par son ID
     */
    public function getTransfertById(int $id): Transfert
    {
        return Transfert::with(['client', 'agenceSource', 'agenceDestination', 'transactions'])
            ->findOrFail($id);
    }

    /**
     * Mettre à jour un transfert
     */
    public function updateTransfert(int $id, array $data): Transfert
    {
        $transfert = Transfert::findOrFail($id);

        if ($transfert->statut !== 'PENDING') {
            throw new Exception('Seuls les transferts en attente peuvent être modifiés.');
        }

        $transfert->update($data);

        Log::info('Transfert mis à jour', ['transfert_id' => $transfert->id]);

        return $transfert;
    }

    /**
     * Supprimer un transfert
     */
    public function deleteTransfert(int $id): bool
    {
        $transfert = Transfert::findOrFail($id);

        if ($transfert->statut === 'COMPLETED') {
            throw new Exception('Un transfert validé ne peut pas être supprimé.');
        }

        // Supprimer les transactions associées
        Transaction::where('transfert_id', $id)->delete();

        $deleted = $transfert->delete();

        Log::info('Transfert supprimé', ['transfert_id' => $id]);

        return $deleted;
    }
}
