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
            $perPage = (int) $request->input('per_page', 20);

            $query = MouvementCaisse::with(['caisse.agence', 'utilisateur', 'transfert']);

            if ($user->role !== 'SUPERADMIN') {
                $caisse = Caisse::where('agence_id', $user->agence_id)->first();
                if ($caisse) {
                    $query->where('caisse_id', $caisse->id);
                } else {
                    return response()->json(['data' => [], 'total' => 0, 'current_page' => 1, 'last_page' => 1, 'per_page' => $perPage]);
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
                    'transfert_id' => $m->transfert_id,
                    'transfert_code' => $m->transfert->code ?? null,
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
            Log::error('MouvementCaisseController@index: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
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
                    $validated['reference'] ?? null,
                    null
                );
            } else {
                $mouvement = $this->caisseService->sortie(
                    $caisse->id,
                    $validated['montant'],
                    $validated['motif'],
                    $user->id,
                    $validated['reference'] ?? null,
                    null
                );
            }

            return response()->json([
                'message' => 'Mouvement enregistré avec succès',
                'data' => $mouvement
            ], 201);
        } catch (\Exception $e) {
            Log::error('MouvementCaisseController@store: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $mouvement = MouvementCaisse::findOrFail($id);

            if ($mouvement->transfert_id) {
                return response()->json([
                    'error' => 'Impossible de supprimer un mouvement lié à un transfert'
                ], 422);
            }

            $caisse = Caisse::find($mouvement->caisse_id);

            if ($mouvement->type === 'ENTREE') {
                $this->caisseService->sortie(
                    $caisse->id,
                    $mouvement->montant,
                    'ANNULATION',
                    auth()->id(),
                    'Annulation du mouvement #' . $id,
                    null
                );
            } else {
                $this->caisseService->entree(
                    $caisse->id,
                    $mouvement->montant,
                    'ANNULATION',
                    auth()->id(),
                    'Annulation du mouvement #' . $id,
                    null
                );
            }

            $mouvement->delete();

            return response()->json(['message' => 'Mouvement supprimé avec succès']);
        } catch (\Exception $e) {
            Log::error('MouvementCaisseController@destroy: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function solde(Request $request)
    {
        try {
            $user = $request->user();
            $agenceId = $request->input('agence_id');

            if ($user->role === 'SUPERADMIN' && !$agenceId) {
                $caisses = Caisse::with('agence')->get();
                $result = [];
                foreach ($caisses as $caisse) {
                    $solde = $this->caisseService->getSolde($caisse->id);
                    $result[] = [
                        'agence_id' => $caisse->agence_id,
                        'agence_nom' => $caisse->agence->nom,
                        'solde_physique' => $solde['solde_physique'],
                        'solde_comptable' => $solde['solde_comptable'],
                        'solde_ledger' => $solde['solde_ledger'],
                        'ecart' => $solde['ecart'],
                        'statut' => $solde['statut'],
                    ];
                }
                return response()->json($result);
            }

            $caisse = Caisse::where('agence_id', $agenceId ?? $user->agence_id)->first();
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
            Log::error('MouvementCaisseController@solde: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
