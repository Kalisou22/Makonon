<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;

class PdfService
{
    public static function receipt($transaction)
    {
        return Pdf::loadView('pdf.receipt', compact('transaction'))
            ->download('receipt_'.$transaction->id.'.pdf');
    }
}
