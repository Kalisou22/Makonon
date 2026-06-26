<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ledger extends Model
{
    public $timestamps = false;
    protected $table = 'ledger';
    protected $fillable = [
        'agence_id',
        'transfert_id',
        'type',
        'nature',
        'montant',
        'solde_avant',
        'solde_apres',
        'utilisateur_id'
    ];

    public function agence()
    {
        return $this->belongsTo(Agence::class);
    }

    public function transfert()
    {
        return $this->belongsTo(Transfert::class);
    }

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }
}
