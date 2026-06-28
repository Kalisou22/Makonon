<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TransfertService;
use App\Services\LedgerService;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class TransfertController extends Controller
{
    protected TransfertService $transfertService;
    protected LedgerService $ledgerService;
    protected AuditService $auditService;

    public function __construct(
        TransfertService $transfertService,
        LedgerService $ledgerService,
        AuditService $auditService
    ) {
        $this->transfertService = $transfertService;
        $this->ledgerService = $ledgerService;
        $this->auditService = $auditService;
    }

    public function creer(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom_expediteur' => 'required|string|max:100',
                'telephone_expediteur' => 'required|string|max:30',
                'nom_beneficiaire' => 'required|string|max:100',
                'telephone_beneficiaire' => 'required|string|max:30',
                'montant' => 'required|numeric|min:100|max:999999999.99',
                'agence_envoi_id' => 'required|exists:agences,id',
                'agence_destinataire_id' => 'required|exists:agences,id|different:agence_envoi_id',
                // 🔥 IDEMPOTENCY KEY REQUIRED
                'idempotency_key' => 'required|string|max:100',
            ]);

            $user = $request->user();
            $transfert = $this->transfertService->creer($validated, $user);

            $this->auditService->logTransfertCreation($transfert);

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
        } catch (Throwable $e) {
            Log::error('Erreur création transfert', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json([
                'message' => $e->getMessage(),
                'code' => $e->getCode() ?: 500
            ], $e->getCode() ?: 500);
        }
    }

    public function retirer(Request $request, string $code)
    {
        $user = $request->user();
        try {
            $transfert = $this->transfertService->retirer($code, $user);
            $this->auditService->logTransfertRetrait($transfert);

            return response()->json([
                'message' => 'Retrait effectué avec succès',
                'data' => [
                    'id' => $transfert->id,
                    'code' => $transfert->code,
                    'statut' => $transfert->statut,
                    'date_retrait' => $transfert->date_retrait,
                ]
            ]);
        } catch (Throwable $e) {
            Log::error('Erreur retrait', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json([
                'message' => $e->getMessage(),
                'code' => $e->getCode() ?: 500
            ], $e->getCode() ?: 500);
        }
    }

    public function annuler(Request $request, string $code)
    {
        $user = $request->user();
        try {
            $transfert = $this->transfertService->annuler($code, $user, $request->motif);
            $this->auditService->logTransfertAnnulation($transfert, $request->motif ?? 'Annulation par utilisateur');

            return response()->json([
                'message' => 'Transfert annulé avec succès',
                'data' => [
                    'id' => $transfert->id,
                    'code' => $transfert->code,
                    'statut' => $transfert->statut,
                    'date_annulation' => $transfert->date_annulation,
                ]
            ]);
        } catch (Throwable $e) {
            Log::error('Erreur annulation', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json([
                'message' => $e->getMessage(),
                'code' => $e->getCode() ?: 500
            ], $e->getCode() ?: 500);
        }
    }

    public function verifier(string $code)
    {
        $transfert = \App\Models\Transfert::where('code', $code)
            ->with(['expediteur', 'beneficiaire', 'agenceEnvoi', 'agenceRetrait'])
            ->first();

        if (!$transfert) {
            return response()->json(['error' => 'Transfert introuvable'], 404);
        }

        return response()->json(['data' => $transfert]);
    }

    public function soldeAgence()
    {
        $user = auth()->user();

        if (!$user || !$user->agence_id) {
            return response()->json(['error' => 'Utilisateur non rattaché à une agence'], 403);
        }

        try {
            return response()->json([
                'solde' => $this->ledgerService->getSolde($user->agence_id),
                'agence_id' => $user->agence_id
            ]);
        } catch (Throwable $e) {
            Log::error('Erreur solde agence', ['message' => $e->getMessage()]);
            return response()->json(['message' => 'Erreur serveur'], 500);
        }
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $query = \App\Models\Transfert::with(['expediteur', 'beneficiaire', 'agenceEnvoi', 'agenceRetrait']);

        if ($user->agence_id && $user->role !== 'SUPERADMIN') {
            $query->where(function ($q) use ($user) {
                $q->where('agence_envoi_id', $user->agence_id)
                  ->orWhere('agence_retrait_id', $user->agence_id);
            });
        }

        if ($request->statut) {
            $query->where('statut', $request->statut);
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 20));
    }
}
