#!/bin/bash

echo "=========================================="
echo "VALIDATION COMPLÈTE - MAKONON API"
echo "=========================================="

# 1. OBTENIR LE TOKEN
TOKEN=$(curl -s -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@makonon.com","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: $TOKEN"

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    echo "❌ Échec authentification"
    exit 1
fi

echo ""
echo "1. CREATION TRANSFERT"
IDEMPOTENCY_KEY="test-$(date +%s)"
RESPONSE=$(curl -s -X POST http://localhost:8000/api/transferts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "nom_expediteur": "Test Global",
    "telephone_expediteur": "600000111",
    "nom_beneficiaire": "Benef Global",
    "telephone_beneficiaire": "600000222",
    "montant": 5000,
    "agence_envoi_id": 1,
    "agence_destinataire_id": 2,
    "idempotency_key": "'$IDEMPOTENCY_KEY'"
  }')

echo "Création: $RESPONSE"
CODE=$(echo "$RESPONSE" | grep -o '"code":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Code: $CODE"

if [ -z "$CODE" ] || [ "$CODE" = "null" ]; then
    echo "❌ Échec création"
    exit 1
fi

echo ""
echo "2. RETRAIT"
RETRAIT=$(curl -s -X PUT "http://localhost:8000/api/transferts/retirer/$CODE" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")
echo "Retrait: $RETRAIT"
STATUT=$(echo "$RETRAIT" | grep -o '"statut":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Statut: $STATUT"

echo ""
echo "3. ANNULATION APRÈS RETRAIT (doit échouer)"
ANNUL=$(curl -s -X PUT "http://localhost:8000/api/transferts/annuler/$CODE" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"motif":"Tentative fraude"}')
echo "Annulation: $ANNUL"

if echo "$ANNUL" | grep -q "déjà retiré"; then
    echo "✅ FRAUDE BLOQUÉE"
else
    echo "❌ FRAUDE NON DÉTECTÉE"
fi

echo ""
echo "4. LEDGER"
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

echo ""
echo "=========================================="
echo "FIN DES TESTS"
echo "=========================================="
