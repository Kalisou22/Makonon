<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = ['nom', 'telephone', 'email', 'piece_identite', 'numero_piece'];
    
    public function transfertsExpedites() { return $this->hasMany(Transfert::class, 'expediteur_id'); }
}
