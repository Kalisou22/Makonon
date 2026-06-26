<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MouvementCaisse extends Model
{
    protected $fillable = [
        'caisse_id',
        'type',
        'motif',
        'montant',
        'reference',
        'utilisateur_id'
    ];

    public function caisse()
    {
        return $this->belongsTo(Caisse::class);
    }

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }
}
