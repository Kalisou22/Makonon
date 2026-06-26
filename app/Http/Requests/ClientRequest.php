<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClientRequest extends FormRequest
{
    public function authorize() { return true; }
    public function rules() { return [
        'nom' => 'required|string|max:100',
        'telephone' => 'required|string|max:30|unique:clients,telephone,' . $this->route('client'),
        'email' => 'nullable|email|max:100'
    ]; }
}
