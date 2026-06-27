<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Transfert extends Model
{
    protected $table = 'transferts';

    protected $fillable = [
        'code',
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
        'motif_annulation',
        'idempotency_key',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'frais' => 'decimal:2',
        'commission' => 'decimal:2',
        'date_envoi' => 'datetime',
        'date_retrait' => 'datetime',
        'date_annulation' => 'datetime',
    ];

    public static function generateCode(): string
    {
        do {
            $code = 'TRF' . date('Ymd') . strtoupper(Str::random(6));
        } while (self::where('code', $code)->exists());
        return $code;
    }

    public function scopeParCode($query, string $code)
    {
        return $query->where('code', $code);
    }

    public function scopeParStatut($query, string $statut)
    {
        return $query->where('statut', $statut);
    }

    public function scopeParIdempotencyKey($query, string $key)
    {
        return $query->where('idempotency_key', $key);
    }

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

    public function utilisateurAnnulation()
    {
        return $this->belongsTo(User::class, 'utilisateur_annulation_id');
    }

    public function ledger()
    {
        return $this->hasMany(Ledger::class);
    }
}
