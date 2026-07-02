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
        'nom',
        'email',
        'password',
        'role',
        'agence_id',
        'actif',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'actif' => 'boolean',
    ];

    public function agence()
    {
        return $this->belongsTo(Agence::class);
    }

    public function transferts()
    {
        return $this->hasMany(Transfert::class, 'utilisateur_envoi_id');
    }
}
