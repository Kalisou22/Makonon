<?php

namespace App\Services;

use App\Models\Agence;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MouvementService
{
    public function create(array $data): void
    {
        DB::transaction(function () use ($data) {
            // 1. Insérer le mouvement
            DB::table('mouvements')->insert([
                'agence_id' => $data['agence_id'],
                'type' => $data['type'],
                'sens' => $data['sens'],
                'montant' => $data['montant'],
                'transaction_id' => $data['transaction_id'] ?? null,
                'motif' => $data['motif'] ?? null,
                'created_at' => now(),
            ]);

            // 2. Mettre à jour le solde correspondant
            $colonne = match ($data['type']) {
                'CASH' => 'solde_cash',
                'DETTE' => 'solde_dette',
                'FRAIS' => 'solde_frais',
                default => null
            };

            if (!$colonne) {
                throw new \Exception("Type de mouvement invalide");
            }

            $operation = $data['sens'] === 'ENTREE' ? '+' : '-';

            DB::table('agences')
                ->where('id', $data['agence_id'])
                ->update([
                    $colonne => DB::raw("{$colonne} {$operation} {$data['montant']}")
                ]);

            Log::info('Mouvement créé', [
                'agence_id' => $data['agence_id'],
                'type' => $data['type'],
                'sens' => $data['sens'],
                'montant' => $data['montant'],
                'motif' => $data['motif'] ?? null
            ]);
        });
    }

    public function getSoldeDisponible(int $agenceId): float
    {
        $agence = Agence::find($agenceId);
        if (!$agence) {
            return 0;
        }
        return $agence->solde_cash - $agence->solde_dette;
    }

    public function getSoldes(int $agenceId): array
    {
        $agence = Agence::find($agenceId);
        if (!$agence) {
            return ['cash' => 0, 'dette' => 0, 'frais' => 0, 'disponible' => 0];
        }

        return [
            'cash' => $agence->solde_cash,
            'dette' => $agence->solde_dette,
            'frais' => $agence->solde_frais,
            'disponible' => $agence->solde_cash - $agence->solde_dette
        ];
    }
}
