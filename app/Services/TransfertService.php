<?php

namespace App\Services;

use App\Models\Transfert;
use App\Models\Client;
use App\Models\Agence;
use App\Models\User;
use App\Exceptions\FondsInsuffisantsException;
use App\Exceptions\TransfertException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TransfertService
{
    protected LedgerService $ledgerService;

    public function __construct(LedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    public function creer(array $data, User $user): Transfert
    {
        // 🔥 Vérification STRICTE de l'idempotency_key
        if (empty($data['idempotency_key'])) {
            throw new TransfertException('La clé d\'idempotence est requise', 422);
        }

        // 🔥 Vérifier si le transfert existe déjà
        $existing = Transfert::where('idempotency_key', $data['idempotency_key'])->first();
        if ($existing) {
            Log::info('Transfert déjà existant (idempotence)', [
                'idempotency_key' => $data['idempotency_key'],
                'transfert_id' => $existing->id
            ]);
            return $existing;
        }

        return DB::transaction(function () use ($data, $user) {
            $agenceEmettrice = Agence::where('id', $data['agence_envoi_id'])->lockForUpdate()->first();
            $agenceDestinataire = Agence::where('id', $data['agence_destinataire_id'])->lockForUpdate()->first();

            if (!$agenceEmettrice || !$agenceDestinataire) {
                throw new TransfertException('Agence non trouvée', 404);
            }

            $expediteur = Client::firstOrCreate(
                ['telephone' => $data['telephone_expediteur']],
                ['nom' => $data['nom_expediteur']]
            );

            $beneficiaire = Client::firstOrCreate(
                ['telephone' => $data['telephone_beneficiaire']],
                ['nom' => $data['nom_beneficiaire']]
            );

            $frais = $this->calculerFrais($data['montant']);
            $total = $data['montant'] + $frais;

            $solde = $this->ledgerService->getSoldeWithLock($agenceEmettrice->id);
            if ($solde < $total) {
                throw new FondsInsuffisantsException($solde, $total);
            }

            $code = Transfert::generateCode();

            $transfert = Transfert::create([
                'code' => $code,
                'expediteur_id' => $expediteur->id,
                'beneficiaire_id' => $beneficiaire->id,
                'agence_envoi_id' => $agenceEmettrice->id,
                'agence_retrait_id' => $agenceDestinataire->id,
                'utilisateur_envoi_id' => $user->id,
                'montant' => $data['montant'],
                'frais' => $frais,
                'commission' => $frais * 0.75,
                'statut' => 'ENVOYE',
                'date_envoi' => now(),
                'idempotency_key' => $data['idempotency_key'], // 🔥 AJOUT OBLIGATOIRE
            ]);

            // Écritures ledger
            $this->ledgerService->debit(
                $agenceEmettrice,
                $total,
                'TRANSFERT_EMIS',
                $transfert->id,
                $user->id,
                $code,
                "Transfert émis vers {$agenceDestinataire->nom}"
            );

            $this->ledgerService->credit(
                $agenceDestinataire,
                $data['montant'],
                'TRANSFERT_RECU',
                $transfert->id,
                $user->id,
                $code,
                "Transfert reçu de {$agenceEmettrice->nom}"
            );

            $this->ledgerService->credit(
                $agenceEmettrice,
                $frais,
                'FRAIS_TRANSFERT',
                $transfert->id,
                $user->id,
                $code,
                "Frais transfert - Code: {$code}"
            );

            // Vérification finale
            $this->ledgerService->verifierDoubleEcriture($transfert->id);

            Log::channel('audit')->info('transfert_cree', [
                'transfert_id' => $transfert->id,
                'code' => $code,
                'montant' => $data['montant'],
                'frais' => $frais,
                'total' => $total,
                'idempotency_key' => $data['idempotency_key'],
                'user_id' => $user->id
            ]);

            return $transfert;
        });
    }

    // Les autres méthodes (retirer, annuler) restent identiques...
    private function calculerFrais(float $montant): float
    {
        if ($montant <= 100000) return 1000;
        if ($montant <= 500000) return 2000;
        if ($montant <= 1000000) return 3000;
        return 5000;
    }
}
