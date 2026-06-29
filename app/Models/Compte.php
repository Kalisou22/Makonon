<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Compte extends Model
{
    protected $table = 'comptes';
    
    protected $fillable = [
        'agence_id', 'code', 'nom', 'type', 
        'solde_cache', 'actif'
    ];

    protected $casts = [
        'solde_cache' => 'decimal:2',
        'actif' => 'boolean',
    ];

    public function agence()
    {
        return $this->belongsTo(Agence::class);
    }

    public function ledger()
    {
        return $this->hasMany(Ledger::class);
    }

    // Scopes
    public function scopePrincipal($query)
    {
        return $query->where('type', 'PRINCIPAL');
    }

    public function scopeSystem($query)
    {
        return $query->where('code', 'SYSTEM');
    }

    public function scopeFrais($query)
    {
        return $query->where('code', 'FRAIS');
    }
}
