<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FraisHistorique extends Model
{
    protected $table = 'frais_historique';

    protected $fillable = [
        'frais_configuration_id', 'transfert_id',
        'montant_initial', 'montant_frais', 'type_frais'
    ];

    protected $casts = [
        'montant_initial' => 'decimal:2',
        'montant_frais' => 'decimal:2',
    ];
}
