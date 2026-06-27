#!/bin/bash

BASE_URL="http://localhost:8000/api"
TOKEN="25|UcMQXymyCGPshcYOZTfXrtFh4nGuEk5sJU1bmMcX863d4f67"

echo "====================================="
echo "TEST 0: HEALTH CHECK"
echo "====================================="
curl -s $BASE_URL/health || echo "API non disponible"
echo ""

echo "====================================="
echo "TEST 1: CREATION TRANSFERT"
echo "====================================="
RESPONSE=$(curl -s -X POST $BASE_URL/transferts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "nom_expediteur": "Test User",
    "telephone_expediteur": "600000001",
    "nom_beneficiaire": "Test Benef",
    "telephone_beneficiaire": "600000002",
    "montant": 5000,
    "agence_envoi_id": 1,
    "agence_destinataire_id": 2
  }')

echo $RESPONSE

CODE=$(echo $RESPONSE | grep -o '"code":"[^"]*"' | cut -d'"' -f4)
echo "Code extrait: $CODE"
echo ""

echo "====================================="
echo "TEST 2: RETRAIT OK"
echo "====================================="
curl -s -X PUT $BASE_URL/transferts/retirer/$CODE \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
echo ""
echo ""

echo "====================================="
echo "TEST 3: DOUBLE RETRAIT (DOIT ECHOUER)"
echo "====================================="
curl -s -X PUT $BASE_URL/transferts/retirer/$CODE \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
echo ""
echo ""

echo "====================================="
echo "TEST 4: ANNULATION APRES RETRAIT (DOIT ECHOUER)"
echo "====================================="
curl -s -X PUT $BASE_URL/transferts/annuler/$CODE \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"motif":"Test annulation"}'
echo ""
echo ""

echo "====================================="
echo "TEST 5: CODE INVALIDE"
echo "====================================="
curl -s -X PUT $BASE_URL/transferts/retirer/FAKECODE123 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
echo ""
echo ""

echo "====================================="
echo "TEST 6: MONTANT NEGATIF (DOIT ECHOUER)"
echo "====================================="
curl -s -X POST $BASE_URL/transferts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "nom_expediteur": "Bad Test",
    "telephone_expediteur": "600000003",
    "nom_beneficiaire": "Bad Benef",
    "telephone_beneficiaire": "600000004",
    "montant": -100,
    "agence_envoi_id": 1,
    "agence_destinataire_id": 2
  }'
echo ""
echo ""

echo "====================================="
echo "TEST 7: ANNULATION AVANT RETRAIT (DOIT REUSSIR)"
echo "====================================="

RESPONSE2=$(curl -s -X POST $BASE_URL/transferts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "nom_expediteur": "Cancel Test",
    "telephone_expediteur": "600000005",
    "nom_beneficiaire": "Cancel Benef",
    "telephone_beneficiaire": "600000006",
    "montant": 2000,
    "agence_envoi_id": 1,
    "agence_destinataire_id": 2
  }')

CODE2=$(echo $RESPONSE2 | grep -o '"code":"[^"]*"' | cut -d'"' -f4)
echo "Code2: $CODE2"

curl -s -X PUT $BASE_URL/transferts/annuler/$CODE2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"motif":"Annulation valide"}'
echo ""
echo ""

echo "====================================="
echo "TEST 8: VERIFICATION SOLDE"
echo "====================================="
curl -s -X GET $BASE_URL/transferts/solde-agence \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
echo ""
echo ""

echo "====================================="
echo "TEST 9: LEDGER AGENCE 1"
echo "====================================="
curl -s -X GET "$BASE_URL/ledger/agence/1?per_page=3" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
echo ""
echo ""

echo "====================================="
echo "FIN DES TESTS"
echo "====================================="
