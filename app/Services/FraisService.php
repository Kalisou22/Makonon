<?php

namespace App\Services;

use App\Models\FraisConfiguration;
use App\Models\FraisHistorique;
use App\Models\Transfert;

class FraisService
{
    public function calculerFrais(float $montant, ?\DateTime $date = null): array
    {
        $date = $date ?? now();
        
        $config = FraisConfiguration::where("actif", true)
            ->where("date_debut", "<=", $date)
            ->where(function ($q) use ($date) {
                $q->whereNull("date_fin")->orWhere("date_fin", ">=", $date);
            })
            ->where(function ($q) use ($montant) {
                $q->where("seuil_min", "<=", $montant)
                  ->where(function ($q2) use ($montant) {
                      $q2->whereNull("seuil_max")->orWhere("seuil_max", ">=", $montant);
                  });
            })
            ->first();

        if (!$config) {
            $frais = $this->calculerFraisDefaut($montant);
            return [
                "montant" => $frais,
                "type" => "FIXE",
                "configuration" => null,
                "config_id" => null
            ];
        }

        $frais = match ($config->type) {
            "FIXE" => $config->valeur,
            "POURCENTAGE" => ($montant * $config->valeur) / 100,
            "ECHELONNE" => $this->calculerFraisEchelonne($montant, $config),
            default => 0
        };

        return [
            "montant" => round($frais, 2),
            "type" => $config->type,
            "configuration" => $config,
            "config_id" => $config->id
        ];
    }

    private function calculerFraisDefaut(float $montant): float
    {
        if ($montant <= 100000) return 1000;
        if ($montant <= 500000) return 2000;
        if ($montant <= 1000000) return 3000;
        return 5000;
    }

    private function calculerFraisEchelonne(float $montant, FraisConfiguration $config): float
    {
        $frais = ($montant * $config->valeur) / 100;
        if ($config->seuil_min && $frais < $config->seuil_min) {
            $frais = $config->seuil_min;
        }
        if ($config->seuil_max && $frais > $config->seuil_max) {
            $frais = $config->seuil_max;
        }
        return $frais;
    }

    public function enregistrerHistorique(Transfert $transfert, float $montantInitial, array $fraisData): FraisHistorique
    {
        return FraisHistorique::create([
            "frais_configuration_id" => $fraisData["config_id"],
            "transfert_id" => $transfert->id,
            "montant_initial" => $montantInitial,
            "montant_frais" => $fraisData["montant"],
            "type_frais" => $fraisData["type"]
        ]);
    }

    public function getConfigurationActuelle(): ?FraisConfiguration
    {
        return FraisConfiguration::where("actif", true)
            ->where("date_debut", "<=", now())
            ->where(function ($q) {
                $q->whereNull("date_fin")->orWhere("date_fin", ">=", now());
            })
            ->first();
    }

    public function getHistorique(): array
    {
        return FraisConfiguration::orderBy("created_at", "desc")->get()->toArray();
    }

    public function creerConfiguration(array $data, int $userId): FraisConfiguration
    {
        return FraisConfiguration::create(array_merge($data, [
            "created_by" => $userId,
            "date_debut" => $data["date_debut"] ?? now(),
        ]));
    }

    public function desactiverConfiguration(int $id): bool
    {
        $config = FraisConfiguration::findOrFail($id);
        $config->actif = false;
        $config->date_fin = now();
        return $config->save();
    }
}