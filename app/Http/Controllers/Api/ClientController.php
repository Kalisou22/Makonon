<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Transfert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClientController extends Controller
{
    public function index()
    {
        try {
            $clients = Client::all();
            return response()->json($clients);
        } catch (\Exception $e) {
            Log::error('Erreur ClientController@index: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:100',
                'telephone' => 'required|string|max:30|unique:clients,telephone',
                'email' => 'nullable|email|max:100',
                'piece_identite' => 'nullable|string|max:50',
                'numero_piece' => 'nullable|string|max:50',
            ]);

            $client = Client::create($validated);
            return response()->json([
                'message' => 'Client créé avec succès',
                'data' => $client
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erreur ClientController@store: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $client = Client::find($id);
            if (!$client) {
                return response()->json(['error' => 'Client non trouvé'], 404);
            }
            return response()->json($client);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $client = Client::find($id);
            if (!$client) {
                return response()->json(['error' => 'Client non trouvé'], 404);
            }

            $validated = $request->validate([
                'nom' => 'sometimes|string|max:100',
                'telephone' => 'sometimes|string|max:30|unique:clients,telephone,' . $id,
                'email' => 'nullable|email|max:100',
                'piece_identite' => 'nullable|string|max:50',
                'numero_piece' => 'nullable|string|max:50',
            ]);

            $client->update($validated);
            return response()->json([
                'message' => 'Client mis à jour avec succès',
                'data' => $client
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erreur ClientController@update: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $client = Client::find($id);
            if (!$client) {
                return response()->json(['error' => 'Client non trouvé'], 404);
            }

            // Vérifier si le client est lié à des transferts
            $hasTransfers = Transfert::where('expediteur_id', $id)
                ->orWhere('beneficiaire_id', $id)
                ->exists();

            if ($hasTransfers) {
                return response()->json([
                    'message' => 'Ce client ne peut pas être supprimé car il est lié à des transferts.',
                    'code' => 'CLIENT_HAS_TRANSFERS'
                ], 422);
            }

            $client->delete();
            return response()->json([
                'message' => 'Client supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur ClientController@destroy: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function byTelephone($telephone)
    {
        try {
            $client = Client::where('telephone', $telephone)->first();
            if (!$client) {
                return response()->json(['error' => 'Client introuvable'], 404);
            }
            return response()->json($client);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
