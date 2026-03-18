<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class KitchenController extends Controller
{
    public function index(): Response
    {
        $activeOrders = Order::with('table.floor', 'items.menuItem')
            ->whereIn('status', ['pending', 'in_kitchen', 'ready'])
            ->orderBy('created_at')
            ->get()
            ->map(fn($o) => [
                'id'           => $o->id,
                'order_number' => $o->order_number,
                'status'       => $o->status,
                'table'        => $o->table ? ['number' => $o->table->number, 'name' => $o->table->name, 'floor_name' => $o->table->floor?->name] : null,
                'created_at'   => $o->created_at->toISOString(),
                'items'        => $o->items->map(fn($item) => [
                    'id'        => $item->id,
                    'food_item' => ['id' => $item->menu_item_id, 'name' => $item->menuItem?->name ?? '—'],
                    'quantity'  => $item->quantity,
                    'notes'     => $item->notes,
                ])->all(),
            ]);

        return Inertia::render('kitchen/index', [
            'orders' => $activeOrders,
        ]);
    }
}
