<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PurchaseOrder;
use App\Models\Salary;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        // ── Date range ──────────────────────────────────────────
        $from = $request->filled('from')
            ? Carbon::parse($request->input('from'))->startOfDay()
            : today()->startOfMonth()->startOfDay();

        $to = $request->filled('to')
            ? Carbon::parse($request->input('to'))->endOfDay()
            : today()->endOfDay();

        // ── Previous period (same length) for variance ──────────
        $periodDays = (int) $from->diffInDays($to) + 1;
        $prevFrom   = $from->copy()->subDays($periodDays)->startOfDay();
        $prevTo     = $from->copy()->subSecond()->endOfDay();

        // ── Revenue ─────────────────────────────────────────────
        $totalRevenue = (float) Order::where('status', 'paid')
            ->whereBetween('paid_at', [$from, $to])
            ->sum('total_amount');

        $prevRevenue = (float) Order::where('status', 'paid')
            ->whereBetween('paid_at', [$prevFrom, $prevTo])
            ->sum('total_amount');

        $dailySales = Order::where('status', 'paid')
            ->whereBetween('paid_at', [$from, $to])
            ->selectRaw("DATE(paid_at) as date, COUNT(*) as orders_count, SUM(total_amount) as revenue")
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date'    => $row->date,
                'orders'  => (int) $row->orders_count,
                'revenue' => (float) $row->revenue,
            ]);

        // ── Expenses ─────────────────────────────────────────────
        $totalExpenses = (float) Expense::whereBetween('date', [$from->toDateString(), $to->toDateString()])
            ->sum('amount');

        $prevExpenses = (float) Expense::whereBetween('date', [$prevFrom->toDateString(), $prevTo->toDateString()])
            ->sum('amount');

        $expensesByCategory = Expense::whereBetween('date', [$from->toDateString(), $to->toDateString()])
            ->selectRaw('category, SUM(amount) as total, COUNT(*) as count')
            ->groupBy('category')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($row) => [
                'category' => $row->category,
                'total'    => (float) $row->total,
                'count'    => (int) $row->count,
            ]);

        // ── Salaries ─────────────────────────────────────────────
        $salariesPaid = Salary::with('employee')
            ->whereBetween('payment_date', [$from->toDateString(), $to->toDateString()])
            ->where('status', 'paid')
            ->get()
            ->map(fn ($s) => [
                'employee' => $s->employee?->name ?? '—',
                'month'    => $s->month,
                'amount'   => (float) $s->amount,
                'date'     => $s->payment_date?->toDateString(),
            ]);

        $totalSalaries = (float) $salariesPaid->sum('amount');

        $prevSalaries = (float) Salary::whereBetween('payment_date', [$prevFrom->toDateString(), $prevTo->toDateString()])
            ->where('status', 'paid')
            ->sum('amount');

        // ── Inventory Purchases ───────────────────────────────────
        $inventoryPurchases = PurchaseOrder::with('supplier')
            ->whereBetween('order_date', [$from->toDateString(), $to->toDateString()])
            ->whereNotIn('status', ['cancelled'])
            ->get()
            ->map(fn ($p) => [
                'po_number' => $p->po_number,
                'supplier'  => $p->supplier?->name ?? '—',
                'status'    => $p->status,
                'amount'    => (float) $p->total_amount,
                'date'      => $p->order_date?->toDateString(),
            ]);

        $totalInventory = (float) $inventoryPurchases->sum('amount');

        $prevInventory = (float) PurchaseOrder::whereBetween('order_date', [$prevFrom->toDateString(), $prevTo->toDateString()])
            ->whereNotIn('status', ['cancelled'])
            ->sum('total_amount');

        // ── Top Selling Items ─────────────────────────────────────
        $topItems = OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->where('orders.status', 'paid')
            ->whereBetween('orders.paid_at', [$from, $to])
            ->selectRaw('menu_items.name, SUM(order_items.quantity) as quantity, SUM(order_items.subtotal) as revenue')
            ->groupBy('menu_items.id', 'menu_items.name')
            ->orderByDesc('quantity')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'name'     => $row->name,
                'quantity' => (int) $row->quantity,
                'revenue'  => (float) $row->revenue,
            ]);

        $netProfit  = $totalRevenue - $totalExpenses - $totalSalaries;
        $prevProfit = $prevRevenue - $prevExpenses - $prevSalaries;

        return Inertia::render('reports/index', [
            'stats' => [
                'totalRevenue'   => $totalRevenue,
                'totalExpenses'  => $totalExpenses,
                'totalSalaries'  => $totalSalaries,
                'totalInventory' => $totalInventory,
                'netProfit'      => $netProfit,
                'prevRevenue'    => $prevRevenue,
                'prevExpenses'   => $prevExpenses,
                'prevSalaries'   => $prevSalaries,
                'prevInventory'  => $prevInventory,
                'prevProfit'     => $prevProfit,
            ],
            'dailySales'         => $dailySales,
            'expensesByCategory' => $expensesByCategory,
            'salaries'           => $salariesPaid,
            'inventoryPurchases' => $inventoryPurchases,
            'topItems'           => $topItems,
            'dateRange'          => [
                'from' => $from->toDateString(),
                'to'   => $to->toDateString(),
            ],
        ]);
    }
}
