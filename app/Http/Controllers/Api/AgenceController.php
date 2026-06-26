<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AgenceRequest;
use App\Models\Agence;

class AgenceController extends Controller
{
    public function index()
    {
        return response()->json(Agence::all());
    }
    
    public function store(AgenceRequest $request)
    {
        $agence = Agence::create($request->validated());
        return response()->json($agence, 201);
    }
    
    public function show(Agence $agence)
    {
        return response()->json($agence);
    }
    
    public function update(AgenceRequest $request, Agence $agence)
    {
        $agence->update($request->validated());
        return response()->json($agence);
    }
    
    public function destroy(Agence $agence)
    {
        if ($agence->utilisateurs()->count() > 0) {
            return response()->json(['error' => 'Cette agence a des utilisateurs'], 400);
        }
        $agence->delete();
        return response()->json(['message' => 'Agence supprimée']);
    }
}
