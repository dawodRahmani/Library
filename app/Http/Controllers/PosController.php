<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Table;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class PosController extends Controller
{
    public function index(): Response
    {
        $items      = MenuItem::with('category')->orderBy('sort_order')->get();
        $categories = Category::orderBy('sort_order')->get(['id', 'name', 'sort_order']);
        $tables     = Table::with('floor')->where('status', 'available')->orderBy('number')->get();

        return Inertia::render('pos/index', [
            'items'      => $this->serializeItems($items),
            'categories' => $categories,
            'tables'     => $this->serializeTables($tables),
        ]);
    }

    public function checkout(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'table_id'              => 'nullable|exists:tables,id',
            'order_type'            => 'required|in:dine_in,takeaway,delivery',
            'items'                 => 'required|array|min:1',
            'items.*.menu_item_id'  => 'required|exists:menu_items,id',
            'items.*.quantity'      => 'required|integer|min:1',
            'payment_method'        => 'required|in:cash,card',
        ]);

        $items = collect($validated['items'])->map(function ($row) {
            $menuItem = MenuItem::findOrFail($row['menu_item_id']);
            return [
                'menu_item_id' => $row['menu_item_id'],
                'quantity'     => $row['quantity'],
                'unit_price'   => $menuItem->price,
            ];
        })->toArray();

        $service = new OrderService();
        $order   = $service->create([
            'table_id'   => $validated['table_id'] ?? null,
            'order_type' => $validated['order_type'],
            'items'      => $items,
            'notes'      => null,
        ], auth()->id());

        $service->pay($order);

        return back();
    }

    // ── Serializers ──────────────────────────────────────────────────

    private function serializeItems(Collection $items): array
    {
        return $items->map(fn ($item) => [
            'id'          => $item->id,
            'category_id' => $item->category_id,
            'category'    => $item->category ? [
                'id'         => $item->category->id,
                'name'       => $item->category->name,
                'sort_order' => $item->category->sort_order,
            ] : null,
            'name'         => $item->name,
            'price'        => (float) $item->price,
            'image'        => $item->image,
            'is_available' => $item->is_available,
            'sort_order'   => $item->sort_order,
        ])->values()->toArray();
    }

    private function serializeTables(Collection $tables): array
    {
        return $tables->map(fn ($t) => [
            'id'              => $t->id,
            'number'          => $t->number,
            'name'            => $t->name,
            'capacity'        => $t->capacity,
            'status'          => $t->status,
            'active_order_id' => $t->active_order_id,
            'floor_id'        => $t->floor_id,
            'floor_name'      => $t->floor?->name ?? '',
        ])->values()->toArray();
    }
}
