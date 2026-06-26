<?php
namespace App\Services;

use App\Models\AuditLog;

class AuditService
{
    public function log(int $utilisateurId, string $action, string $entite, ?int $entiteId, $oldData = null, $newData = null, ?string $ip = null): AuditLog
    {
        return AuditLog::create([
            'utilisateur_id' => $utilisateurId,
            'action' => $action,
            'entite' => $entite,
            'entite_id' => $entiteId,
            'old_data' => $oldData ? json_encode($oldData) : null,
            'new_data' => $newData ? json_encode($newData) : null,
            'ip' => $ip ?? request()->ip()
        ]);
    }
}
