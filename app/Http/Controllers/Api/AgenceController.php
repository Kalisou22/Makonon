<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agence;
use Illuminate\Http\Request;

class AgenceController extends Controller
{
    public function index()
    {
        try {
            $agences = Agence::all();
            return response()->json($agences);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $agence = Agence::create($request->all());
            return response()->json($agence, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $agence = Agence::findOrFail($id);
            return response()->json($agence);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Agence non trouvée'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $agence = Agence::findOrFail($id);
            $agence->update($request->all());
            return response()->json($agence);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $agence = Agence::findOrFail($id);
            $agence->delete();
            return response()->json(['message' => 'Agence supprimée']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
