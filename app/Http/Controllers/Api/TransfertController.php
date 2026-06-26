<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TransfertRequest;
use App\Services\TransfertService;
use App\Services\LedgerService;
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

    public function creer(TransfertRequest $request)
    {
        try {
            $transfert = $this->transfertService->creer($request->validated(), $request->user()->id);
            return response()->json([
                'message' => 'Transfert créé avec succès',
                'transfert' => $transfert,
                'code' => $transfert->code
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function retirer(Request $request, string $code)
    {
        try {
            $transfert = $this->transfertService->retirer($code, $request->user()->id, $request->user()->agence_id);
            return response()->json([
                'message' => 'Transfert retiré avec succès',
                'transfert' => $transfert
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function annuler(Request $request, string $code)
    {
        try {
            $transfert = $this->transfertService->annuler($code, $request->user()->id, $request->user()->agence_id);
            return response()->json([
                'message' => 'Transfert annulé avec succès',
                'transfert' => $transfert
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function verifier(string $code)
    {
        try {
            $transfert = $this->transfertService->getByCode($code);
            return response()->json([
                'transfert' => $transfert,
                'est_retirable' => in_array($transfert->statut, ['ENVOYE', 'EN_ATTENTE'])
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Code introuvable'], 404);
        }
    }

    public function index(Request $request)
    {
        $transferts = $this->transfertService->getTransferts(
            $request->user()->agence_id,
            $request->statut,
            $request->per_page ?? 20
        );
        return response()->json($transferts);
    }

    public function soldeAgence(Request $request)
    {
        $solde = $this->transfertService->getSoldeAgence($request->user()->agence_id);
        return response()->json([
            'solde' => $solde,
            'agence_id' => $request->user()->agence_id
        ]);
    }

    public function statistiques(Request $request)
    {
        $agenceId = $request->user()->agence_id;
        
        $stats = [
            'total_envoyes' => \App\Models\Transfert::where('agence_envoi_id', $agenceId)->count(),
            'total_recus' => \App\Models\Transfert::where('agence_retrait_id', $agenceId)->count(),
            'total_retires' => \App\Models\Transfert::where('agence_retrait_id', $agenceId)
                ->where('statut', 'RETIRE')->count(),
            'total_annules' => \App\Models\Transfert::where(function($q) use ($agenceId) {
                $q->where('agence_envoi_id', $agenceId)
                  ->orWhere('agence_retrait_id', $agenceId);
            })->where('statut', 'ANNULE')->count(),
            'solde' => $this->transfertService->getSoldeAgence($agenceId)
        ];
        
        return response()->json($stats);
    }
}
