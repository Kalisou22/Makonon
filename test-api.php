<?php
// ============================================================
// FICHIER DE TEST API - MAKONON TRANSFERT
// ============================================================

echo "==========================================\n";
echo "MAKONON TRANSFERT - TEST API\n";
echo "==========================================\n\n";

// ============================================================
// 1. TESTER LA SANTÉ DE L'API
// ============================================================
echo "1. TEST /api/health\n";
echo "-------------------\n";

$ch = curl_init('http://127.0.0.1:8000/api/health');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

$headers = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);

curl_close($ch);

echo "HTTP Code: " . $httpCode . "\n";
echo "Headers:\n" . $headers . "\n";
echo "Body:\n" . $body . "\n\n";

// ============================================================
// 2. TESTER LE LOGIN
// ============================================================
echo "2. TEST /api/login\n";
echo "-------------------\n";

$data = json_encode([
    'email' => 'admin@makonon.com',
    'password' => 'admin123'
]);

$ch = curl_init('http://127.0.0.1:8000/api/login');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

$headers = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);

curl_close($ch);

echo "HTTP Code: " . $httpCode . "\n";
echo "Headers:\n" . $headers . "\n";
echo "Body:\n" . $body . "\n\n";

// ============================================================
// 3. ANALYSE DU RÉSULTAT
// ============================================================
echo "3. ANALYSE\n";
echo "----------\n";

if ($httpCode == 200) {
    echo "✅ API OK - Login réussi!\n";
    
    $json = json_decode($body, true);
    if ($json && isset($json['token'])) {
        echo "✅ Token reçu: " . substr($json['token'], 0, 30) . "...\n";
        echo "👤 Utilisateur: " . $json['user']['nom'] . "\n";
        echo "👤 Rôle: " . $json['user']['role'] . "\n";
    } else {
        echo "⚠️ Le body n'est pas un JSON valide\n";
        echo "Body reçu: " . substr($body, 0, 200) . "...\n";
    }
} elseif ($httpCode == 404) {
    echo "❌ Route non trouvée (404)\n";
    echo "Vérifiez que la route /api/login existe\n";
    echo "Contenu HTML reçu (premiers caractères):\n";
    echo substr($body, 0, 300) . "...\n";
} elseif ($httpCode == 401) {
    echo "❌ Identifiants incorrects (401)\n";
} else {
    echo "❌ Erreur HTTP " . $httpCode . "\n";
    echo "Body:\n" . substr($body, 0, 500) . "\n";
}

echo "\n==========================================\n";
echo "FIN DU TEST\n";
echo "==========================================\n";
