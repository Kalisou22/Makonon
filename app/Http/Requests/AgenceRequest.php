<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AgenceRequest extends FormRequest
{
    public function authorize() { return true; }
    public function rules() { return [
        'code' => 'required|string|max:20|unique:agences,code,' . $this->route('agence'),
        'nom' => 'required|string|max:100'
    ]; }
}
