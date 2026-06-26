<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agence extends Model
{
    protected $fillable = [
        'code', 'nom', 'adresse', 'telephone', 'email', 
        'responsable', 'devise', 'solde_cache', 'actif'
    ];

    protected $casts = [
        'solde_cache' => 'decimal:2',
        'actif' => 'boolean',
    ];

    // ============================================================
    // RELATIONS
    // ============================================================
    
    public function utilisateurs()
    {
        return $this->hasMany(User::class);
    }

    public function transfertsEnvois()
    {
        return $this->hasMany(Transfert::class, 'agence_envoi_id');
    }

    public function transfertsRetraits()
    {
        return $this->hasMany(Transfert::class, 'agence_retrait_id');
    }

    public function ledger()
    {
        return $this->hasMany(Ledger::class);
    }

    public function caisse()
    {
        return $this->hasOne(Caisse::class);
    }
}
