<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    protected $fillable = [
        'transfert_id',
        'montant',
        'pourcentage'
    ];

    public function transfert()
    {
        return $this->belongsTo(Transfert::class);
    }
}
