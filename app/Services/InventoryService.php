<?php

namespace App\Services;

use App\Models\InventoryItem;
use App\Models\PurchaseOrder;
use App\Models\StockTransaction;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    /**
     * Record a stock transaction and update the item's current_stock.
     */
    public static function recordTransaction(array $data): StockTransaction
    {
        return DB::transaction(function () use ($data) {
            $item = InventoryItem::findOrFail($data['inventory_item_id']);

            $qty = (float) $data['quantity'];
            $totalCost = null;

            if ($data['type'] === 'stock_in') {
                $item->increment('current_stock', $qty);
                $item->update(['last_restocked' => now()->toDateString()]);
                if (!empty($data['cost_per_unit'])) {
                    $totalCost = (int) round($qty * $data['cost_per_unit']);
                    // Update item cost to latest price
                    $item->update(['cost_per_unit' => (int) $data['cost_per_unit']]);
                }
            } elseif ($data['type'] === 'stock_out' || $data['type'] === 'waste') {
                $item->decrement('current_stock', $qty);
            } elseif ($data['type'] === 'adjustment') {
                $item->update(['current_stock' => max(0, $item->current_stock + $qty)]);
            }

            return StockTransaction::create([
                'inventory_item_id' => $data['inventory_item_id'],
                'type'              => $data['type'],
                'quantity'          => $qty,
                'unit'              => $item->unit,
                'cost_per_unit'     => $data['cost_per_unit'] ?? null,
                'total_cost'        => $totalCost,
                'notes'             => $data['notes'] ?? null,
                'created_by'        => $data['created_by'] ?? null,
            ]);
        });
    }

    /**
     * Get items where current_stock <= min_stock_level.
     */
    public static function getAlerts(): Collection
    {
        return InventoryItem::where('is_active', true)
            ->whereColumn('current_stock', '<=', 'min_stock_level')
            ->get()
            ->map(fn($item) => [
                'id'               => $item->id,
                'inventory_item_id' => $item->id,
                'item_name'        => $item->name,
                'current_stock'    => $item->current_stock,
                'min_stock_level'  => $item->min_stock_level,
                'unit'             => $item->unit,
                'shortage'         => max(0, $item->min_stock_level - $item->current_stock),
                'severity'         => $item->current_stock <= $item->min_stock_level * 0.3
                    ? 'critical'
                    : 'warning',
            ]);
    }

    /**
     * Mark a PO as arrived: create stock_in transactions for each item,
     * update PO status, and create a ledger entry.
     */
    public static function markPOArrived(PurchaseOrder $po): void
    {
        DB::transaction(function () use ($po) {
            $po->load('items');

            foreach ($po->items as $poItem) {
                self::recordTransaction([
                    'inventory_item_id' => $poItem->inventory_item_id,
                    'type'              => 'stock_in',
                    'quantity'          => $poItem->quantity,
                    'cost_per_unit'     => $poItem->unit_cost,
                ]);
            }

            $po->update([
                'status'       => 'arrived',
                'arrived_date' => now()->toDateString(),
            ]);

            LedgerService::record(
                type: 'inventory_purchase',
                reference: $po->po_number,
                description: 'سفارش خرید ' . $po->po_number . ' از ' . ($po->supplier->name ?? ''),
                amount: $po->total_amount,
                direction: 'out',
                category: 'inventory_purchase',
            );
        });
    }
}
