<?php
namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Utilisateur extends Authenticatable
{
    use HasApiTokens;
    
    protected $table = 'utilisateurs';
    protected $fillable = ['nom', 'email', 'password_hash', 'role', 'agence_id', 'actif'];
    protected $hidden = ['password_hash'];
    
    public function agence() { return $this->belongsTo(Agence::class); }
    public function transfertsEnvois() { return $this->hasMany(Transfert::class, 'utilisateur_envoi_id'); }
}
