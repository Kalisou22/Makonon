<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize() 
    { 
        return true; 
    }
    
    public function rules() 
    { 
        return [
            'email' => 'required|email',
            'password' => 'required|string|min:6'
        ]; 
    }
    
    public function messages()
    {
        return [
            'email.required' => 'L\'email est requis',
            'email.email' => 'Email invalide',
            'password.required' => 'Le mot de passe est requis',
            'password.min' => 'Le mot de passe doit faire au moins 6 caractères',
        ];
    }
}
