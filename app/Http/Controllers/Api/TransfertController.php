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
                'code' => $e->getCode() ?: 422
            ], $e->getCode() ?: 422);
        }
    }

    public function retirer(Request $request, string $code)
    {
        $user = auth()->user();

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
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'code' => $e->getCode() ?: 422
            ], $e->getCode() ?: 422);
        }
    }

    public function annuler(Request $request, string $code)
    {
        $user = auth()->user();

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
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'code' => $e->getCode() ?: 422
            ], $e->getCode() ?: 422);
        }
    }

    public function index(Request $request)
    {
        $user = auth()->user();
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

        if (!$user->agence_id) {
            return response()->json(['error' => 'Utilisateur non rattaché à une agence'], 403);
        }

        return response()->json([
            'solde' => $this->ledgerService->getSolde($user->agence_id),
            'agence_id' => $user->agence_id
        ]);
    }
}
