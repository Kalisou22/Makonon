<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transfert;
use App\Models\Ledger;
use App\Models\Client;
use App\Models\Agence;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StatistiqueController extends Controller
{
    public function dashboard(Request $request)
    {
        try {
            $user = $request->user();

            // ✅ SOURCE DE VÉRITÉ = user->role et user->agence_id
            // ✅ Ignorer les headers du frontend

            if ($user->role === 'SUPERADMIN') {
                $stats = [
                    'total_transferts' => Transfert::count(),
                    'transferts_en_attente' => Transfert::where('statut', 'EN_ATTENTE')->count(),
                    'total_clients' => Client::count(),
                    'total_agences' => Agence::whereNotIn('code', ['FRAIS', 'SYSTEM', 'CAISSE'])->count(),
                    'total_utilisateurs' => User::count(),
                    'volume_journalier' => (float) Transfert::whereDate('created_at', now()->toDateString())->sum('montant'),
                    'solde_agence' => (float) Ledger::sum(DB::raw("CASE WHEN type = 'CREDIT' THEN montant ELSE -montant END")),
                    'retraits_en_attente' => 0,
                    'montant_en_attente' => 0,
                ];
                return response()->json($stats);
            }

            // ADMIN, RESPONSABLE, AGENT → filtrer par agence
            $agenceId = $user->agence_id;

            if (!$agenceId) {
                return response()->json([
                    'error' => 'Utilisateur non rattaché à une agence'
                ], 400);
            }

            // Vérifier l'accès à l'agence via le rôle
            if ($user->role === 'AGENT') {
                // AGENT → accès limité
                $stats = [
                    'total_transferts' => Transfert::where('agence_envoi_id', $agenceId)
                        ->orWhere('agence_retrait_id', $agenceId)
                        ->count(),
                    'transferts_en_attente' => Transfert::where('statut', 'EN_ATTENTE')
                        ->where(function($q) use ($agenceId) {
                            $q->where('agence_envoi_id', $agenceId)
                              ->orWhere('agence_retrait_id', $agenceId);
                        })->count(),
                    'total_clients' => 0, // AGENT ne voit pas les clients
                    'total_agences' => 1, // AGENT ne voit que son agence
                    'total_utilisateurs' => 0, // AGENT ne voit pas les utilisateurs
                    'volume_journalier' => (float) Ledger::where('agence_id', $agenceId)
                        ->whereDate('created_at', now()->toDateString())
                        ->sum(DB::raw("CASE WHEN type = 'CREDIT' THEN montant ELSE -montant END")),
                    'solde_agence' => (float) Ledger::where('agence_id', $agenceId)
                        ->sum(DB::raw("CASE WHEN type = 'CREDIT' THEN montant ELSE -montant END")),
                    'retraits_en_attente' => Transfert::where('statut', 'EN_ATTENTE')
                        ->where('agence_retrait_id', $agenceId)
                        ->count(),
                    'montant_en_attente' => (float) Transfert::where('statut', 'EN_ATTENTE')
                        ->where('agence_retrait_id', $agenceId)
                        ->sum('montant'),
                ];
                return response()->json($stats);
            }

            // ADMIN, RESPONSABLE → statistiques complètes de leur agence
            $stats = [
                'total_transferts' => Transfert::where('agence_envoi_id', $agenceId)
                    ->orWhere('agence_retrait_id', $agenceId)
                    ->count(),
                'transferts_en_attente' => Transfert::where('statut', 'EN_ATTENTE')
                    ->where(function($q) use ($agenceId) {
                        $q->where('agence_envoi_id', $agenceId)
                          ->orWhere('agence_retrait_id', $agenceId);
                    })->count(),
                'total_clients' => Client::count(),
                'total_agences' => Agence::whereNotIn('code', ['FRAIS', 'SYSTEM', 'CAISSE'])->count(),
                'total_utilisateurs' => User::count(),
                'volume_journalier' => (float) Ledger::where('agence_id', $agenceId)
                    ->whereDate('created_at', now()->toDateString())
                    ->sum(DB::raw("CASE WHEN type = 'CREDIT' THEN montant ELSE -montant END")),
                'solde_agence' => (float) Ledger::where('agence_id', $agenceId)
                    ->sum(DB::raw("CASE WHEN type = 'CREDIT' THEN montant ELSE -montant END")),
                'retraits_en_attente' => Transfert::where('statut', 'EN_ATTENTE')
                    ->where('agence_retrait_id', $agenceId)
                    ->count(),
                'montant_en_attente' => (float) Transfert::where('statut', 'EN_ATTENTE')
                    ->where('agence_retrait_id', $agenceId)
                    ->sum('montant'),
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            Log::error('Erreur dashboard: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
