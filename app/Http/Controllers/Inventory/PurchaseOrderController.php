<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Supplier;
use App\Services\InventoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = PurchaseOrder::with('supplier', 'items')
            ->orderByDesc('order_date')
            ->orderByDesc('id');

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $orders = $query->get()->map(fn($o) => $this->format($o));
        $suppliers = Supplier::orderBy('name')->get()
            ->map(fn($s) => ['id' => $s->id, 'name' => $s->name]);
        $items = InventoryItem::where('is_active', true)->orderBy('name')->get()
            ->map(fn($i) => ['id' => $i->id, 'name' => $i->name, 'unit' => $i->unit, 'cost_per_unit' => $i->cost_per_unit]);

        return Inertia::render('inventory/purchase-orders', [
            'orders'    => $orders,
            'suppliers' => $suppliers,
            'items'     => $items,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'supplier_id'       => 'required|exists:suppliers,id',
            'order_date'        => 'nullable|date',
            'expected_delivery' => 'nullable|date',
            'notes'             => 'nullable|string|max:500',
            'items'             => 'required|array|min:1',
            'items.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'items.*.quantity'  => 'required|numeric|min:0.1',
            'items.*.unit_cost' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($data) {
            $poNumber = 'PO-' . now()->format('Y') . '-' . str_pad(PurchaseOrder::count() + 1, 3, '0', STR_PAD_LEFT);

            $total = collect($data['items'])->sum(fn($i) => $i['quantity'] * $i['unit_cost']);

            $po = PurchaseOrder::create([
                'po_number'         => $poNumber,
                'supplier_id'       => $data['supplier_id'],
                'status'            => 'draft',
                'total_amount'      => (int) $total,
                'order_date'        => $data['order_date'] ?? now()->toDateString(),
                'expected_delivery' => $data['expected_delivery'] ?? null,
                'notes'             => $data['notes'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                $invItem = InventoryItem::find($item['inventory_item_id']);
                PurchaseOrderItem::create([
                    'purchase_order_id'  => $po->id,
                    'inventory_item_id'  => $item['inventory_item_id'],
                    'inventory_item_name' => $invItem?->name ?? '—',
                    'quantity'           => $item['quantity'],
                    'unit'               => $invItem?->unit ?? 'kg',
                    'unit_cost'          => $item['unit_cost'],
                    'total_cost'         => (int) ($item['quantity'] * $item['unit_cost']),
                ]);
            }
        });

        return back();
    }

    public function update(Request $request, PurchaseOrder $purchaseOrder): RedirectResponse
    {
        $data = $request->validate([
            'status'            => 'required|in:draft,ordered,arrived,cancelled',
            'expected_delivery' => 'nullable|date',
            'notes'             => 'nullable|string|max:500',
        ]);

        $purchaseOrder->update($data);
        return back();
    }

    public function destroy(PurchaseOrder $purchaseOrder): RedirectResponse
    {
        $purchaseOrder->delete();
        return back();
    }

    public function markArrived(PurchaseOrder $purchaseOrder): RedirectResponse
    {
        if ($purchaseOrder->status === 'arrived') {
            return back();
        }

        InventoryService::markPOArrived($purchaseOrder);
        return back();
    }

    private function format(PurchaseOrder $o): array
    {
        return [
            'id'                => $o->id,
            'po_number'         => $o->po_number,
            'supplier_id'       => $o->supplier_id,
            'supplier_name'     => $o->supplier?->name ?? '—',
            'status'            => $o->status,
            'total_amount'      => $o->total_amount,
            'order_date'        => $o->order_date->toDateString(),
            'expected_delivery' => $o->expected_delivery?->toDateString(),
            'arrived_date'      => $o->arrived_date?->toDateString(),
            'notes'             => $o->notes,
            'items'             => $o->items->map(fn($i) => [
                'inventory_item_id'   => $i->inventory_item_id,
                'inventory_item_name' => $i->inventory_item_name,
                'quantity'            => (float) $i->quantity,
                'unit'                => $i->unit,
                'unit_cost'           => $i->unit_cost,
                'total_cost'          => $i->total_cost,
            ])->all(),
        ];
    }
}
