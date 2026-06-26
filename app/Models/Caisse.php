<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Caisse extends Model
{
    protected $fillable = ['agence_id', 'solde_physique', 'solde_comptable'];
    
    public function agence() { return $this->belongsTo(Agence::class); }
    public function mouvements() { return $this->hasMany(MouvementCaisse::class); }
}
