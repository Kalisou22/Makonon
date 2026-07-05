<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransfertRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'nom_expediteur' => 'required|string|max:255',
            'telephone_expediteur' => 'required|string|max:30',
            'nom_beneficiaire' => 'required|string|max:255',
            'telephone_beneficiaire' => 'required|string|max:30',
            'montant' => 'required|numeric|min:100|max:999999999.99',
            'agence_envoi_id' => 'required|exists:agences,id',
            'agence_destinataire_id' => 'required|exists:agences,id|different:agence_envoi_id',
            'idempotency_key' => 'required|string|max:100|unique:transferts,idempotency_key',
        ];
    }

    public function messages(): array
    {
        return [
            'nom_expediteur.required' => 'Le nom de l\'expéditeur est requis',
            'telephone_expediteur.required' => 'Le téléphone de l\'expéditeur est requis',
            'nom_beneficiaire.required' => 'Le nom du bénéficiaire est requis',
            'telephone_beneficiaire.required' => 'Le téléphone du bénéficiaire est requis',
            'montant.required' => 'Le montant est requis',
            'montant.min' => 'Le montant minimum est de 100 GNF',
            'montant.max' => 'Le montant maximum est de 999,999,999.99 GNF',
            'agence_envoi_id.required' => 'L\'agence d\'envoi est requise',
            'agence_envoi_id.exists' => 'Agence d\'envoi non trouvée',
            'agence_destinataire_id.required' => 'L\'agence destinataire est requise',
            'agence_destinataire_id.exists' => 'Agence destinataire non trouvée',
            'agence_destinataire_id.different' => 'Les agences doivent être différentes',
            'idempotency_key.required' => 'Clé d\'idempotence requise',
            'idempotency_key.unique' => 'Cette opération a déjà été effectuée',
        ];
    }
}
