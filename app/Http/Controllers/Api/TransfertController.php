<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TransfertService;
use App\Services\LedgerService;
use App\Http\Requests\TransfertRequest;
use App\Exceptions\TransfertException;
use Illuminate\Support\Facades\Log;

class TransfertController extends Controller
{
    protected TransfertService $transfertService;
    protected LedgerService $ledgerService;

    public function __construct(TransfertService $transfertService, LedgerService $ledgerService)
    {
        $this->transfertService = $transfertService;
        $this->ledgerService = $ledgerService;
    }

    public function creer(TransfertRequest $request)
    {
        try {
            // Récupérer toutes les données validées
            $validated = $request->validated();
            
            // 🔥 Vérifier que idempotency_key est présent
            if (empty($validated['idempotency_key'])) {
                return response()->json([
                    'message' => 'La clé d\'idempotence est requise',
                    'code' => 422
                ], 422);
            }

            $user = $request->user();
            $transfert = $this->transfertService->creer($validated, $user);

            return response()->json([
                'message' => 'Transfert créé avec succès',
                'data' => [
                    'id' => $transfert->id,
                    'code' => $transfert->code,
                    'montant' => $transfert->montant,
                    'frais' => $transfert->frais,
                    'statut' => $transfert->statut,
                ]
            ], 201);
        } catch (TransfertException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'code' => $e->getCode() ?: 422
            ], $e->getCode() ?: 422);
        } catch (\Exception $e) {
            Log::error('Erreur création transfert', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json([
                'message' => 'Erreur serveur: ' . $e->getMessage(),
                'code' => 500
            ], 500);
        }
    }

    // Les autres méthodes restent identiques...
}
