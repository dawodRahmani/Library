<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Services\InventoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryItemController extends Controller
{
    public function index(Request $request): Response
    {
        $query = InventoryItem::where('is_active', true)->orderBy('name');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $items = $query->get()->map(fn($i) => $this->format($i));
        $alerts = InventoryService::getAlerts();

        return Inertia::render('inventory/items', [
            'items'  => $items,
            'alerts' => $alerts,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'           => 'required|string|max:100',
            'unit'           => 'required|in:kg,liter,piece,box,bag',
            'cost_per_unit'  => 'required|integer|min:0',
            'current_stock'  => 'required|numeric|min:0',
            'min_stock_level' => 'required|numeric|min:0',
            'category'       => 'required|string|max:50',
            'is_active'      => 'boolean',
        ]);

        InventoryItem::create($data);
        return back();
    }

    public function update(Request $request, InventoryItem $inventoryItem): RedirectResponse
    {
        $data = $request->validate([
            'name'           => 'required|string|max:100',
            'unit'           => 'required|in:kg,liter,piece,box,bag',
            'cost_per_unit'  => 'required|integer|min:0',
            'current_stock'  => 'required|numeric|min:0',
            'min_stock_level' => 'required|numeric|min:0',
            'category'       => 'required|string|max:50',
            'is_active'      => 'boolean',
        ]);

        $inventoryItem->update($data);
        return back();
    }

    public function destroy(InventoryItem $inventoryItem): RedirectResponse
    {
        $inventoryItem->delete();
        return back();
    }

    private function format(InventoryItem $i): array
    {
        return [
            'id'              => $i->id,
            'name'            => $i->name,
            'unit'            => $i->unit,
            'cost_per_unit'   => $i->cost_per_unit,
            'current_stock'   => (float) $i->current_stock,
            'min_stock_level' => (float) $i->min_stock_level,
            'category'        => $i->category,
            'is_active'       => $i->is_active,
            'last_restocked'  => $i->last_restocked?->toDateString(),
            'created_at'      => $i->created_at->toDateString(),
        ];
    }
}
