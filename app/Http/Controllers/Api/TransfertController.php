<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TransfertService;
use App\Services\LedgerService;
use App\Services\AuditService;
use App\Services\EngagementService;
use App\Models\Transfert;
use App\Models\Caisse;
use App\Models\Agence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class TransfertController extends Controller
{
    protected TransfertService $transfertService;
    protected LedgerService $ledgerService;
    protected AuditService $auditService;
    protected EngagementService $engagementService;

    public function __construct(
        TransfertService $transfertService,
        LedgerService $ledgerService,
        AuditService $auditService,
        EngagementService $engagementService
    ) {
        $this->transfertService = $transfertService;
        $this->ledgerService = $ledgerService;
        $this->auditService = $auditService;
        $this->engagementService = $engagementService;
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
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            $transfert = $this->transfertService->creer($validated, $user);
            $this->auditService->logTransfertCreation($transfert);

            return response()->json([
                'message' => 'Transfert créé avec succès',
                'data' => $transfert
            ], 201);
        } catch (\App\Exceptions\FondsInsuffisantsException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (Throwable $e) {
            Log::error('Erreur création transfert: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function retirer(Request $request, string $code)
    {
        try {
            $user = $request->user();
            $transfert = $this->transfertService->retirer($code, $user);
            $this->auditService->logTransfertRetrait($transfert);

            return response()->json([
                'message' => 'Retrait effectué avec succès',
                'data' => $transfert
            ]);
        } catch (Throwable $e) {
            Log::error('Erreur retrait: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
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
                'data' => $transfert
            ]);
        } catch (Throwable $e) {
            Log::error('Erreur annulation: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function verifier(Request $request, string $code)
    {
        try {
            $user = $request->user();
            
            $transfert = Transfert::where('code', strtoupper(trim($code)))
                ->with(['expediteur', 'beneficiaire', 'agenceEnvoi', 'agenceRetrait'])
                ->first();

            if (!$transfert) {
                return response()->json([
                    'success' => false,
                    'message' => 'Code de transfert invalide ou inexistant',
                    'code' => $code
                ], 404);
            }

            if ($transfert->statut === 'RETIRE') {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce code a déjà été retiré',
                    'code' => $code,
                    'statut' => $transfert->statut,
                    'data' => $transfert
                ], 422);
            }

            if ($transfert->statut === 'ANNULE') {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce code a été annulé',
                    'code' => $code,
                    'statut' => $transfert->statut,
                    'data' => $transfert
                ], 422);
            }

            if ($transfert->statut !== 'ENVOYE' && $transfert->statut !== 'EN_ATTENTE') {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce code n\'est pas disponible pour le retrait',
                    'code' => $code,
                    'statut' => $transfert->statut,
                    'data' => $transfert
                ], 422);
            }

            $userAgenceId = $user->agence_id;
            if ($user->role !== 'SUPERADMIN' && $userAgenceId !== $transfert->agence_retrait_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce code est destiné à une autre agence',
                    'code' => $code,
                    'agence_prevue' => $transfert->agenceRetrait?->nom,
                    'agence_prevue_code' => $transfert->agenceRetrait?->code,
                    'votre_agence' => $user->agence?->nom,
                    'statut' => $transfert->statut,
                    'data' => $transfert
                ], 403);
            }

            return response()->json([
                'success' => true,
                'message' => 'Code valide, prêt pour le retrait',
                'code' => $code,
                'statut' => $transfert->statut,
                'data' => [
                    'id' => $transfert->id,
                    'code' => $transfert->code,
                    'montant' => $transfert->montant,
                    'frais' => $transfert->frais,
                    'expediteur' => $transfert->expediteur,
                    'beneficiaire' => $transfert->beneficiaire,
                    'agence_envoi' => $transfert->agenceEnvoi,
                    'agence_retrait' => $transfert->agenceRetrait,
                    'date_envoi' => $transfert->date_envoi,
                    'statut' => $transfert->statut,
                ]
            ]);
        } catch (Throwable $e) {
            Log::error('Erreur verifier code: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la vérification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function soldeAgence(Request $request)
    {
        try {
            $user = $request->user();

            if (in_array($user->role, ['SUPERADMIN', 'ADMIN'])) {
                $agences = Agence::whereNotIn('code', ['SYSTEM', 'FRAIS', 'CAISSE'])->get();
                $soldeTotal = 0;
                foreach ($agences as $agence) {
                    $caisse = Caisse::where('agence_id', $agence->id)->first();
                    $soldeCaisse = $caisse ? $caisse->solde_physique : 0;
                    $soldeEngage = $this->engagementService->getSoldeEngage($agence->id);
                    $soldeTotal += ($soldeCaisse - $soldeEngage);
                }
                return response()->json([
                    'solde' => $soldeTotal,
                    'agence_id' => null,
                    'is_admin' => true
                ]);
            }

            if (!$user || !$user->agence_id) {
                return response()->json([
                    'error' => 'Utilisateur non rattaché à une agence',
                    'solde' => 0
                ], 403);
            }

            $caisse = Caisse::where('agence_id', $user->agence_id)->first();
            $soldeCaisse = $caisse ? $caisse->solde_physique : 0;
            $soldeEngage = $this->engagementService->getSoldeEngage($user->agence_id);
            $soldeDisponible = $soldeCaisse - $soldeEngage;

            return response()->json([
                'solde' => $soldeDisponible,
                'solde_caisse' => $soldeCaisse,
                'solde_engage' => $soldeEngage,
                'agence_id' => $user->agence_id
            ]);
        } catch (Throwable $e) {
            Log::error('Erreur soldeAgence: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage(), 'solde' => 0], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $perPage = $request->input('per_page', 20);

            $query = Transfert::query();

            if (in_array($user->role, ['SUPERADMIN', 'ADMIN'])) {
                // SUPERADMIN et ADMIN voient tous les transferts
            } elseif ($user->agence_id) {
                $query->where(function ($q) use ($user) {
                    $q->where('agence_envoi_id', $user->agence_id)
                      ->orWhere('agence_retrait_id', $user->agence_id);
                });
            } else {
                return response()->json(['data' => [], 'total' => 0]);
            }

            if ($request->has('statut') && $request->statut) {
                $query->where('statut', $request->statut);
            }

            $transferts = $query->orderBy('created_at', 'desc')->paginate($perPage);
            $transferts->load(['expediteur', 'beneficiaire', 'agenceEnvoi', 'agenceRetrait', 'utilisateurEnvoi']);

            return response()->json($transferts);
        } catch (\Exception $e) {
            Log::error('Erreur index transferts: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la récupération des transferts',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
