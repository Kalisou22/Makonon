#!/bin/bash

BASE_URL="http://localhost:8000/api"
TOKEN="44|gbFdReX9I50fZshwF4XHuzVYTj0aOVjYlZsvJDFC767f0267"

echo "=========================================="
echo "TEST FINTECH - NIVEAU PRODUCTION"
echo "=========================================="

# ============================================================
# TEST 1: CREATION TRANSFERT
# ============================================================
echo ""
echo "1. CREATION TRANSFERT"
echo "------------------------------------------"

IDEMPOTENCY_KEY="test-$(date +%s)"
RESPONSE=$(curl -s -X POST $BASE_URL/transferts \
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

echo "Réponse: $RESPONSE"
CODE=$(echo "$RESPONSE" | grep -o '"code":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Code: $CODE"

# ============================================================
# TEST 2: ANNULATION
# ============================================================
if [ -n "$CODE" ] && [ "$CODE" != "null" ]; then
    echo ""
    echo "2. ANNULATION"
    echo "------------------------------------------"
    ANNUL=$(curl -s -X PUT "$BASE_URL/transferts/annuler/$CODE" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -d '{"motif":"Annulation test"}')
    echo "Annulation: $ANNUL"
    
    STATUT=$(echo "$ANNUL" | grep -o '"statut":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "Statut: $STATUT"
fi

# ============================================================
# TEST 3: FRAUDE - ANNULATION APRÈS RETRAIT
# ============================================================
echo ""
echo "3. TEST FRAUDE: ANNULATION APRÈS RETRAIT"
echo "------------------------------------------"

IDEMPOTENCY_KEY="fraude-$(date +%s)"
RESPONSE=$(curl -s -X POST $BASE_URL/transferts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "nom_expediteur": "Fraude Test",
    "telephone_expediteur": "600000333",
    "nom_beneficiaire": "Benef Fraude",
    "telephone_beneficiaire": "600000444",
    "montant": 3000,
    "agence_envoi_id": 1,
    "agence_destinataire_id": 2,
    "idempotency_key": "'$IDEMPOTENCY_KEY'"
  }')

CODE=$(echo "$RESPONSE" | grep -o '"code":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Code: $CODE"

if [ -n "$CODE" ] && [ "$CODE" != "null" ]; then
    echo "Retrait..."
    RETRAIT=$(curl -s -X PUT "$BASE_URL/transferts/retirer/$CODE" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Accept: application/json")
    echo "Retrait: $RETRAIT"
    
    echo "Tentative d'annulation (doit échouer)..."
    ANNUL=$(curl -s -X PUT "$BASE_URL/transferts/annuler/$CODE" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -d '{"motif":"Tentative fraude"}')
    
    if echo "$ANNUL" | grep -q "déjà retiré"; then
        echo "✅ ANNULATION BLOQUÉE - FRAUDE DÉTECTÉE"
    else
        echo "❌ FRAUDE NON DÉTECTÉE - Annulation: $ANNUL"
    fi
fi

# ============================================================
# TEST 4: LEDGER FINAL
# ============================================================
echo ""
echo "4. LEDGER FINAL"
echo "------------------------------------------"
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
