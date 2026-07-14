<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AuditController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $perPage = (int) $request->input('per_page', 20);
            $action = $request->input('action');
            $dateDebut = $request->input('date_debut');
            $dateFin = $request->input('date_fin');

            $query = AuditLog::with(['utilisateur']);

            if ($action) {
                $query->where('action', $action);
            }

            if ($dateDebut) {
                $query->where('created_at', '>=', $dateDebut);
            }
            if ($dateFin) {
                $query->where('created_at', '<=', $dateFin);
            }

            if ($user->role !== 'SUPERADMIN' && $user->agence_id) {
                $query->whereHas('utilisateur', function ($q) use ($user) {
                    $q->where('agence_id', $user->agence_id);
                });
            }

            $logs = $query->orderBy('created_at', 'desc')->paginate($perPage);

            $data = $logs->map(function ($log) {
                return [
                    'id' => $log->id,
                    'user_id' => $log->utilisateur_id,
                    'user_name' => $log->utilisateur?->nom ?? 'Système',
                    'user_role' => $log->utilisateur?->role ?? 'SYSTEME',
                    'action' => $log->action,
                    'action_label' => $this->getActionLabel($log->action),
                    'entite' => $log->entite,
                    'entite_id' => $log->entite_id,
                    'description' => $this->getActionDescription($log),
                    'old_data' => $log->old_data,
                    'new_data' => $log->new_data,
                    'ip_address' => $log->ip ?? '127.0.0.1',
                    'created_at' => $log->created_at,
                ];
            });

            return response()->json([
                'data' => $data,
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ]);
        } catch (\Exception $e) {
            Log::error('AuditController@index: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $log = AuditLog::with('utilisateur')->findOrFail($id);
            return response()->json(['data' => $log]);
        } catch (\Exception $e) {
            Log::error('AuditController@show: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function actions()
    {
        try {
            $actions = AuditLog::distinct('action')->pluck('action')->toArray();
            $actionsWithLabels = [];
            foreach ($actions as $action) {
                $actionsWithLabels[] = [
                    'value' => $action,
                    'label' => $this->getActionLabel($action)
                ];
            }
            return response()->json($actionsWithLabels);
        } catch (\Exception $e) {
            Log::error('AuditController@actions: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function getActionLabel(string $action): string
    {
        $map = [
            'login' => 'Connexion',
            'logout' => 'Déconnexion',
            'transfert_cree' => 'Création transfert',
            'transfert_retire' => 'Retrait transfert',
            'transfert_annule' => 'Annulation transfert',
            'client_cree' => 'Création client',
            'client_modifie' => 'Modification client',
            'client_supprime' => 'Suppression client',
            'agence_cree' => 'Création agence',
            'agence_modifie' => 'Modification agence',
            'agence_supprime' => 'Suppression agence',
            'utilisateur_cree' => 'Création utilisateur',
            'utilisateur_modifie' => 'Modification utilisateur',
            'utilisateur_supprime' => 'Suppression utilisateur',
            'caisse_entree' => 'Entrée caisse',
            'caisse_sortie' => 'Sortie caisse',
            'transfert_creation' => 'Création transfert',
            'transfert_retrait' => 'Retrait transfert',
            'transfert_annulation' => 'Annulation transfert',
        ];
        return $map[$action] ?? $action;
    }

    private function getActionDescription(AuditLog $log): string
    {
        $base = $this->getActionLabel($log->action);
        $entite = $log->entite ?? '';
        $id = $log->entite_id ?? '';

        if ($log->action === 'login') {
            return "Connexion de l'utilisateur";
        }
        if ($log->action === 'logout') {
            return "Déconnexion de l'utilisateur";
        }
        if (str_contains($log->action, 'transfert')) {
            $code = $log->new_data['code'] ?? $log->old_data['code'] ?? '';
            return "$base #$id" . ($code ? " - $code" : '');
        }
        if ($log->entite) {
            return "$base - $entite #$id";
        }
        return $base;
    }
}
