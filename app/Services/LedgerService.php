<?php

namespace App\Services;

use App\Models\LedgerEntry;

class LedgerService
{
    /**
     * Record a financial transaction in the ledger.
     */
    public static function record(
        string $type,
        string $reference,
        string $description,
        float $amount,
        string $direction,
        ?string $category = null,
    ): LedgerEntry {
        return LedgerEntry::create([
            'date'        => now()->toDateString(),
            'type'        => $type,
            'reference'   => $reference,
            'description' => $description,
            'amount'      => $amount,
            'direction'   => $direction,
            'category'    => $category,
        ]);
    }
}
