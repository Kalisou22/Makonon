<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TransfertService;
use App\Services\LedgerService;
use App\Exceptions\TransfertException;
use Illuminate\Http\Request;

class TransfertController extends Controller
{
    protected TransfertService $transfertService;
    protected LedgerService $ledgerService;

    public function __construct(TransfertService $transfertService, LedgerService $ledgerService)
    {
        $this->transfertService = $transfertService;
        $this->ledgerService = $ledgerService;
    }

    /**
     * Créer un transfert
     */
    public function creer(Request $request)
    {
        $validated = $request->validate([
            'nom_expediteur' => 'required|string|max:100',
            'telephone_expediteur' => 'required|string|max:30',
            'nom_beneficiaire' => 'required|string|max:100',
            'telephone_beneficiaire' => 'required|string|max:30',
            'montant' => 'required|numeric|min:100|max:999999999.99',
            'agence_envoi_id' => 'required|exists:agences,id',
            'agence_destinataire_id' => 'required|exists:agences,id|different:agence_envoi_id',
        ]);

        $user = auth()->user();

        try {
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
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'code' => 422
            ], 422);
        }
    }

    /**
     * Solde de l'agence connectée
     */
    public function soldeAgence()
    {
        $user = auth()->user();

        if (!$user->agence_id) {
            return response()->json([
                'error' => 'Utilisateur non rattaché à une agence'
            ], 403);
        }

        $solde = $this->ledgerService->getSolde($user->agence_id);

        return response()->json([
            'solde' => $solde,
            'agence_id' => $user->agence_id
        ]);
    }

    /**
     * Liste des transferts
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = \App\Models\Transfert::with(['expediteur', 'beneficiaire', 'agenceEnvoi', 'agenceRetrait']);

        if ($user->agence_id) {
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

    /**
     * Vérifier un transfert
     */
    public function verifier(string $code)
    {
        $transfert = \App\Models\Transfert::where('code', $code)
            ->with(['expediteur', 'beneficiaire', 'agenceEnvoi', 'agenceRetrait'])
            ->first();

        if (!$transfert) {
            return response()->json([
                'error' => 'Transfert introuvable'
            ], 404);
        }

        return response()->json([
            'data' => $transfert
        ]);
    }

    /**
     * Retirer un transfert
     */
    public function retirer(Request $request, string $code)
    {
        $user = auth()->user();
        $transfert = \App\Models\Transfert::where('code', $code)
            ->where('statut', 'ENVOYE')
            ->first();

        if (!$transfert) {
            return response()->json([
                'error' => 'Transfert introuvable ou déjà retiré'
            ], 404);
        }

        // Logique de retrait à implémenter
        return response()->json([
            'message' => 'Fonctionnalité de retrait en développement',
            'code' => $code
        ]);
    }

    /**
     * Annuler un transfert
     */
    public function annuler(Request $request, string $code)
    {
        return response()->json([
            'message' => 'Fonctionnalité d\'annulation en développement',
            'code' => $code
        ]);
    }
}
