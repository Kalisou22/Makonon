<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MouvementCaisse;
use App\Models\Caisse;
use App\Services\CaisseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MouvementCaisseController extends Controller
{
    protected CaisseService $caisseService;

    public function __construct(CaisseService $caisseService)
    {
        $this->caisseService = $caisseService;
    }

    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $perPage = $request->input('per_page', 20);

            $query = MouvementCaisse::with(['caisse.agence', 'utilisateur']);

            if ($user->role !== 'SUPERADMIN') {
                $caisse = Caisse::where('agence_id', $user->agence_id)->first();
                if ($caisse) {
                    $query->where('caisse_id', $caisse->id);
                } else {
                    return response()->json(['data' => [], 'total' => 0]);
                }
            }

            if ($request->has('type') && $request->type) {
                $query->where('type', $request->type);
            }

            if ($request->has('motif') && $request->motif) {
                $query->where('motif', $request->motif);
            }

            $mouvements = $query->orderBy('created_at', 'desc')->paginate($perPage);

            $data = $mouvements->map(function ($m) {
                return [
                    'id' => $m->id,
                    'caisse_id' => $m->caisse_id,
                    'agence_id' => $m->caisse->agence_id ?? null,
                    'agence_nom' => $m->caisse->agence->nom ?? '-',
                    'type' => $m->type,
                    'motif' => $m->motif,
                    'montant' => (float) $m->montant,
                    'reference' => $m->reference,
                    'utilisateur_id' => $m->utilisateur_id,
                    'utilisateur_nom' => $m->utilisateur->nom ?? '-',
                    'date_mouvement' => $m->created_at->toISOString(),
                    'created_at' => $m->created_at->toISOString(),
                ];
            });

            return response()->json([
                'data' => $data,
                'current_page' => $mouvements->currentPage(),
                'last_page' => $mouvements->lastPage(),
                'per_page' => $mouvements->perPage(),
                'total' => $mouvements->total(),
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur MouvementCaisseController@index: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'type' => 'required|in:ENTREE,SORTIE',
                'motif' => 'required|string|max:50',
                'montant' => 'required|numeric|min:1',
                'agence_id' => 'required|exists:agences,id',
                'reference' => 'nullable|string|max:50',
            ]);

            $user = $request->user();

            if ($user->role !== 'SUPERADMIN' && $user->agence_id != $validated['agence_id']) {
                return response()->json(['error' => 'Accès non autorisé'], 403);
            }

            $caisse = Caisse::firstOrCreate(
                ['agence_id' => $validated['agence_id']],
                ['solde_physique' => 0, 'solde_comptable' => 0]
            );

            if ($validated['type'] === 'ENTREE') {
                $mouvement = $this->caisseService->entree(
                    $caisse->id,
                    $validated['montant'],
                    $validated['motif'],
                    $user->id,
                    $validated['reference'] ?? null
                );
            } else {
                $mouvement = $this->caisseService->sortie(
                    $caisse->id,
                    $validated['montant'],
                    $validated['motif'],
                    $user->id,
                    $validated['reference'] ?? null
                );
            }

            return response()->json([
                'message' => 'Mouvement enregistré avec succès',
                'data' => $mouvement
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erreur MouvementCaisseController@store: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $mouvement = MouvementCaisse::findOrFail($id);
            $caisse = Caisse::find($mouvement->caisse_id);

            if ($mouvement->type === 'ENTREE') {
                $this->caisseService->sortie(
                    $caisse->id,
                    $mouvement->montant,
                    'ANNULATION',
                    auth()->id(),
                    'Annulation'
                );
            } else {
                $this->caisseService->entree(
                    $caisse->id,
                    $mouvement->montant,
                    'ANNULATION',
                    auth()->id(),
                    'Annulation'
                );
            }

            $mouvement->delete();

            return response()->json(['message' => 'Mouvement supprimé avec succès']);
        } catch (\Exception $e) {
            Log::error('Erreur MouvementCaisseController@destroy: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function solde(Request $request)
    {
        try {
            $user = $request->user();
            $agenceId = $request->input('agence_id', $user->agence_id);

            if ($user->role !== 'SUPERADMIN' && $user->agence_id != $agenceId) {
                return response()->json(['error' => 'Accès non autorisé'], 403);
            }

            $caisse = Caisse::where('agence_id', $agenceId)->first();
            if (!$caisse) {
                return response()->json([
                    'solde_physique' => 0,
                    'solde_comptable' => 0,
                    'solde_ledger' => 0,
                    'ecart' => 0,
                    'statut' => 'SYNCHRONISÉ'
                ]);
            }

            return response()->json($this->caisseService->getSolde($caisse->id));
        } catch (\Exception $e) {
            Log::error('Erreur MouvementCaisseController@solde: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
