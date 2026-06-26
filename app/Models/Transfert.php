<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Transfert extends Model
{
    protected $fillable = [
        'code', 'expediteur_id', 'beneficiaire_id', 'agence_envoi_id', 'agence_retrait_id',
        'utilisateur_envoi_id', 'utilisateur_retrait_id', 'montant', 'frais', 'commission',
        'statut', 'date_envoi', 'date_retrait'
    ];
    
    protected $casts = ['date_envoi' => 'datetime', 'date_retrait' => 'datetime'];
    
    public static function generateCode(): string
    {
        do {
            $code = 'TRX-' . date('Y') . '-' . Str::upper(Str::random(4)) . '-' . Str::upper(Str::random(4));
        } while (self::where('code', $code)->exists());
        return $code;
    }
    
    public function expediteur() { return $this->belongsTo(Client::class, 'expediteur_id'); }
    public function beneficiaire() { return $this->belongsTo(Client::class, 'beneficiaire_id'); }
    public function agenceEnvoi() { return $this->belongsTo(Agence::class, 'agence_envoi_id'); }
    public function agenceRetrait() { return $this->belongsTo(Agence::class, 'agence_retrait_id'); }
    public function ledger() { return $this->hasMany(Ledger::class); }
}
