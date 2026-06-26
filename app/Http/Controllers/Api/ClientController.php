<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClientRequest;
use App\Models\Client;

class ClientController extends Controller
{
    public function index()
    {
        return response()->json(Client::all());
    }
    
    public function store(ClientRequest $request)
    {
        $client = Client::create($request->validated());
        return response()->json($client, 201);
    }
    
    public function show(Client $client)
    {
        return response()->json($client);
    }
    
    public function update(ClientRequest $request, Client $client)
    {
        $client->update($request->validated());
        return response()->json($client);
    }
    
    public function destroy(Client $client)
    {
        $client->delete();
        return response()->json(['message' => 'Client supprimé']);
    }
    
    public function byTelephone(string $telephone)
    {
        $client = Client::where('telephone', $telephone)->first();
        if (!$client) {
            return response()->json(['error' => 'Client introuvable'], 404);
        }
        return response()->json($client);
    }
}
