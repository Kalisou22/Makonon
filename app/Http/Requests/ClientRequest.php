<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClientRequest extends FormRequest
{
    public function authorize() 
    { 
        return true; 
    }
    
    public function rules() 
    { 
        return [
            'nom' => 'required|string|max:100',
            'telephone' => 'required|string|max:30|unique:clients,telephone,' . $this->route('client'),
            'email' => 'nullable|email|max:100',
            'piece_identite' => 'nullable|string|max:50',
            'numero_piece' => 'nullable|string|max:50',
        ]; 
    }
    
    public function messages()
    {
        return [
            'nom.required' => 'Le nom est requis',
            'telephone.required' => 'Le téléphone est requis',
            'telephone.unique' => 'Ce téléphone est déjà utilisé',
            'email.email' => 'Email invalide',
        ];
    }
}
