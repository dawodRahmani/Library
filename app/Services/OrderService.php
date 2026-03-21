<?php

namespace App\Services;

use App\Events\NewOrderCreated;
use App\Events\OrderStatusChanged;
use App\Events\TableStatusChanged;
use App\Models\Order;
use App\Services\LedgerService;
use App\Models\OrderItem;
use App\Models\Table;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Create a new order and lock the table.
     */
    public function create(array $data, int $createdBy): Order
    {
        return DB::transaction(function () use ($data, $createdBy) {
            $order = Order::create([
                'table_id'     => $data['table_id'] ?? null,
                'order_number' => $this->generateOrderNumber(),
                'status'       => 'pending',
                'order_type'   => $data['order_type'] ?? 'dine_in',
                'notes'        => $data['notes'] ?? null,
                'created_by'   => $createdBy,
                'total_amount' => 0,
            ]);

            $total = 0;
            foreach ($data['items'] as $item) {
                $subtotal = $item['unit_price'] * $item['quantity'];
                $total += $subtotal;
                OrderItem::create([
                    'order_id'     => $order->id,
                    'menu_item_id' => $item['menu_item_id'],
                    'quantity'     => $item['quantity'],
                    'unit_price'   => $item['unit_price'],
                    'subtotal'     => $subtotal,
                    'notes'        => $item['notes'] ?? null,
                ]);
            }

            $order->update(['total_amount' => $total]);

            // Mark table as occupied
            if ($order->table_id) {
                Table::where('id', $order->table_id)->update([
                    'status'          => 'occupied',
                    'active_order_id' => $order->id,
                ]);
            }

            $order = $order->load('items.menuItem', 'table.floor', 'creator');

            try {
                broadcast(new NewOrderCreated($this->formatOrderForBroadcast($order)))->toOthers();

                if ($order->table_id) {
                    broadcast(new TableStatusChanged($order->table_id, 'occupied', $order->id))->toOthers();
                }
            } catch (\Throwable) {
                // Broadcasting is optional — don't fail the order if Reverb isn't running
            }

            return $order;
        });
    }

    /**
     * Transition order to a new status.
     */
    public function transitionStatus(Order $order, string $status): Order
    {
        $order->update(['status' => $status]);

        try {
            broadcast(new OrderStatusChanged($order->id, $status))->toOthers();
        } catch (\Throwable) {
            // Broadcasting is optional
        }

        return $order->fresh('items.menuItem', 'table.floor');
    }

    /**
     * Mark order as paid, free the table, create ledger entry.
     */
    public function pay(Order $order): Order
    {
        DB::transaction(function () use ($order) {
            $order->update([
                'status'  => 'paid',
                'paid_at' => now(),
            ]);

            if ($order->table_id) {
                Table::where('id', $order->table_id)->update([
                    'status'          => 'available',
                    'active_order_id' => null,
                ]);
            }

            LedgerService::record(
                type: 'income',
                reference: $order->order_number,
                description: 'فروش فرمایش ' . $order->order_number,
                amount: $order->total_amount,
                direction: 'in',
            );

            if ($order->table_id) {
                try {
                    broadcast(new TableStatusChanged($order->table_id, 'available', null))->toOthers();
                } catch (\Throwable) {}
            }
        });

        return $order->fresh('items.menuItem', 'table.floor');
    }

    /**
     * Cancel order, free the table.
     */
    public function cancel(Order $order, ?string $reason = null): Order
    {
        DB::transaction(function () use ($order, $reason) {
            $order->update([
                'status' => 'cancelled',
                'notes'  => $reason ? ($order->notes ? $order->notes . ' | ' . $reason : $reason) : $order->notes,
            ]);

            if ($order->table_id) {
                Table::where('id', $order->table_id)->update([
                    'status'          => 'available',
                    'active_order_id' => null,
                ]);
                try {
                    broadcast(new TableStatusChanged($order->table_id, 'available', null))->toOthers();
                } catch (\Throwable) {}
            }
        });

        return $order->fresh();
    }

    /**
     * Update order items (only allowed when status = pending).
     */
    public function updateItems(Order $order, array $items): Order
    {
        return DB::transaction(function () use ($order, $items) {
            $order->items()->delete();

            $total = 0;
            foreach ($items as $item) {
                $subtotal = $item['unit_price'] * $item['quantity'];
                $total += $subtotal;
                OrderItem::create([
                    'order_id'     => $order->id,
                    'menu_item_id' => $item['menu_item_id'],
                    'quantity'     => $item['quantity'],
                    'unit_price'   => $item['unit_price'],
                    'subtotal'     => $subtotal,
                    'notes'        => $item['notes'] ?? null,
                ]);
            }

            $order->update(['total_amount' => $total]);
            return $order->fresh('items.menuItem', 'table.floor');
        });
    }

    /**
     * Merge multiple orders into one target order.
     * Moves all items from source orders into the target, recalculates total, and cancels sources.
     */
    public function merge(Order $target, array $sourceIds): Order
    {
        return DB::transaction(function () use ($target, $sourceIds) {
            $sources = Order::with('items')->whereIn('id', $sourceIds)->get();

            foreach ($sources as $source) {
                // Move all items to the target order
                $source->items()->update(['order_id' => $target->id]);

                // Append source notes to target
                if ($source->notes) {
                    $target->notes = $target->notes
                        ? $target->notes . ' | ' . $source->notes
                        : $source->notes;
                }

                // Free source table if different from target
                if ($source->table_id && $source->table_id !== $target->table_id) {
                    Table::where('id', $source->table_id)->update([
                        'status'          => 'available',
                        'active_order_id' => null,
                    ]);
                    try {
                        broadcast(new TableStatusChanged($source->table_id, 'available', null))->toOthers();
                    } catch (\Throwable) {}
                }

                // Cancel the source order
                $source->update([
                    'status' => 'cancelled',
                    'notes'  => ($source->notes ? $source->notes . ' | ' : '') . 'ادغام شده با ' . $target->order_number,
                ]);
            }

            // Recalculate target total from all items
            $total = OrderItem::where('order_id', $target->id)->sum('subtotal');
            $target->update([
                'total_amount' => $total,
                'notes'        => $target->notes,
            ]);

            try {
                broadcast(new OrderStatusChanged($target->id, $target->status))->toOthers();
            } catch (\Throwable) {}

            return $target->fresh('items.menuItem', 'table.floor', 'creator');
        });
    }

    /**
     * Generate a unique order number like #1025.
     */
    private function generateOrderNumber(): string
    {
        $last = Order::max('id') ?? 1000;
        return '#' . ($last + 1);
    }

    /**
     * Slim order payload for WebSocket broadcast.
     */
    private function formatOrderForBroadcast(Order $order): array
    {
        return [
            'id'           => $order->id,
            'order_number' => $order->order_number,
            'status'       => $order->status,
            'total_amount' => $order->total_amount,
            'created_at'   => $order->created_at->toISOString(),
            'table'        => $order->table ? [
                'id'     => $order->table->id,
                'number' => $order->table->number,
                'name'   => $order->table->name,
            ] : null,
            'items' => $order->items->map(fn($item) => [
                'id'        => $item->id,
                'food_item' => ['id' => $item->menu_item_id, 'name' => $item->menuItem?->name ?? '—'],
                'quantity'  => $item->quantity,
                'notes'     => $item->notes,
            ])->all(),
        ];
    }
}
