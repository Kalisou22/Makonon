<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // 🔥 CRITIQUE: Utiliser la table existante 'utilisateurs'
    protected $table = 'utilisateurs';

    protected $fillable = [
        'nom',        // au lieu de 'name'
        'email',
        'password_hash', // au lieu de 'password'
        'agence_id',
        'role',
        'telephone',
        'actif'
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected $casts = [
        'actif' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ============================================================
    // ACCESSORS & MUTATORS
    // ============================================================
    
    // Laravel attend 'password' mais nous avons 'password_hash'
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    // Pour compatibilité avec le nom
    public function getNameAttribute()
    {
        return $this->nom;
    }

    // ============================================================
    // RELATIONS
    // ============================================================
    
    public function agence()
    {
        return $this->belongsTo(Agence::class);
    }

    public function transfertsEmis()
    {
        return $this->hasMany(Transfert::class, 'utilisateur_envoi_id');
    }

    public function transfertsRetires()
    {
        return $this->hasMany(Transfert::class, 'utilisateur_retrait_id');
    }

    public function ledgers()
    {
        return $this->hasMany(Ledger::class, 'utilisateur_id');
    }

    // ============================================================
    // MÉTHODES UTILES
    // ============================================================
    
    public function isAdmin(): bool
    {
        return in_array($this->role, ['SUPERADMIN', 'ADMIN']);
    }

    public function isAgent(): bool
    {
        return $this->role === 'AGENT';
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }
}
