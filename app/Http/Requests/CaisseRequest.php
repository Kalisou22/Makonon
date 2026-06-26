<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CaisseRequest extends FormRequest
{
    public function authorize() { return true; }
    public function rules() { return [
        'caisse_id' => 'required|exists:caisses,id',
        'montant' => 'required|numeric|min:1',
        'motif' => 'required|in:ENVOI,RETRAIT,DEPOT,AJUSTEMENT'
    ]; }
}
