<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

echo "==========================================\n";
echo "TEST AUTHENTIFICATION MAKONON API\n";
echo "==========================================\n\n";

$email = 'admin@makonon.com';
$password = 'password123';

// 1. Vérifier l'utilisateur
echo "1. RECHERCHE DE L'UTILISATEUR\n";
echo "------------------------------------------\n";
$user = User::where('email', $email)->first();

if (!$user) {
    die("❌ Utilisateur non trouvé: $email\n");
}

echo "✅ Utilisateur trouvé:\n";
echo "   ID: " . $user->id . "\n";
echo "   Nom: " . $user->nom . "\n";
echo "   Email: " . $user->email . "\n";
echo "   Role: " . $user->role . "\n";
echo "   Hash: " . $user->password_hash . "\n\n";

// 2. Vérifier le mot de passe
echo "2. VÉRIFICATION DU MOT DE PASSE\n";
echo "------------------------------------------\n";

if (password_verify($password, $user->password_hash)) {
    echo "✅ Mot de passe valide!\n\n";
} else {
    echo "❌ Mot de passe invalide\n";
    echo "   Réinitialisation en cours...\n";
    $user->password_hash = Hash::make($password);
    $user->save();
    echo "✅ Mot de passe réinitialisé!\n\n";
}

// 3. Tester le login via AuthController
echo "3. TEST LOGIN VIA CONTROLLER\n";
echo "------------------------------------------\n";

$request = new Request();
$request->replace(['email' => $email, 'password' => $password]);

$controller = new App\Http\Controllers\Api\AuthController();

try {
    $response = $controller->login($request);
    $content = json_decode($response->getContent(), true);
    
    if (isset($content['token'])) {
        echo "✅ Login réussi!\n";
        echo "   Token: " . substr($content['token'], 0, 30) . "...\n";
        echo "   Utilisateur: " . $content['user']['nom'] . "\n";
        echo "   Role: " . $content['user']['role'] . "\n";
    } else {
        echo "❌ Login échoué:\n";
        print_r($content);
    }
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "   Fichier: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

echo "\n==========================================\n";
echo "FIN DU TEST\n";
echo "==========================================\n";
