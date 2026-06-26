<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ledger extends Model
{
    protected $table = 'ledger';
    
    public $timestamps = true;

    protected $fillable = [
        'agence_id',
        'transfert_id',
        'type',
        'nature',
        'montant',
        'solde_avant',
        'solde_apres',
        'utilisateur_id',
        'reference',
        'description'
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'solde_avant' => 'decimal:2',
        'solde_apres' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function agence()
    {
        return $this->belongsTo(Agence::class);
    }

    public function transfert()
    {
        return $this->belongsTo(Transfert::class, 'transfert_id');
    }

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function scopeCredit($query)
    {
        return $query->where('type', 'CREDIT');
    }

    public function scopeDebit($query)
    {
        return $query->where('type', 'DEBIT');
    }

    public function scopePourAgence($query, int $agenceId)
    {
        return $query->where('agence_id', $agenceId);
    }
}
