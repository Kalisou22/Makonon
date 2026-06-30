<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AgenceFactory extends Factory
{
    protected $model = \App\Models\Agence::class;

    public function definition(): array
    {
        return [
            'code' => $this->faker->unique()->regexify('AG[0-9]{3}'),
            'nom' => $this->faker->company(),
            'devise' => 'GNF',
            'solde_cache' => 0,
            'actif' => true,
        ];
    }
}
