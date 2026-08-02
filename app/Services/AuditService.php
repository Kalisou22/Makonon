<?php
namespace App\Services;
use App\Models\AuditLog;

class AuditService
{
    public function logTransfertCreation($transfert)
    {
        return AuditLog::create([
            'action' => 'transfert_cree',
            'entite' => 'transfert',
            'entite_id' => $transfert->id,
        ]);
    }
    
    public function logTransfertRetrait($transfert)
    {
        return AuditLog::create([
            'action' => 'transfert_retire',
            'entite' => 'transfert',
            'entite_id' => $transfert->id,
        ]);
    }
    
    public function logTransfertAnnulation($transfert, $motif)
    {
        return AuditLog::create([
            'action' => 'transfert_annule',
            'entite' => 'transfert',
            'entite_id' => $transfert->id,
        ]);
    }
}
