<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LedgerEntry extends Model
{
    protected $fillable = [
        'date', 'type', 'reference', 'description', 'amount', 'direction', 'category',
    ];

    protected $casts = [
        'date' => 'date',
    ];
}
