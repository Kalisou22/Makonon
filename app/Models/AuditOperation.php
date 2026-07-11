<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditOperation extends Model
{
    protected $table = 'audit_operations';

    protected $fillable = [
        'operation',
        'transfert_code',
        'utilisateur_id',
        'agence_id',
        'montant',
        'ancien_statut',
        'nouveau_statut',
        'motif'
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(User::class);
    }

    public function agence()
    {
        return $this->belongsTo(Agence::class);
    }
}
