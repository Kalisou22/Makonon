// app/Http/Controllers/Api/DashboardController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transfert;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total' => Transfert::count(),
            'valide' => Transfert::where('statut', 'valide')->count(),
            'en_attente' => Transfert::where('statut', 'en_attente')->count(),
            'annule' => Transfert::where('statut', 'annule')->count(),
            'volume' => Transfert::where('statut', 'valide')->sum('montant'),
        ]);
    }
}