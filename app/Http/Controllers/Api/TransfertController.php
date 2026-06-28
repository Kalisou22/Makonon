<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TransfertService;
use App\Services\LedgerService;
use App\Http\Requests\TransfertRequest;
use App\Exceptions\TransfertException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class TransfertController extends Controller
{
    protected TransfertService $transfertService;
    protected LedgerService $ledgerService;

    public function __construct(TransfertService $transfertService, LedgerService $ledgerService)
    {
        $this->transfertService = $transfertService;
        $this->ledgerService = $ledgerService;
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
                'idempotency_key' => 'required|string|max:100|unique:transferts,idempotency_key',
            ]);

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
        } catch (Throwable $e) {
            Log::error('Erreur création transfert', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json([
                'message' => 'Erreur serveur: ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'code' => 500
            ], 500);
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

        $transferts = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($transferts);
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
            return response()->json([
                'error' => 'Utilisateur non rattaché à une agence'
            ], 403);
        }

        try {
            $solde = $this->ledgerService->getSolde($user->agence_id);
            return response()->json([
                'solde' => $solde,
                'agence_id' => $user->agence_id
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur: ' . $e->getMessage(),
                'code' => 500
            ], 500);
        }
    }

    public function retirer(Request $request, string $code)
    {
        $user = $request->user();
        try {
            $transfert = $this->transfertService->retirer($code, $user);
            return response()->json([
                'message' => 'Retrait effectué avec succès',
                'data' => [
                    'id' => $transfert->id,
                    'code' => $transfert->code,
                    'statut' => $transfert->statut,
                    'date_retrait' => $transfert->date_retrait,
                ]
            ]);
        } catch (TransfertException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'code' => $e->getCode() ?: 422
            ], $e->getCode() ?: 422);
        } catch (Throwable $e) {
            Log::error('Erreur retrait', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json([
                'message' => 'Erreur: ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'code' => 500
            ], 500);
        }
    }

    public function annuler(Request $request, string $code)
    {
        $user = $request->user();
        try {
            $transfert = $this->transfertService->annuler($code, $user, $request->motif);
            return response()->json([
                'message' => 'Transfert annulé avec succès',
                'data' => [
                    'id' => $transfert->id,
                    'code' => $transfert->code,
                    'statut' => $transfert->statut,
                    'date_annulation' => $transfert->date_annulation,
                ]
            ]);
        } catch (TransfertException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'code' => $e->getCode() ?: 422
            ], $e->getCode() ?: 422);
        } catch (Throwable $e) {
            Log::error('Erreur annulation', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json([
                'message' => 'Erreur: ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'code' => 500
            ], 500);
        }
    }
}
