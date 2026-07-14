<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Agence;
use App\Models\Caisse;
use App\Models\Transfert;
use App\Models\Ledger;
use App\Models\Engagement;
use App\Services\TransfertService;
use App\Services\LedgerService;
use App\Services\EngagementService;

echo "==========================================\n";
echo "TEST TRANSFERT MAKONON\n";
echo "==========================================\n\n";

// 1. Récupérer l'utilisateur
$user = User::where('email', 'admin@makonon.com')->first();
if (!$user) {
    die("❌ Utilisateur non trouvé\n");
}
echo "✅ Utilisateur: " . $user->nom . " (" . $user->role . ")\n\n";

// 2. Vérifier les soldes initiaux
$ledger = app(LedgerService::class);
$engagement = app(EngagementService::class);

echo "=== SOLDES INITIAUX ===\n";
foreach (Agence::whereNotIn('code', ['SYSTEM', 'FRAIS', 'CAISSE'])->get() as $agence) {
    $caisse = Caisse::where('agence_id', $agence->id)->first()?->solde_physique ?? 0;
    $soldeLedger = $ledger->getSolde($agence->id);
    $soldeEngage = $engagement->getSoldeEngage($agence->id);
    echo "  " . $agence->code . " (" . $agence->nom . "):\n";
    echo "    💰 Caisse: " . number_format($caisse, 0, ',', ' ') . " GNF\n";
    echo "    📒 Ledger: " . number_format($soldeLedger, 0, ',', ' ') . " GNF\n";
    echo "    🔒 Engagement: " . number_format($soldeEngage, 0, ',', ' ') . " GNF\n";
}
echo "\n";

// 3. Créer un transfert
$service = app(TransfertService::class);
$transfert = $service->creer([
    'nom_expediteur' => 'Jean Dupont',
    'telephone_expediteur' => '620000111',
    'nom_beneficiaire' => 'Marie Diouf',
    'telephone_beneficiaire' => '620000222',
    'montant' => 50000,
    'agence_envoi_id' => 4,
    'agence_destinataire_id' => 5,
    'idempotency_key' => 'test_' . time()
], $user);

echo "✅ Transfert créé !\n";
echo "📌 Code: " . $transfert->code . "\n";
echo "💰 Montant: " . number_format($transfert->montant, 0, ',', ' ') . " GNF\n";
echo "📊 Frais: " . number_format($transfert->frais, 0, ',', ' ') . " GNF\n";
echo "📌 Statut: " . $transfert->statut . "\n";
echo "🔒 Engagement total: " . number_format($transfert->montant + $transfert->frais, 0, ',', ' ') . " GNF\n\n";

// 4. Vérifier les soldes après création
echo "=== SOLDES APRÈS CRÉATION ===\n";
foreach (Agence::whereIn('id', [4, 5])->get() as $agence) {
    $caisse = Caisse::where('agence_id', $agence->id)->first()?->solde_physique ?? 0;
    $soldeLedger = $ledger->getSolde($agence->id);
    $soldeEngage = $engagement->getSoldeEngage($agence->id);
    echo "  " . $agence->code . " (" . $agence->nom . "):\n";
    echo "    💰 Caisse: " . number_format($caisse, 0, ',', ' ') . " GNF\n";
    echo "    📒 Ledger: " . number_format($soldeLedger, 0, ',', ' ') . " GNF\n";
    echo "    🔒 Engagement: " . number_format($soldeEngage, 0, ',', ' ') . " GNF\n";
}
echo "\n";

// 5. Retirer le transfert
$result = $service->retirer($transfert->code, $user);
echo "✅ Retrait effectué !\n";
echo "📌 Code: " . $result->code . "\n";
echo "📌 Statut: " . $result->statut . "\n";
echo "💰 Montant retiré: " . number_format($result->montant, 0, ',', ' ') . " GNF\n\n";

// 6. Vérifier les soldes après retrait
echo "=== SOLDES APRÈS RETRAIT ===\n";
foreach (Agence::whereIn('id', [4, 5])->get() as $agence) {
    $caisse = Caisse::where('agence_id', $agence->id)->first()?->solde_physique ?? 0;
    $soldeLedger = $ledger->getSolde($agence->id);
    $soldeEngage = $engagement->getSoldeEngage($agence->id);
    echo "  " . $agence->code . " (" . $agence->nom . "):\n";
    echo "    💰 Caisse: " . number_format($caisse, 0, ',', ' ') . " GNF\n";
    echo "    📒 Ledger: " . number_format($soldeLedger, 0, ',', ' ') . " GNF\n";
    echo "    🔒 Engagement: " . number_format($soldeEngage, 0, ',', ' ') . " GNF\n";
}
echo "\n";

// 7. Vérifier les écritures ledger du transfert
echo "=== ÉCRITURES LEDGER DU TRANSFERT ===\n";
$ledgerEntries = Ledger::where('transfert_id', $transfert->id)->get();
foreach ($ledgerEntries as $entry) {
    $agence = Agence::find($entry->agence_id);
    echo "  " . $entry->type . " " . $entry->nature . " " . number_format($entry->montant, 0, ',', ' ') . " GNF -> " . ($agence ? $agence->code : 'INCONNU') . "\n";
}
echo "\n";

// 8. Vérification globale
$totalCaisse = Caisse::sum('solde_physique');
$totalLedger = 0;
foreach (Agence::whereNotIn('code', ['SYSTEM', 'FRAIS', 'CAISSE'])->get() as $a) {
    $totalLedger += $ledger->getSolde($a->id);
}

echo "=== 📊 COHÉRENCE FINALE ===\n";
echo "💰 Total Caisse: " . number_format($totalCaisse, 0, ',', ' ') . " GNF\n";
echo "📒 Total Ledger: " . number_format($totalLedger, 0, ',', ' ') . " GNF\n";

if (abs($totalCaisse - $totalLedger) < 1) {
    echo "✅ CAISSE = LEDGER (SYNCHRONISÉ)\n";
} else {
    echo "❌ Écart: " . number_format(abs($totalCaisse - $totalLedger), 0, ',', ' ') . " GNF\n";
}

echo "\n==========================================\n";
echo "FIN DES TESTS\n";
echo "==========================================\n";
