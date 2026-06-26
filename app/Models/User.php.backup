<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'agence_id',
        'role',
        'telephone',
        'actif'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'actif' => 'boolean',
        ];
    }

    public function agence()
    {
        return $this->belongsTo(Agence::class);
    }

    public function transfertsEmis()
    {
        return $this->hasMany(Transfert::class, 'utilisateur_id');
    }

    public function ledgers()
    {
        return $this->hasMany(Ledger::class, 'utilisateur_id');
    }

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
