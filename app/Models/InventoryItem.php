<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    protected $fillable = [
        'name', 'unit', 'inventory_unit_id', 'cost_per_unit', 'current_stock',
        'min_stock_level', 'category', 'inventory_category_id', 'is_active', 'last_restocked',
    ];

    protected $casts = [
        'is_active'     => 'boolean',
        'last_restocked' => 'date',
    ];

    public function inventoryCategory(): BelongsTo
    {
        return $this->belongsTo(InventoryCategory::class);
    }

    public function inventoryUnit(): BelongsTo
    {
        return $this->belongsTo(InventoryUnit::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(StockTransaction::class);
    }

    public function purchaseOrderItems(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }
}
