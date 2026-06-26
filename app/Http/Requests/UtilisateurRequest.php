<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UtilisateurRequest extends FormRequest
{
    public function authorize() { return true; }
    public function rules() { return [
        'nom' => 'required|string|max:100',
        'email' => 'required|email|max:100|unique:utilisateurs,email,' . $this->route('utilisateur'),
        'password' => 'required_if:!id|string|min:6',
        'role' => 'required|in:SUPERADMIN,ADMIN,RESPONSABLE,AGENT',
        'agence_id' => 'nullable|exists:agences,id'
    ]; }
}
