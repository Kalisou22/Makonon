<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TransfertController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\CaisseController;
use App\Http\Controllers\Api\AgenceController;
use App\Http\Controllers\Api\UtilisateurController;
use App\Http\Controllers\Api\StatistiqueController;
use App\Http\Controllers\Api\LedgerController;
use App\Http\Controllers\Api\MouvementCaisseController;

Route::get('/health', function() {
    return response()->json(['status' => 'ok', 'message' => 'API Makonon Transfert']);
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/transferts', [TransfertController::class, 'creer']);
    Route::put('/transferts/retirer/{code}', [TransfertController::class, 'retirer']);
    Route::put('/transferts/annuler/{code}', [TransfertController::class, 'annuler']);
    Route::get('/transferts/verifier/{code}', [TransfertController::class, 'verifier']);
    Route::get('/transferts', [TransfertController::class, 'index']);
    Route::get('/transferts/solde-agence', [TransfertController::class, 'soldeAgence']);

    Route::get('/ledger', [LedgerController::class, 'index']);
    Route::get('/ledger/agence/{agenceId}', [LedgerController::class, 'byAgence']);

    Route::get('/clients', [ClientController::class, 'index']);
    Route::post('/clients', [ClientController::class, 'store']);
    Route::get('/clients/{client}', [ClientController::class, 'show']);
    Route::put('/clients/{client}', [ClientController::class, 'update']);
    Route::delete('/clients/{client}', [ClientController::class, 'destroy']);
    Route::get('/clients/telephone/{telephone}', [ClientController::class, 'byTelephone']);

    Route::get('/caisses', [CaisseController::class, 'index']);
    Route::get('/caisses/{caisse}', [CaisseController::class, 'show']);
    Route::get('/caisses/{caisse}/solde', [CaisseController::class, 'solde']);
    Route::post('/caisses/entree', [CaisseController::class, 'entree']);
    Route::post('/caisses/sortie', [CaisseController::class, 'sortie']);

    Route::get('/mouvements-caisse', [MouvementCaisseController::class, 'index']);
    Route::post('/mouvements-caisse', [MouvementCaisseController::class, 'store']);
    Route::delete('/mouvements-caisse/{id}', [MouvementCaisseController::class, 'destroy']);
    Route::get('/mouvements-caisse/solde', [MouvementCaisseController::class, 'solde']);

    Route::get('/agences', [AgenceController::class, 'index']);
    Route::post('/agences', [AgenceController::class, 'store']);
    Route::get('/agences/{agence}', [AgenceController::class, 'show']);
    Route::put('/agences/{agence}', [AgenceController::class, 'update']);
    Route::delete('/agences/{agence}', [AgenceController::class, 'destroy']);

    Route::get('/utilisateurs', [UtilisateurController::class, 'index']);
    Route::post('/utilisateurs', [UtilisateurController::class, 'store']);
    Route::get('/utilisateurs/{utilisateur}', [UtilisateurController::class, 'show']);
    Route::put('/utilisateurs/{utilisateur}', [UtilisateurController::class, 'update']);
    Route::delete('/utilisateurs/{utilisateur}', [UtilisateurController::class, 'destroy']);

    Route::get('/statistiques/dashboard', [StatistiqueController::class, 'dashboard']);
});

// ✅ Route pour l'audit
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/audit-logs', [App\Http\Controllers\Api\AuditController::class, 'index']);
});

// ✅ Route pour les statistiques du dashboard
Route::middleware(['auth:sanctum'])->get('/statistiques/dashboard', [App\Http\Controllers\Api\StatistiqueController::class, 'dashboard']);

// ============================================
// ROUTES FRAIS
// ============================================
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/frais/configuration-actuelle', [App\Http\Controllers\Api\FraisController::class, 'configurationActuelle']);
    Route::get('/frais/historique', [App\Http\Controllers\Api\FraisController::class, 'historique']);
    Route::post('/frais/calculer', [App\Http\Controllers\Api\FraisController::class, 'calculer']);
    Route::post('/frais/configurations', [App\Http\Controllers\Api\FraisController::class, 'store']);
    Route::put('/frais/configurations/{id}/desactiver', [App\Http\Controllers\Api\FraisController::class, 'desactiver']);
});

// ============================================
// ROUTES FRAIS
// ============================================
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/frais/configuration-actuelle', [App\Http\Controllers\Api\FraisController::class, 'configurationActuelle']);
    Route::get('/frais/historique', [App\Http\Controllers\Api\FraisController::class, 'historique']);
    Route::post('/frais/calculer', [App\Http\Controllers\Api\FraisController::class, 'calculer']);
    Route::post('/frais/configurations', [App\Http\Controllers\Api\FraisController::class, 'store']);
    Route::put('/frais/configurations/{id}/desactiver', [App\Http\Controllers\Api\FraisController::class, 'desactiver']);
});

// ============================================
// ROUTES AUDIT
// ============================================
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/audit-logs', [App\Http\Controllers\Api\AuditController::class, 'index']);
    Route::get('/audit-logs/{id}', [App\Http\Controllers\Api\AuditController::class, 'show']);
    Route::get('/audit-actions', [App\Http\Controllers\Api\AuditController::class, 'actions']);
});

// ============================================
// ROUTES AUDIT
// ============================================
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/audit-logs', [App\Http\Controllers\Api\AuditController::class, 'index']);
    Route::get('/audit-logs/{id}', [App\Http\Controllers\Api\AuditController::class, 'show']);
    Route::get('/audit-actions', [App\Http\Controllers\Api\AuditController::class, 'actions']);
});

// ✅ Route de vérification de code (accessible pour les agents)
Route::middleware(['auth:sanctum'])->get('/transferts/verifier/{code}', [App\Http\Controllers\Api\TransfertController::class, 'verifier']);

// ✅ Route de vérification de code
Route::middleware(['auth:sanctum'])->get('/transferts/verifier/{code}', [App\Http\Controllers\Api\TransfertController::class, 'verifier']);

// ✅ Route de vérification de code
Route::middleware(['auth:sanctum'])->get('/transferts/verifier/{code}', [App\Http\Controllers\Api\TransfertController::class, 'verifier']);

// ✅ Route de vérification de code
Route::middleware(['auth:sanctum'])->get('/transferts/verifier/{code}', [App\Http\Controllers\Api\TransfertController::class, 'verifier']);

// ✅ Route pour les soldes (cash / dette / frais)
Route::middleware(['auth:sanctum'])->get('/agences/soldes/{agenceId}', function ($agenceId) {
    $service = app(\App\Services\MouvementService::class);
    return response()->json($service->getSoldes($agenceId));
});
