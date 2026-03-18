<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Floor;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\Table;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orderService) {}

    public function index(Request $request): Response
    {
        $query = Order::with('table.floor', 'creator', 'items.menuItem')
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where('order_number', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $orders = $query->paginate(20)->through(fn($o) => $this->formatOrder($o));

        return Inertia::render('orders/index', [
            'orders'  => $orders,
            'filters' => $request->only(['status', 'search', 'date_from', 'date_to']),
        ]);
    }

    public function create(Request $request): Response
    {
        $floors = Floor::with('tables')->orderBy('order')->get();
        $tables = Table::with('floor')->orderBy('number')->get()
            ->map(fn($t) => [
                'id' => $t->id, 'number' => $t->number, 'name' => $t->name,
                'capacity' => $t->capacity, 'status' => $t->status,
                'active_order_id' => $t->active_order_id,
                'floor_id' => $t->floor_id, 'floor_name' => $t->floor?->name ?? '',
            ]);
        $categories = Category::orderBy('sort_order')->get();
        $items = MenuItem::with('category')->where('is_available', true)->orderBy('sort_order')->get()
            ->map(fn($i) => [
                'id' => $i->id, 'category_id' => $i->category_id,
                'category' => ['id' => $i->category->id, 'name' => $i->category->name, 'sort_order' => $i->category->sort_order],
                'name' => $i->name, 'price' => $i->price,
                'is_available' => $i->is_available, 'sort_order' => $i->sort_order, 'image' => $i->image,
            ]);

        $preselectedTable = $request->filled('table') ? (int) $request->table : null;

        return Inertia::render('orders/create', [
            'tables'           => $tables,
            'floors'           => $floors,
            'categories'       => $categories,
            'items'            => $items,
            'preselectedTable' => $preselectedTable,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'table_id'   => 'nullable|exists:tables,id',
            'order_type' => 'required|in:dine_in,takeaway,delivery',
            'notes'      => 'nullable|string|max:500',
            'items'      => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity'     => 'required|integer|min:1',
            'items.*.unit_price'   => 'required|integer|min:0',
            'items.*.notes'        => 'nullable|string|max:255',
        ]);

        $order = $this->orderService->create($data, auth()->id());

        return redirect()->route('orders.show', $order->id);
    }

    public function show(int $id): Response
    {
        $order = Order::with('table.floor', 'creator', 'items.menuItem')->findOrFail($id);

        return Inertia::render('orders/show', [
            'order' => $this->formatOrder($order),
        ]);
    }

    public function edit(int $id): Response
    {
        $order = Order::with('table.floor', 'items.menuItem')->findOrFail($id);
        $categories = Category::orderBy('sort_order')->get();
        $items = MenuItem::with('category')->where('is_available', true)->orderBy('sort_order')->get()
            ->map(fn($i) => [
                'id' => $i->id, 'category_id' => $i->category_id,
                'category' => ['id' => $i->category->id, 'name' => $i->category->name, 'sort_order' => $i->category->sort_order],
                'name' => $i->name, 'price' => $i->price,
                'is_available' => $i->is_available, 'sort_order' => $i->sort_order, 'image' => $i->image,
            ]);
        $tables = Table::with('floor')->orderBy('number')->get()
            ->map(fn($t) => [
                'id' => $t->id, 'number' => $t->number, 'name' => $t->name,
                'capacity' => $t->capacity, 'status' => $t->status,
                'active_order_id' => $t->active_order_id,
                'floor_id' => $t->floor_id, 'floor_name' => $t->floor?->name ?? '',
            ]);

        return Inertia::render('orders/edit', [
            'order'      => $this->formatOrder($order),
            'categories' => $categories,
            'items'      => $items,
            'tables'     => $tables,
        ]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $data = $request->validate([
            'table_id'   => 'nullable|exists:tables,id',
            'notes'      => 'nullable|string|max:500',
            'items'      => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity'     => 'required|integer|min:1',
            'items.*.unit_price'   => 'required|integer|min:0',
            'items.*.notes'        => 'nullable|string|max:255',
        ]);

        $this->orderService->updateItems($order, $data['items']);
        if (isset($data['notes'])) {
            $order->update(['notes' => $data['notes']]);
        }

        return redirect()->route('orders.show', $order->id);
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $request->validate(['status' => 'required|in:pending,in_kitchen,ready,served,paid,cancelled']);
        $this->orderService->transitionStatus($order, $request->status);
        return back();
    }

    public function pay(Order $order): RedirectResponse
    {
        $this->orderService->pay($order);
        return redirect()->route('orders.show', $order->id);
    }

    public function cancel(Request $request, Order $order): RedirectResponse
    {
        $request->validate(['reason' => 'nullable|string|max:255']);
        $this->orderService->cancel($order, $request->reason);
        return redirect()->route('orders.index');
    }

    private function formatOrder(Order $order): array
    {
        return [
            'id'               => $order->id,
            'table_id'         => $order->table_id,
            'table'            => $order->table ? [
                'id'         => $order->table->id,
                'number'     => $order->table->number,
                'name'       => $order->table->name,
                'capacity'   => $order->table->capacity,
                'status'     => $order->table->status,
                'floor_id'   => $order->table->floor_id,
                'floor_name' => $order->table->floor?->name ?? '',
            ] : null,
            'order_number'     => $order->order_number,
            'status'           => $order->status,
            'order_type'       => $order->order_type,
            'total_amount'     => $order->total_amount,
            'notes'            => $order->notes,
            'created_by'       => $order->created_by,
            'created_by_name'  => $order->creator?->name ?? '',
            'paid_at'          => $order->paid_at?->toISOString(),
            'created_at'       => $order->created_at->toISOString(),
            'items'            => $order->items->map(fn($item) => [
                'id'           => $item->id,
                'order_id'     => $item->order_id,
                'food_item_id' => $item->menu_item_id,
                'food_item'    => $item->menuItem ? [
                    'id'           => $item->menuItem->id,
                    'name'         => $item->menuItem->name,
                    'price'        => $item->menuItem->price,
                    'category_id'  => $item->menuItem->category_id,
                    'is_available' => $item->menuItem->is_available,
                    'sort_order'   => $item->menuItem->sort_order,
                ] : null,
                'quantity'     => $item->quantity,
                'unit_price'   => $item->unit_price,
                'subtotal'     => $item->subtotal,
                'notes'        => $item->notes,
            ])->all(),
        ];
    }
}
