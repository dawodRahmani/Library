<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Models\StockTransaction;
use App\Services\InventoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockTransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = StockTransaction::with('item', 'creator')
            ->orderByDesc('created_at')
            ->orderByDesc('id');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $query->whereHas('item', fn($q) => $q->where('name', 'like', '%' . $request->search . '%'))
                  ->orWhere('notes', 'like', '%' . $request->search . '%');
        }

        $transactions = $query->get()->map(fn($t) => $this->format($t));
        $items = InventoryItem::where('is_active', true)->orderBy('name')->get()
            ->map(fn($i) => ['id' => $i->id, 'name' => $i->name, 'unit' => $i->unit]);

        return Inertia::render('inventory/transactions', [
            'transactions' => $transactions,
            'items'        => $items,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'type'              => 'required|in:stock_in,stock_out,waste,adjustment',
            'quantity'          => 'required|numeric',
            'cost_per_unit'     => 'nullable|integer|min:0',
            'notes'             => 'nullable|string|max:500',
        ]);

        InventoryService::recordTransaction(array_merge($data, [
            'created_by' => auth()->id(),
        ]));

        return back();
    }

    private function format(StockTransaction $t): array
    {
        return [
            'id'                  => $t->id,
            'inventory_item_id'   => $t->inventory_item_id,
            'inventory_item_name' => $t->item?->name ?? '—',
            'type'                => $t->type,
            'quantity'            => (float) $t->quantity,
            'unit'                => $t->unit,
            'cost_per_unit'       => $t->cost_per_unit,
            'total_cost'          => $t->total_cost,
            'notes'               => $t->notes,
            'created_by_name'     => $t->creator?->name ?? '—',
            'created_at'          => $t->created_at->toDateString(),
        ];
    }
}
