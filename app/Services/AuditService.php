<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Request;

class AuditService
{
    public function log(string $action, string $entite, ?int $entiteId, ?array $oldData = null, ?array $newData = null): AuditLog
    {
        return AuditLog::create([
            'utilisateur_id' => auth()->id() ?? null,
            'action' => $action,
            'entite' => $entite,
            'entite_id' => $entiteId,
            'old_data' => $oldData,
            'new_data' => $newData,
            'ip' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    public function logTransfertCreation($transfert): AuditLog
    {
        return $this->log('transfert_cree', 'transfert', $transfert->id, null, $transfert->toArray());
    }

    public function logTransfertRetrait($transfert): AuditLog
    {
        return $this->log('transfert_retire', 'transfert', $transfert->id, $transfert->getOriginal(), $transfert->toArray());
    }

    public function logTransfertAnnulation($transfert, string $motif): AuditLog
    {
        $data = $transfert->toArray();
        $data['motif_annulation'] = $motif;
        return $this->log('transfert_annule', 'transfert', $transfert->id, $transfert->getOriginal(), $data);
    }
}
