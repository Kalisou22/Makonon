<?php

namespace App\Exceptions;

use Exception;

class TransfertException extends Exception
{
    protected $context = [];

    public function __construct(string $message, int $code = 422, array $context = [])
    {
        $this->context = $context;
        parent::__construct($message, $code);
    }

    public function getContext(): array
    {
        return $this->context;
    }

    public function render($request)
    {
        return response()->json([
            'message' => $this->getMessage(),
            'code' => $this->getCode(),
            'context' => $this->getContext(),
        ], $this->getCode());
    }
}
