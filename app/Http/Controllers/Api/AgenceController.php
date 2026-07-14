<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agence;
use App\Models\Caisse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AgenceController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            // ✅ Exclure SYSTEM, FRAIS, CAISSE de la liste des agences
            $query = Agence::whereNotIn('code', ['FRAIS', 'SYSTEM', 'CAISSE'])
                ->where('actif', 1);
            
            $perPage = (int) $request->input('per_page', 20);
            $agences = $query->orderBy('id')->paginate($perPage);
            
            $agences->getCollection()->transform(function ($agence) {
                $caisse = Caisse::where('agence_id', $agence->id)->first();
                $agence->caisse = $caisse;
                return $agence;
            });
            
            return response()->json($agences);
        } catch (\Exception $e) {
            Log::error('AgenceController@index: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur'], 500);
        }
    }

    // ... autres méthodes (store, show, update, destroy)
}
