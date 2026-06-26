<?php

namespace App\Exceptions;

use Exception;

class FondsInsuffisantsException extends Exception
{
    protected $message = 'Fonds insuffisants pour cette opération';
    protected $code = 422;

    public function __construct(float $solde, float $montant)
    {
        $this->message = sprintf(
            'Fonds insuffisants. Solde disponible: %s, Montant demandé: %s',
            number_format($solde, 2),
            number_format($montant, 2)
        );
        parent::__construct($this->message, $this->code);
    }
}
