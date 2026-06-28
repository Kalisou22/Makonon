#!/bin/bash

BASE_URL="http://localhost:8000/api"
TOKEN="'"$TOKEN"'"

echo "=========================================="
echo "TEST FINAL - FRAUDE ANNULATION"
echo "=========================================="

echo ""
echo "1. CREATION TRANSFERT"

IDEMPOTENCY_KEY="test-$(date +%s)"
RESPONSE=$(curl -s -X POST $BASE_URL/transferts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "nom_expediteur": "Test Final",
    "telephone_expediteur": "600000999",
    "nom_beneficiaire": "Benef Final",
    "telephone_beneficiaire": "600000888",
    "montant": 5000,
    "agence_envoi_id": 1,
    "agence_destinataire_id": 2,
    "idempotency_key": "'$IDEMPOTENCY_KEY'"
  }')

echo "Réponse: $RESPONSE"

CODE=$(echo "$RESPONSE" | grep -o '"code":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Code extrait: $CODE"

if [ -z "$CODE" ] || [ "$CODE" = "null" ]; then
    echo "❌ Échec création transfert"
    exit 1
fi

echo ""
echo "2. RETRAIT DU TRANSFERT"
RETRAIT=$(curl -s -X PUT "$BASE_URL/transferts/retirer/$CODE" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")
echo "Retrait: $RETRAIT"

STATUT=$(echo "$RETRAIT" | grep -o '"statut":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Statut après retrait: $STATUT"

echo ""
echo "3. ANNULATION DU TRANSFERT (DOIT ÉCHOUER)"
ANNUL=$(curl -s -X PUT "$BASE_URL/transferts/annuler/$CODE" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"motif":"Tentative fraude"}')
echo "Annulation: $ANNUL"

if echo "$ANNUL" | grep -q "déjà retiré"; then
    echo "✅ ANNULATION BLOQUÉE - FRAUDE DÉTECTÉE"
else
    echo "❌ FRAUDE NON DÉTECTÉE - Le système est vulnérable"
fi

echo ""
echo "4. LEDGER FINAL"
php artisan tinker --execute="
use App\Models\Ledger;
\$debit = Ledger::where('type', 'DEBIT')->sum('montant');
\$credit = Ledger::where('type', 'CREDIT')->sum('montant');
echo 'DEBIT: ' . \$debit . ' GNF';
echo 'CREDIT: ' . \$credit . ' GNF';
echo 'ECART: ' . abs(\$debit - \$credit) . ' GNF';
if (abs(\$debit - \$credit) < 0.01) {
    echo '✅ LEDGER ÉQUILIBRÉ';
} else {
    echo '❌ LEDGER DÉSÉQUILIBRÉ';
}
"

echo "=========================================="
echo "FIN DES TESTS"
echo "=========================================="
