<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CaisseRequest extends FormRequest
{
    public function authorize() 
    { 
        return true; 
    }
    
    public function rules() 
    { 
        return [
            'caisse_id' => 'required|exists:caisses,id',
            'montant' => 'required|numeric|min:1',
            'motif' => 'required|in:ENVOI,RETRAIT,DEPOT,AJUSTEMENT',
            'reference' => 'nullable|string|max:50',
        ]; 
    }
    
    public function messages()
    {
        return [
            'caisse_id.required' => 'La caisse est requise',
            'caisse_id.exists' => 'Caisse non trouvée',
            'montant.required' => 'Le montant est requis',
            'montant.min' => 'Le montant doit être positif',
            'motif.required' => 'Le motif est requis',
            'motif.in' => 'Motif invalide',
        ];
    }
}
