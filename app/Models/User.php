<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'utilisateurs';

    protected $fillable = [
        'nom',
        'email',
        'password_hash',
        'role',
        'agence_id',
        'actif',
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

    // Laravel attend 'password' pour l'authentification
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function agence()
    {
        return $this->belongsTo(Agence::class);
    }

    public function transferts()
    {
        return $this->hasMany(Transfert::class, 'utilisateur_envoi_id');
    }

    public function transfertsRetires()
    {
        return $this->hasMany(Transfert::class, 'utilisateur_retrait_id');
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['SUPERADMIN', 'ADMIN']);
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }
}
