<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FraisConfiguration extends Model
{
    protected $table = 'frais_configurations';

    protected $fillable = [
        'nom', 'description', 'type', 'valeur',
        'seuil_min', 'seuil_max', 'actif',
        'date_debut', 'date_fin', 'created_by'
    ];

    protected $casts = [
        'valeur' => 'decimal:2',
        'seuil_min' => 'decimal:2',
        'seuil_max' => 'decimal:2',
        'actif' => 'boolean',
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
    ];

    public function isActive()
    {
        $now = now();
        return $this->actif && $this->date_debut <= $now && ($this->date_fin === null || $this->date_fin >= $now);
    }
}
