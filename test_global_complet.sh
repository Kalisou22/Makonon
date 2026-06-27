#!/bin/bash

BASE_URL="http://localhost:8000/api"
TOKEN="25|UcMQXymyCGPshcYOZTfXrtFh4nGuEk5sJU1bmMcX863d4f67"
IDEMPOTENCY_KEY=$(date +%s%N)

echo "=========================================="
echo "TEST GLOBAL MAKONON API v1.3.0"
echo "=========================================="
echo ""

# ============================================================
# TEST 1: CREATION TRANSFERT
# ============================================================
echo "1. CREATION TRANSFERT"
echo "------------------------------------------"

RESPONSE=$(curl -s -X POST $BASE_URL/transferts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "nom_expediteur": "Test Global",
    "telephone_expediteur": "600000999",
    "nom_beneficiaire": "Benef Global",
    "telephone_beneficiaire": "600000888",
    "montant": 5000,
    "agence_envoi_id": 1,
    "agence_destinataire_id": 2,
    "idempotency_key": "'$IDEMPOTENCY_KEY'"
  }')

echo "Réponse:"
echo "$RESPONSE"

CODE=$(echo "$RESPONSE" | grep -o '"code":"[^"]*"' | head -1 | cut -d'"' -f4)
TRANSFERT_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

echo "Code extrait: $CODE"
echo "ID extrait: $TRANSFERT_ID"
echo ""

if [ -z "$CODE" ] || [ "$CODE" = "null" ]; then
    echo "❌ ERREUR: Code non trouvé"
    exit 1
fi

# ============================================================
# TEST 2: IDEMPOTENCE (MÊME KEY)
# ============================================================
echo "2. IDEMPOTENCE - MÊME IDEMPOTENCY_KEY"
echo "------------------------------------------"

RESPONSE2=$(curl -s -X POST $BASE_URL/transferts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "nom_expediteur": "Test Global",
    "telephone_expediteur": "600000999",
    "nom_beneficiaire": "Benef Global",
    "telephone_beneficiaire": "600000888",
    "montant": 5000,
    "agence_envoi_id": 1,
    "agence_destinataire_id": 2,
    "idempotency_key": "'$IDEMPOTENCY_KEY'"
  }')

echo "Réponse:"
echo "$RESPONSE2"

CODE2=$(echo "$RESPONSE2" | grep -o '"code":"[^"]*"' | head -1 | cut -d'"' -f4)
TRANSFERT_ID2=$(echo "$RESPONSE2" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

echo "Code extrait: $CODE2"
echo "ID extrait: $TRANSFERT_ID2"

if [ "$CODE" = "$CODE2" ] && [ "$TRANSFERT_ID" = "$TRANSFERT_ID2" ]; then
    echo "✅ IDEMPOTENCE OK - Même transfert retourné"
else
    echo "❌ ERREUR: Idempotence échouée - transferts différents"
fi
echo ""

# ============================================================
# TEST 3: SOLDE AVANT ANNULATION
# ============================================================
echo "3. SOLDE AVANT ANNULATION"
echo "------------------------------------------"

SOLDE=$(curl -s -X GET $BASE_URL/transferts/solde-agence \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")

echo "Solde: $SOLDE"
echo ""

# ============================================================
# TEST 4: ANNULATION
# ============================================================
echo "4. ANNULATION"
echo "------------------------------------------"

ANNUL=$(curl -s -X PUT "$BASE_URL/transferts/annuler/$CODE" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"motif":"Test global annulation"}')

echo "Réponse annulation:"
echo "$ANNUL"

STATUT=$(echo "$ANNUL" | grep -o '"statut":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Statut extrait: $STATUT"

if [ "$STATUT" = "ANNULE" ]; then
    echo "✅ ANNULATION OK"
else
    echo "❌ ERREUR: Annulation échouée"
fi
echo ""

# ============================================================
# TEST 5: DOUBLE ANNULATION (DOIT ECHOUER)
# ============================================================
echo "5. DOUBLE ANNULATION (DOIT ECHOUER)"
echo "------------------------------------------"

DOUBLE_ANNUL=$(curl -s -X PUT "$BASE_URL/transferts/annuler/$CODE" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"motif":"Double annulation"}')

echo "Réponse double annulation:"
echo "$DOUBLE_ANNUL"

if echo "$DOUBLE_ANNUL" | grep -q "Transfert déjà annulé"; then
    echo "✅ DOUBLE ANNULATION BLOQUÉE"
else
    echo "❌ ERREUR: Double annulation non bloquée"
fi
echo ""

# ============================================================
# TEST 6: RETRAIT APRÈS ANNULATION (DOIT ECHOUER)
# ============================================================
echo "6. RETRAIT APRÈS ANNULATION (DOIT ECHOUER)"
echo "------------------------------------------"

RETRAIT=$(curl -s -X PUT "$BASE_URL/transferts/retirer/$CODE" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")

echo "Réponse retrait après annulation:"
echo "$RETRAIT"

if echo "$RETRAIT" | grep -q "introuvable"; then
    echo "✅ RETRAIT APRÈS ANNULATION BLOQUÉ"
else
    echo "❌ ERREUR: Retrait après annulation non bloqué"
fi
echo ""

# ============================================================
# TEST 7: SOLDE APRÈS ANNULATION
# ============================================================
echo "7. SOLDE APRÈS ANNULATION"
echo "------------------------------------------"

SOLDE_APRES=$(curl -s -X GET $BASE_URL/transferts/solde-agence \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")

echo "Solde après annulation: $SOLDE_APRES"
echo ""

# ============================================================
# TEST 8: LEDGER AGENCE
# ============================================================
echo "8. LEDGER AGENCE 1"
echo "------------------------------------------"

LEDGER=$(curl -s -X GET "$BASE_URL/ledger/agence/1?per_page=3" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")

echo "$LEDGER"
echo ""

# ============================================================
# TEST 9: COHERENCE DOUBLE ECRITURE
# ============================================================
echo "9. COHERENCE LEDGER (DEBIT = CREDIT)"
echo "------------------------------------------"

php artisan tinker --execute="
use App\Models\Ledger;
\$debit = Ledger::where('type', 'DEBIT')->sum('montant');
\$credit = Ledger::where('type', 'CREDIT')->sum('montant');
echo 'Total DEBIT: ' . \$debit . '\n';
echo 'Total CREDIT: ' . \$credit . '\n';
echo 'Ecart: ' . abs(\$debit - \$credit) . '\n';
if (abs(\$debit - \$credit) < 0.01) {
    echo '✅ LEDGER COHERENT - DEBIT = CREDIT\n';
} else {
    echo '❌ INCOHERENCE LEDGER DETECTEE\n';
}
"

echo "=========================================="
echo "FIN DES TESTS"
echo "=========================================="
