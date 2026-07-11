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
    public const DEPOT_CAISSE = 'DEPOT_CAISSE';
    public const RETRAIT_CAISSE = 'RETRAIT_CAISSE';
    public const TRANSFERT_SORTIE = 'TRANSFERT_SORTIE';
    public const TRANSFERT_ENTREE = 'TRANSFERT_ENTREE';

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
            self::DEPOT_CAISSE,
            self::RETRAIT_CAISSE,
            self::TRANSFERT_SORTIE,
            self::TRANSFERT_ENTREE,
        ];
    }
}
