<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\InventoryCategory;
use App\Models\InventoryItem;
use App\Models\InventoryUnit;
use App\Services\InventoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InventoryItemController extends Controller
{
    public function index(Request $request): Response
    {
        $query = InventoryItem::with(['inventoryCategory', 'inventoryUnit'])
            ->where('is_active', true)
            ->orderBy('name');

        if ($request->filled('category')) {
            $query->where('inventory_category_id', $request->category);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $items = $query->get()->map(fn($i) => $this->format($i));
        $alerts = InventoryService::getAlerts();

        $categories = InventoryCategory::orderBy('name')->get()->map(fn($c) => [
            'id'   => $c->id,
            'name' => $c->name,
            'slug' => $c->slug,
        ]);

        $units = InventoryUnit::orderBy('name')->get()->map(fn($u) => [
            'id'   => $u->id,
            'name' => $u->name,
            'slug' => $u->slug,
        ]);

        return Inertia::render('inventory/items', [
            'items'      => $items,
            'alerts'     => $alerts,
            'categories' => $categories,
            'units'      => $units,
        ]);
    }

    public function storeCategory(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
        ]);

        InventoryCategory::create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name'], '-'),
        ]);

        return back();
    }

    public function storeUnit(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
        ]);

        InventoryUnit::create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name'], '-'),
        ]);

        return back();
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'                  => 'required|string|max:100',
            'inventory_unit_id'     => 'required|exists:inventory_units,id',
            'cost_per_unit'         => 'required|integer|min:0',
            'current_stock'         => 'required|numeric|min:0',
            'min_stock_level'       => 'required|numeric|min:0',
            'inventory_category_id' => 'required|exists:inventory_categories,id',
            'is_active'             => 'boolean',
        ]);

        $data['unit']     = InventoryUnit::find($data['inventory_unit_id'])?->slug ?? 'piece';
        $data['category'] = InventoryCategory::find($data['inventory_category_id'])?->slug ?? 'other';

        InventoryItem::create($data);
        return back();
    }

    public function update(Request $request, InventoryItem $inventoryItem): RedirectResponse
    {
        $data = $request->validate([
            'name'                  => 'required|string|max:100',
            'inventory_unit_id'     => 'required|exists:inventory_units,id',
            'cost_per_unit'         => 'required|integer|min:0',
            'current_stock'         => 'required|numeric|min:0',
            'min_stock_level'       => 'required|numeric|min:0',
            'inventory_category_id' => 'required|exists:inventory_categories,id',
            'is_active'             => 'boolean',
        ]);

        $data['unit']     = InventoryUnit::find($data['inventory_unit_id'])?->slug ?? 'piece';
        $data['category'] = InventoryCategory::find($data['inventory_category_id'])?->slug ?? 'other';

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
            'id'                    => $i->id,
            'name'                  => $i->name,
            'unit'                  => $i->inventoryUnit?->slug ?? $i->unit,
            'unit_name'             => $i->inventoryUnit?->name ?? $i->unit,
            'inventory_unit_id'     => $i->inventory_unit_id,
            'cost_per_unit'         => $i->cost_per_unit,
            'current_stock'         => (float) $i->current_stock,
            'min_stock_level'       => (float) $i->min_stock_level,
            'category'              => $i->inventoryCategory?->slug ?? $i->category,
            'category_name'         => $i->inventoryCategory?->name ?? $i->category,
            'inventory_category_id' => $i->inventory_category_id,
            'is_active'             => $i->is_active,
            'last_restocked'        => $i->last_restocked?->toDateString(),
            'created_at'            => $i->created_at->toDateString(),
        ];
    }
}
