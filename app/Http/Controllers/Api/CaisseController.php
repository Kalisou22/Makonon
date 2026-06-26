<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CaisseRequest;
use App\Models\Caisse;
use App\Services\CaisseService;

class CaisseController extends Controller
{
    protected CaisseService $caisseService;
    
    public function __construct(CaisseService $caisseService)
    {
        $this->caisseService = $caisseService;
    }
    
    public function index()
    {
        return response()->json(Caisse::all());
    }
    
    public function show(Caisse $caisse)
    {
        return response()->json($caisse);
    }
    
    public function solde(Caisse $caisse)
    {
        return response()->json($this->caisseService->getSolde($caisse->id));
    }
    
    public function entree(CaisseRequest $request)
    {
        try {
            $mouvement = $this->caisseService->entree(
                $request->caisse_id,
                $request->montant,
                $request->motif,
                $request->user()->id,
                $request->reference
            );
            return response()->json($mouvement, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
    
    public function sortie(CaisseRequest $request)
    {
        try {
            $mouvement = $this->caisseService->sortie(
                $request->caisse_id,
                $request->montant,
                $request->motif,
                $request->user()->id,
                $request->reference
            );
            return response()->json($mouvement, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
