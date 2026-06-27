<?php

namespace App\Constants;

class LedgerNature
{
    public const TRANSFERT_EMIS = 'TRANSFERT_EMIS';
    public const TRANSFERT_RECU = 'TRANSFERT_RECU';
    public const ANNULATION_TRANSFERT = 'ANNULATION_TRANSFERT';
    public const RETRAIT_EFFECTUE = 'RETRAIT_EFFECTUE';
    public const DEPOT_INITIAL = 'DEPOT_INITIAL';
    public const FRAIS = 'FRAIS';
    public const COMMISSION = 'COMMISSION';
    public const ENVOI = 'ENVOI';
    public const RECEPTION = 'RECEPTION';
    public const RETRAIT = 'RETRAIT';

    public static function all(): array
    {
        return [
            self::TRANSFERT_EMIS,
            self::TRANSFERT_RECU,
            self::ANNULATION_TRANSFERT,
            self::RETRAIT_EFFECTUE,
            self::DEPOT_INITIAL,
            self::FRAIS,
            self::COMMISSION,
            self::ENVOI,
            self::RECEPTION,
            self::RETRAIT,
        ];
    }
}
