<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    protected $fillable = [
        'name', 'unit', 'cost_per_unit', 'current_stock',
        'min_stock_level', 'category', 'is_active', 'last_restocked',
    ];

    protected $casts = [
        'is_active'     => 'boolean',
        'last_restocked' => 'date',
    ];

    public function transactions(): HasMany
    {
        return $this->hasMany(StockTransaction::class);
    }

    public function purchaseOrderItems(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }
}
