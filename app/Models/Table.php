<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Table extends Model
{
    protected $fillable = ['floor_id', 'number', 'name', 'capacity', 'status', 'active_order_id'];

    public function floor(): BelongsTo
    {
        return $this->belongsTo(Floor::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function activeOrder(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'active_order_id');
    }

    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }
}
