<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UtilisateurRequest;
use App\Models\Utilisateur;
use Illuminate\Support\Facades\Hash;

class UtilisateurController extends Controller
{
    public function index()
    {
        return response()->json(Utilisateur::with('agence')->get());
    }
    
    public function store(UtilisateurRequest $request)
    {
        $data = $request->validated();
        $data['password_hash'] = Hash::make($data['password']);
        unset($data['password']);
        
        $utilisateur = Utilisateur::create($data);
        return response()->json($utilisateur, 201);
    }
    
    public function show(Utilisateur $utilisateur)
    {
        return response()->json($utilisateur->load('agence'));
    }
    
    public function update(UtilisateurRequest $request, Utilisateur $utilisateur)
    {
        $data = $request->validated();
        if (isset($data['password'])) {
            $data['password_hash'] = Hash::make($data['password']);
            unset($data['password']);
        }
        $utilisateur->update($data);
        return response()->json($utilisateur);
    }
    
    public function destroy(Utilisateur $utilisateur)
    {
        $utilisateur->delete();
        return response()->json(['message' => 'Utilisateur supprimé']);
    }
}
