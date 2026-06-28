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

Route::get('/health', function() {
    return response()->json(['status' => 'ok', 'message' => 'API Makonon Transfert']);
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
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

    Route::middleware('role:SUPERADMIN,ADMIN')->group(function () {
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
    });

    Route::get('/statistiques/dashboard', [StatistiqueController::class, 'dashboard']);
});

Route::get('/test', function() {
    return response()->json(['message' => 'Test OK']);
});
