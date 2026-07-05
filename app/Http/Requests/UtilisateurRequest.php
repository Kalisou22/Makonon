<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UtilisateurRequest extends FormRequest
{
    public function authorize() 
    { 
        return true; 
    }
    
    public function rules() 
    { 
        return [
            'nom' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:utilisateurs,email,' . $this->route('utilisateur'),
            'password' => 'required_if:!id|string|min:6',
            'role' => 'required|in:SUPERADMIN,ADMIN,RESPONSABLE,AGENT',
            'agence_id' => 'nullable|exists:agences,id',
            'telephone' => 'nullable|string|max:30',
            'actif' => 'boolean',
        ]; 
    }
    
    public function messages()
    {
        return [
            'nom.required' => 'Le nom est requis',
            'email.required' => 'L\'email est requis',
            'email.email' => 'Email invalide',
            'email.unique' => 'Cet email est déjà utilisé',
            'password.required_if' => 'Le mot de passe est requis',
            'role.required' => 'Le rôle est requis',
            'role.in' => 'Rôle invalide',
            'agence_id.exists' => 'Agence non trouvée',
        ];
    }
}
