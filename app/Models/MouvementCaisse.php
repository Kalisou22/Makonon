<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MouvementCaisse extends Model
{
    protected $table = 'mouvements_caisse';

    protected $fillable = [
        'caisse_id',
        'type',
        'motif',
        'montant',
        'reference',
        'utilisateur_id',
        'transfert_id'
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function caisse()
    {
        return $this->belongsTo(Caisse::class);
    }

    public function utilisateur()
    {
        return $this->belongsTo(User::class);
    }

    public function transfert()
    {
        return $this->belongsTo(Transfert::class);
    }
}
