<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransfertRequest extends FormRequest
{
    public function authorize() { return true; }
    public function rules() { return [
        'montant' => 'required|numeric|min:100',
        'nom_expediteur' => 'required|string|max:100',
        'telephone_expediteur' => 'required|string|max:30',
        'nom_beneficiaire' => 'required|string|max:100',
        'telephone_beneficiaire' => 'required|string|max:30',
        'agence_envoi_id' => 'required|exists:agences,id',
        'agence_retrait_id' => 'nullable|exists:agences,id'
    ]; }
}
