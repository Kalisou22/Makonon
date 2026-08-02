// app/Http/Controllers/Api/TransfertController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transfert;
use App\Models\Agence;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransfertController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Transfert::query();

        if (in_array($user->role, ['responsable', 'agent'])) {
            $query->where(function ($q) use ($user) {
                $q->where('agence_source_id', $user->agence_id)
                  ->orWhere('agence_destination_id', $user->agence_id);
            });
        }

        if ($request->statut) {
            $query->where('statut', $request->statut);
        }

        return response()->json($query->latest()->paginate(20));
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'montant' => 'required|numeric|min:1',
            'agence_source_id' => 'required|exists:agences,id',
            'agence_destination_id' => 'required|exists:agences,id',
            'client_id' => 'required|exists:clients,id'
        ]);

        if ($user->role === 'agent') {
            $data['agence_source_id'] = $user->agence_id;
        }

        if ($data['agence_source_id'] == $data['agence_destination_id']) {
            return response()->json(['message' => 'Agences identiques interdites'], 422);
        }

        return DB::transaction(function () use ($data, $user) {

            $source = Agence::lockForUpdate()->findOrFail($data['agence_source_id']);

            if ($source->solde < $data['montant']) {
                return response()->json(['message' => 'Solde insuffisant'], 400);
            }

            $source->decrement('solde', $data['montant']);

            $transfert = Transfert::create([
                ...$data,
                'user_id' => $user->id,
                'statut' => 'en_attente',
                'reference' => uniqid('TRX-')
            ]);

            Transaction::create([
                'type' => 'debit',
                'montant' => $data['montant'],
                'agence_id' => $source->id,
                'transfert_id' => $transfert->id
            ]);

            return response()->json($transfert, 201);
        });
    }

    public function valider(Transfert $transfert, Request $request)
    {
        $user = $request->user();

        if ($user->role === 'agent') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if ($transfert->statut !== 'en_attente') {
            return response()->json(['message' => 'Déjà traité'], 400);
        }

        if ($user->role === 'responsable' && $transfert->agence_destination_id !== $user->agence_id) {
            return response()->json(['message' => 'Interdit'], 403);
        }

        return DB::transaction(function () use ($transfert) {

            $destination = Agence::lockForUpdate()->findOrFail($transfert->agence_destination_id);

            $destination->increment('solde', $transfert->montant);

            $transfert->update(['statut' => 'valide']);

            Transaction::create([
                'type' => 'credit',
                'montant' => $transfert->montant,
                'agence_id' => $destination->id,
                'transfert_id' => $transfert->id
            ]);

            return response()->json(['message' => 'Transfert validé']);
        });
    }

    public function annuler(Transfert $transfert, Request $request)
    {
        $user = $request->user();

        if ($user->role === 'agent') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if ($transfert->statut !== 'en_attente') {
            return response()->json(['message' => 'Impossible'], 400);
        }

        return DB::transaction(function () use ($transfert) {

            $source = Agence::lockForUpdate()->findOrFail($transfert->agence_source_id);

            $source->increment('solde', $transfert->montant);

            $transfert->update(['statut' => 'annule']);

            return response()->json(['message' => 'Transfert annulé']);
        });
    }
}