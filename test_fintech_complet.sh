#!/bin/bash

BASE_URL="http://localhost:8000/api"
TOKEN=$(curl -s -X POST $BASE_URL/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@makonon.com","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Impossible d'obtenir un token"
    exit 1
fi

echo "✅ Token récupéré"
echo "=========================================="
echo "TEST FINTECH - VALIDATION PRODUCTION"
echo "=========================================="

# ============================================================
# TEST 1: CONCURRENCE (RACE CONDITION)
# ============================================================
echo ""
echo "1. TEST CONCURRENCE - 2 ANNULATIONS SIMULTANÉES"
echo "------------------------------------------"

# Créer un transfert
RESPONSE=$(curl -s -X POST $BASE_URL/transferts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "nom_expediteur": "Concurrence Test",
    "telephone_expediteur": "600000111",
    "nom_beneficiaire": "Benef Concurrence",
    "telephone_beneficiaire": "600000222",
    "montant": 5000,
    "agence_envoi_id": 1,
    "agence_destinataire_id": 2,
    "idempotency_key": "concurrence-'$(date +%s%N)'"
  }')

CODE=$(echo "$RESPONSE" | grep -o '"code":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Code: $CODE"

if [ -n "$CODE" ] && [ "$CODE" != "null" ]; then
    # Lancer 2 annulations simultanées
    echo "Lancement de 2 annulations simultanées..."
    for i in 1 2; do
        curl -s -X PUT "$BASE_URL/transferts/annuler/$CODE" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            -d '{"motif":"Annulation concurrence"}' &
    done
    wait
    echo "✅ Test concurrence terminé"
else
    echo "❌ Échec création transfert"
fi

# ============================================================
# TEST 2: IDEMPOTENCE (SPAM API)
# ============================================================
echo ""
echo "2. TEST IDEMPOTENCE - 10 ANNULATIONS SIMULTANÉES"
echo "------------------------------------------"

# Créer un transfert
RESPONSE=$(curl -s -X POST $BASE_URL/transferts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "nom_expediteur": "Idempotence Test",
    "telephone_expediteur": "600000333",
    "nom_beneficiaire": "Benef Idempotence",
    "telephone_beneficiaire": "600000444",
    "montant": 5000,
    "agence_envoi_id": 1,
    "agence_destinataire_id": 2,
    "idempotency_key": "idempotence-'$(date +%s%N)'"
  }')

CODE=$(echo "$RESPONSE" | grep -o '"code":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Code: $CODE"

if [ -n "$CODE" ] && [ "$CODE" != "null" ]; then
    echo "Lancement de 10 annulations simultanées..."
    for i in {1..10}; do
        curl -s -X PUT "$BASE_URL/transferts/annuler/$CODE" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            -d '{"motif":"Spam annulation"}' &
    done
    wait
    echo "✅ Test idempotence terminé"
else
    echo "❌ Échec création transfert"
fi

# ============================================================
# TEST 3: INTÉGRITÉ LEDGER (DEBIT = CREDIT)
# ============================================================
echo ""
echo "3. TEST INTÉGRITÉ LEDGER"
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
    echo '❌ INCOHÉRENCE DÉTECTÉE';
}
"

# ============================================================
# TEST 4: MONTANTS INVALIDES
# ============================================================
echo ""
echo "4. TEST MONTANTS INVALIDES"
echo "------------------------------------------"

echo "--- Montant négatif ---"
curl -s -X POST $BASE_URL/transferts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "nom_expediteur": "Negatif Test",
    "telephone_expediteur": "600000555",
    "nom_beneficiaire": "Benef Negatif",
    "telephone_beneficiaire": "600000666",
    "montant": -5000,
    "agence_envoi_id": 1,
    "agence_destinataire_id": 2,
    "idempotency_key": "negatif-'$(date +%s%N)'"
  }' | grep -o '"message":"[^"]*"' | head -1

echo "--- Montant nul ---"
curl -s -X POST $BASE_URL/transferts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "nom_expediteur": "Zero Test",
    "telephone_expediteur": "600000777",
    "nom_beneficiaire": "Benef Zero",
    "telephone_beneficiaire": "600000888",
    "montant": 0,
    "agence_envoi_id": 1,
    "agence_destinataire_id": 2,
    "idempotency_key": "zero-'$(date +%s%N)'"
  }' | grep -o '"message":"[^"]*"' | head -1

# ============================================================
# TEST 5: SÉCURITÉ - ACCÈS INTERDIT
# ============================================================
echo ""
echo "5. TEST SÉCURITÉ - ANNULATION SANS TOKEN"
echo "------------------------------------------"

curl -s -X PUT "$BASE_URL/transferts/annuler/FAKECODE" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"motif":"Sans token"}' | grep -o '"message":"[^"]*"' | head -1

# ============================================================
# TEST 6: CODE INVALIDE
# ============================================================
echo ""
echo "6. TEST CODE INVALIDE"
echo "------------------------------------------"

curl -s -X PUT "$BASE_URL/transferts/annuler/FAKECODE123" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"motif":"Code invalide"}' | grep -o '"message":"[^"]*"' | head -1

# ============================================================
# TEST 7: VÉRIFICATION FINALE SOLDE
# ============================================================
echo ""
echo "7. SOLDE FINAL AGENCE 1"
echo "------------------------------------------"

curl -s -X GET "$BASE_URL/transferts/solde-agence" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | grep -o '"solde":[0-9]*'

echo ""
echo "=========================================="
echo "FIN DES TESTS"
echo "=========================================="
