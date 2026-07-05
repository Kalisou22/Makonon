<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

echo "========== STRUCTURE TABLE UTILISATEURS ==========\n";
$columns = Schema::getColumnListing('utilisateurs');
print_r($columns);

echo "\n========== UTILISATEURS EXISTANTS ==========\n";
$users = User::all();
foreach ($users as $user) {
    echo "ID: {$user->id}, Nom: {$user->nom}, Email: {$user->email}, Role: {$user->role}, Agence_ID: {$user->agence_id}\n";
}
