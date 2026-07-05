#!/bin/bash

echo "=== DIAGNOSTIC API MAKONON ==="

# Activer debug
sed -i 's/APP_DEBUG=false/APP_DEBUG=true/g' .env
sed -i 's/APP_ENV=production/APP_ENV=local/g' .env

# Vider cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
php artisan optimize:clear

# Récupérer token
TOKEN=$(curl -s -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@makonon.com","password":"admin123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

echo ""
echo "=== TEST /agences ==="
curl -s -X GET "http://localhost:8000/api/agences?per_page=100" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"

echo ""
echo "=== LOGS RECENTS ==="
tail -30 storage/logs/laravel.log | grep -A5 -B5 "ERROR\|error\|Error"

echo ""
echo "=== TEST TINKER ==="
php artisan tinker --execute="
use App\Models\Agence;
try {
    \$count = Agence::count();
    echo 'Total agences: ' . \$count . PHP_EOL;
    \$agences = Agence::limit(5)->get();
    foreach (\$agences as \$a) {
        echo \$a->id . ' - ' . \$a->code . ' - ' . \$a->nom . PHP_EOL;
    }
} catch (\Exception \$e) {
    echo 'Erreur: ' . \$e->getMessage() . PHP_EOL;
}
"
