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
                'idempotency_key' => 'required|string|max:100',
            ]);

            $user = $request->user();

            if ($user->role !== 'SUPERADMIN' && $user->agence_id != $validated['agence_envoi_id']) {
                return response()->json([
                    'message' => 'Accès non autorisé à cette agence',
                    'user_agence' => $user->agence_id,
                    'requested_agence' => $validated['agence_envoi_id']
                ], 403);
            }

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
            Log::error('❌ Erreur création transfert: ' . $e->getMessage());
            return response()->json([
                'message' => $e->getMessage(),
                'code' => 500
            ], 500);
        }
    }

    public function retirer(Request $request, string $code)
    {
        try {
            Log::info('Tentative de retrait', ['code' => $code, 'user' => $request->user()?->id]);

            $user = $request->user();
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
        } catch (\App\Exceptions\TransfertException $e) {
            Log::warning('⚠️ Erreur retrait: ' . $e->getMessage());
            return response()->json([
                'message' => $e->getMessage(),
                'code' => $e->getCode()
            ], $e->getCode());
        } catch (\App\Exceptions\FondsInsuffisantsException $e) {
            Log::warning('⚠️ Fonds insuffisants: ' . $e->getMessage());
            return response()->json([
                'message' => $e->getMessage(),
                'code' => 422
            ], 422);
        } catch (Throwable $e) {
            Log::error('❌ Erreur retrait: ' . $e->getMessage());
            return response()->json([
                'message' => $e->getMessage(),
                'code' => 500
            ], 500);
        }
    }

    public function annuler(Request $request, string $code)
    {
        try {
            $user = $request->user();
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
            Log::error('❌ Erreur annulation: ' . $e->getMessage());
            return response()->json([
                'message' => $e->getMessage(),
                'code' => 500
            ], 500);
        }
    }

    public function verifier(string $code)
    {
        try {
            $transfert = \App\Models\Transfert::where('code', $code)
                ->with(['expediteur', 'beneficiaire', 'agenceEnvoi', 'agenceRetrait'])
                ->first();

            if (!$transfert) {
                return response()->json(['error' => 'Transfert introuvable'], 404);
            }

            return response()->json(['data' => $transfert]);
        } catch (Throwable $e) {
            Log::error('❌ Erreur verifier: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function soldeAgence()
    {
        try {
            $user = auth()->user();

            if ($user->role === 'SUPERADMIN') {
                $solde = $this->ledgerService->getSolde($user->agence_id ?? 4);
                return response()->json(['solde' => $solde, 'agence_id' => $user->agence_id]);
            }

            if (!$user || !$user->agence_id) {
                return response()->json(['error' => 'Utilisateur non rattaché à une agence', 'solde' => 0], 403);
            }

            $solde = $this->ledgerService->getSolde($user->agence_id);
            return response()->json(['solde' => $solde, 'agence_id' => $user->agence_id]);
        } catch (Throwable $e) {
            Log::error('❌ Erreur soldeAgence: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage(), 'solde' => 0], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $perPage = $request->input('per_page', 20);

            $query = \App\Models\Transfert::with([
                'expediteur',
                'beneficiaire',
                'agenceEnvoi',
                'agenceRetrait',
                'utilisateurEnvoi'
            ]);

            if ($user->role === 'SUPERADMIN') {
                // SUPERADMIN voit tous les transferts
            } elseif ($user->agence_id) {
                $query->where(function ($q) use ($user) {
                    $q->where('agence_envoi_id', $user->agence_id)
                      ->orWhere('agence_retrait_id', $user->agence_id);
                });
            }

            if ($request->has('statut') && $request->statut) {
                $query->where('statut', $request->statut);
            }

            $transferts = $query->orderBy('created_at', 'desc')->paginate($perPage);
            return response()->json($transferts);
        } catch (\Exception $e) {
            Log::error('❌ Erreur index transferts: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la récupération des transferts', 'error' => $e->getMessage()], 500);
        }
    }
}
