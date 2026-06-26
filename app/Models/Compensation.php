<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Compensation extends Model
{
    protected $fillable = [
        'agence_id',
        'montant',
        'type',
        'statut',
        'date_compensation'
    ];

    public function agence()
    {
        return $this->belongsTo(Agence::class);
    }
}
