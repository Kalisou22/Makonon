#!/bin/bash

BASE_URL="http://localhost:8000/api"
TOKEN="25|UcMQXymyCGPshcYOZTfXrtFh4nGuEk5sJU1bmMcX863d4f67"

echo "====================================="
echo "TEST ANNULATION COMPLET"
echo "====================================="

echo "1. CREATION TRANSFERT"
RESPONSE=$(curl -s -X POST $BASE_URL/transferts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "nom_expediteur": "Test Annulation",
    "telephone_expediteur": "600000999",
    "nom_beneficiaire": "Benef Annulation",
    "telephone_beneficiaire": "600000111",
    "montant": 3000,
    "agence_envoi_id": 1,
    "agence_destinataire_id": 2
  }')

echo "Réponse:"
echo "$RESPONSE"

# Extraction robuste du code
CODE=$(echo "$RESPONSE" | grep -o '"code":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$CODE" ] || [ "$CODE" = "null" ]; then
    echo "❌ Code non trouvé dans la réponse"
    echo "Message d'erreur: $RESPONSE"
    exit 1
fi

echo "Code extrait: $CODE"
echo ""

echo "2. ANNULATION DU TRANSFERT"
ANNUL_RESPONSE=$(curl -s -X PUT $BASE_URL/transferts/annuler/$CODE \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"motif":"Test annulation complet"}')

echo "Réponse annulation:"
echo "$ANNUL_RESPONSE"
echo ""

echo "3. VERIFICATION"
VERIF_RESPONSE=$(curl -s -X GET $BASE_URL/transferts/verifier/$CODE \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")

echo "Réponse vérification:"
echo "$VERIF_RESPONSE"
echo ""

echo "4. SOLDE FINAL"
SOLDE_RESPONSE=$(curl -s -X GET $BASE_URL/transferts/solde-agence \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")

echo "Solde:"
echo "$SOLDE_RESPONSE"

echo "====================================="
echo "FIN DES TESTS"
echo "====================================="
