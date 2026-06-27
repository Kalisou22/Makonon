<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Transfert extends Model
{
    protected $fillable = [
        'code',  // 🔥 AJOUT OBLIGATOIRE
        'expediteur_id',
        'beneficiaire_id',
        'agence_envoi_id',
        'agence_retrait_id',
        'utilisateur_envoi_id',
        'utilisateur_retrait_id',
        'utilisateur_annulation_id',
        'montant',
        'frais',
        'commission',
        'statut',
        'date_envoi',
        'date_retrait',
        'date_annulation',
        'motif_annulation'
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'frais' => 'decimal:2',
        'commission' => 'decimal:2',
        'date_envoi' => 'datetime',
        'date_retrait' => 'datetime',
        'date_annulation' => 'datetime',
    ];

    // ============================================================
    // GÉNÉRATEUR DE CODE
    // ============================================================
    
    public static function generateCode(): string
    {
        do {
            $code = 'TRF' . date('Ymd') . strtoupper(Str::random(6));
        } while (self::where('code', $code)->exists());
        return $code;
    }

    // ============================================================
    // RELATIONS
    // ============================================================
    
    public function expediteur()
    {
        return $this->belongsTo(Client::class, 'expediteur_id');
    }

    public function beneficiaire()
    {
        return $this->belongsTo(Client::class, 'beneficiaire_id');
    }

    public function agenceEnvoi()
    {
        return $this->belongsTo(Agence::class, 'agence_envoi_id');
    }

    public function agenceRetrait()
    {
        return $this->belongsTo(Agence::class, 'agence_retrait_id');
    }

    public function utilisateurEnvoi()
    {
        return $this->belongsTo(User::class, 'utilisateur_envoi_id');
    }

    public function utilisateurRetrait()
    {
        return $this->belongsTo(User::class, 'utilisateur_retrait_id');
    }

    public function ledger()
    {
        return $this->hasMany(Ledger::class);
    }

    // ============================================================
    // SCOPES
    // ============================================================
    
    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'EN_ATTENTE');
    }

    public function scopeRetire($query)
    {
        return $query->where('statut', 'RETIRE');
    }

    public function scopeParAgence($query, int $agenceId)
    {
        return $query->where(function ($q) use ($agenceId) {
            $q->where('agence_envoi_id', $agenceId)
              ->orWhere('agence_retrait_id', $agenceId);
        });
    }
}
