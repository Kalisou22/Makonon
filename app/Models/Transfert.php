<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Transfert extends Model
{
    protected $fillable = [
        'code_transfert',
        'client_id',
        'expediteur_id',
        'beneficiaire_id',
        'agence_emetteur_id',
        'agence_destinataire_id',
        'agence_envoi_id',
        'agence_retrait_id',
        'utilisateur_id',
        'utilisateur_envoi_id',
        'utilisateur_retrait_id',
        'utilisateur_annulation_id',
        'montant',
        'frais',
        'commission',
        'total',
        'telephone_destinataire',
        'nom_destinataire',
        'statut',
        'date_emission',
        'date_envoi',
        'date_retrait',
        'date_annulation',
        'motif_annulation'
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'frais' => 'decimal:2',
        'commission' => 'decimal:2',
        'total' => 'decimal:2',
        'date_emission' => 'datetime',
        'date_envoi' => 'datetime',
        'date_retrait' => 'datetime',
        'date_annulation' => 'datetime',
    ];

    // ============================================================
    // GENERATEURS
    // ============================================================
    
    public static function generateCode(): string
    {
        do {
            $code = 'TRX-' . date('Y') . '-' . Str::upper(Str::random(4)) . '-' . Str::upper(Str::random(4));
        } while (self::where('code_transfert', $code)->exists());
        return $code;
    }

    // ============================================================
    // RELATIONS
    // ============================================================
    
    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function expediteur()
    {
        return $this->belongsTo(Client::class, 'expediteur_id');
    }

    public function beneficiaire()
    {
        return $this->belongsTo(Client::class, 'beneficiaire_id');
    }

    public function agenceEmetteur()
    {
        return $this->belongsTo(Agence::class, 'agence_emetteur_id');
    }

    public function agenceDestinataire()
    {
        return $this->belongsTo(Agence::class, 'agence_destinataire_id');
    }

    public function agenceEnvoi()
    {
        return $this->belongsTo(Agence::class, 'agence_envoi_id');
    }

    public function agenceRetrait()
    {
        return $this->belongsTo(Agence::class, 'agence_retrait_id');
    }

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function utilisateurEnvoi()
    {
        return $this->belongsTo(User::class, 'utilisateur_envoi_id');
    }

    public function utilisateurRetrait()
    {
        return $this->belongsTo(User::class, 'utilisateur_retrait_id');
    }

    public function utilisateurAnnulation()
    {
        return $this->belongsTo(User::class, 'utilisateur_annulation_id');
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
            $q->where('agence_emetteur_id', $agenceId)
              ->orWhere('agence_destinataire_id', $agenceId);
        });
    }
}
