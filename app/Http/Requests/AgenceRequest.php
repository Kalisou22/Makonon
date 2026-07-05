<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AgenceRequest extends FormRequest
{
    public function authorize() 
    { 
        return true; 
    }
    
    public function rules() 
    { 
        return [
            'code' => 'required|string|max:20|unique:agences,code,' . $this->route('agence'),
            'nom' => 'required|string|max:100',
            'adresse' => 'nullable|string',
            'telephone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:100',
            'responsable' => 'nullable|string|max:100',
            'devise' => 'nullable|string|max:10',
            'actif' => 'boolean',
        ]; 
    }
    
    public function messages()
    {
        return [
            'code.required' => 'Le code est requis',
            'code.unique' => 'Ce code est déjà utilisé',
            'nom.required' => 'Le nom est requis',
            'email.email' => 'Email invalide',
        ];
    }
}
