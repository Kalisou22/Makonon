<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ledger;
use App\Models\Agence;
use App\Services\LedgerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LedgerController extends Controller
{
    protected LedgerService $ledgerService;

    public function __construct(LedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    /**
     * Ledger par agence (version safe)
     */
    public function byAgence(Request $request, int $agenceId)
    {
        try {
            $perPage = (int) $request->get('per_page', 10);

            // Vérifier que l'agence existe
            $agence = Agence::find($agenceId);

            if (!$agence) {
                return response()->json([
                    'message' => 'Agence introuvable'
                ], 404);
            }

            // Récupérer les écritures
            $entries = Ledger::where('agence_id', $agenceId)
                ->with(['utilisateur', 'transfert'])
                ->latest('created_at')
                ->paginate($perPage);

            // Calculer le solde
            $solde = $this->ledgerService->getSolde($agenceId);

            return response()->json([
                'agence' => [
                    'id' => $agence->id,
                    'nom' => $agence->nom,
                    'code' => $agence->code
                ],
                'solde' => $solde,
                'total' => $entries->total(),
                'data' => $entries
            ]);

        } catch (\Exception $e) {
            Log::error('LedgerController error', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);

            return response()->json([
                'message' => 'Erreur serveur',
                'error' => $e->getMessage() // 🔥 TEMPORAIRE DEBUG
            ], 500);
        }
    }

    /**
     * Liste des écritures ledger
     */
    public function index(Request $request)
    {
        try {
            $query = Ledger::with(['agence', 'utilisateur', 'transfert'])
                ->latest('created_at');

            if ($request->type) {
                $query->where('type', $request->type);
            }

            if ($request->nature) {
                $query->where('nature', $request->nature);
            }

            $perPage = (int) $request->get('per_page', 20);
            $ledger = $query->paginate($perPage);

            return response()->json($ledger);

        } catch (\Exception $e) {
            Log::error('Ledger index error', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);

            return response()->json([
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
