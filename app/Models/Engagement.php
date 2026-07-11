<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Engagement extends Model
{
    protected $table = 'engagements';

    protected $fillable = [
        'transfert_id',
        'agence_id',
        'montant',
        'statut'
    ];

    protected $casts = [
        'montant' => 'decimal:2',
    ];

    public function transfert()
    {
        return $this->belongsTo(Transfert::class);
    }

    public function agence()
    {
        return $this->belongsTo(Agence::class);
    }

    public function scopeEngage($query)
    {
        return $query->where('statut', 'ENGAGE');
    }
}
