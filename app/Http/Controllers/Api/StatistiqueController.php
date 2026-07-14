<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transfert;
use App\Models\Client;
use App\Models\Agence;
use App\Models\User;
use App\Models\Caisse;
use App\Services\LedgerService;
use App\Services\EngagementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StatistiqueController extends Controller
{
    protected LedgerService $ledgerService;
    protected EngagementService $engagementService;

    public function __construct(
        LedgerService $ledgerService,
        EngagementService $engagementService
    ) {
        $this->ledgerService = $ledgerService;
        $this->engagementService = $engagementService;
    }

    public function dashboard(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'Utilisateur non authentifié'], 401);
            }

            if (in_array($user->role, ['SUPERADMIN', 'ADMIN'])) {
                return $this->getStatsGlobal();
            }

            $agenceId = $user->agence_id;
            if (!$agenceId) {
                return response()->json(['error' => 'Utilisateur non rattaché à une agence'], 400);
            }

            return $this->getStatsByAgence($agenceId);
        } catch (\Exception $e) {
            Log::error('StatistiqueController@dashboard: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function getStatsGlobal()
    {
        $agences = Agence::whereNotIn('code', ['SYSTEM', 'FRAIS', 'CAISSE'])->get();
        $agenceIds = $agences->pluck('id')->toArray();

        $soldeTotal = 0;
        $soldeCaisseTotal = 0;
        $engagementTotal = 0;
        foreach ($agenceIds as $id) {
            $soldeTotal += $this->ledgerService->getSolde($id);
            $caisse = Caisse::where('agence_id', $id)->first();
            $soldeCaisseTotal += $caisse ? $caisse->solde_physique : 0;
            $engagementTotal += $this->engagementService->getSoldeEngage($id);
        }

        $today = now()->toDateString();
        $totalTransferts = Transfert::count();
        $transfertsJour = Transfert::whereDate('created_at', $today)->count();
        $volumeJournalier = Transfert::whereDate('created_at', $today)->sum('montant');

        $enAttente = Transfert::where('statut', 'ENVOYE')->count();
        $montantEnAttente = Transfert::where('statut', 'ENVOYE')->sum('montant');

        $recentActivities = Transfert::with(['expediteur', 'beneficiaire', 'agenceEnvoi', 'agenceRetrait'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'type' => 'transfert',
                    'description' => "Transfert #{$t->code} - {$t->montant} GNF",
                    'user' => $t->utilisateurEnvoi?->nom ?? 'Système',
                    'date' => $t->created_at->toISOString(),
                    'statut' => $t->statut,
                ];
            });

        return response()->json([
            'total_transferts' => $totalTransferts,
            'total_clients' => Client::count(),
            'total_agences' => count($agenceIds),
            'total_utilisateurs' => User::count(),
            'solde_total' => $soldeTotal,
            'solde_agence' => $soldeTotal,
            'solde_caisse_total' => $soldeCaisseTotal,
            'engagement_total' => $engagementTotal,
            'transferts_jour' => $transfertsJour,
            'volume_journalier' => (float) $volumeJournalier,
            'transferts_en_attente' => $enAttente,
            'montant_en_attente' => (float) $montantEnAttente,
            'recent_activities' => $recentActivities,
            'agences_actives' => Agence::where('actif', 1)->whereNotIn('code', ['SYSTEM', 'FRAIS', 'CAISSE'])->count(),
            'retraits_en_attente' => $enAttente,
        ]);
    }

    private function getStatsByAgence(int $agenceId)
    {
        $agence = Agence::find($agenceId);
        if (!$agence) {
            return response()->json(['error' => 'Agence non trouvée'], 404);
        }

        $solde = $this->ledgerService->getSolde($agenceId);
        $caisse = Caisse::where('agence_id', $agenceId)->first();
        $soldeCaisse = $caisse ? $caisse->solde_physique : 0;
        $engagement = $this->engagementService->getSoldeEngage($agenceId);

        $transferts = Transfert::where('agence_envoi_id', $agenceId)
            ->orWhere('agence_retrait_id', $agenceId);

        $today = now()->toDateString();
        $totalTransferts = $transferts->count();
        $transfertsJour = $transferts->whereDate('created_at', $today)->count();
        $volumeJournalier = $transferts->whereDate('created_at', $today)->sum('montant');

        $enAttente = Transfert::where('statut', 'ENVOYE')
            ->where('agence_retrait_id', $agenceId)
            ->count();
        $montantEnAttente = Transfert::where('statut', 'ENVOYE')
            ->where('agence_retrait_id', $agenceId)
            ->sum('montant');

        $recentActivities = Transfert::where('agence_envoi_id', $agenceId)
            ->orWhere('agence_retrait_id', $agenceId)
            ->with(['expediteur', 'beneficiaire', 'agenceEnvoi', 'agenceRetrait'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'type' => 'transfert',
                    'description' => "Transfert #{$t->code} - {$t->montant} GNF",
                    'user' => $t->utilisateurEnvoi?->nom ?? 'Système',
                    'date' => $t->created_at->toISOString(),
                    'statut' => $t->statut,
                ];
            });

        return response()->json([
            'total_transferts' => $totalTransferts,
            'total_clients' => Client::count(),
            'total_agences' => 1,
            'total_utilisateurs' => User::where('agence_id', $agenceId)->count(),
            'solde_agence' => $solde,
            'solde_total' => $solde,
            'solde_caisse' => $soldeCaisse,
            'engagement' => $engagement,
            'transferts_jour' => $transfertsJour,
            'volume_journalier' => (float) $volumeJournalier,
            'transferts_en_attente' => $enAttente,
            'montant_en_attente' => (float) $montantEnAttente,
            'recent_activities' => $recentActivities,
            'agences_actives' => 1,
            'retraits_en_attente' => $enAttente,
            'nom_agence' => $agence->nom,
            'code_agence' => $agence->code,
        ]);
    }
}
