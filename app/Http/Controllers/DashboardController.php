<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Table;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = today();

        $todayOrders = Order::whereDate('created_at', $today)->get();
        $todaySales = $todayOrders->where('status', 'paid')->sum('total_amount');
        $todayOrderCount = $todayOrders->whereNotIn('status', ['cancelled'])->count();

        $activeTables = Table::where('status', 'occupied')->count();
        $totalTables = Table::count();
        $pendingOrders = Order::whereIn('status', ['pending', 'in_kitchen', 'ready'])->count();

        $monthStart = $today->copy()->startOfMonth();
        $monthlyRevenue = Order::where('status', 'paid')
            ->whereDate('paid_at', '>=', $monthStart)
            ->sum('total_amount');

        $recentOrders = Order::with('table', 'items')
            ->whereNotIn('status', ['cancelled'])
            ->orderByDesc('created_at')
            ->limit(8)
            ->get()
            ->map(fn($o) => [
                'id'           => $o->id,
                'order_number' => $o->order_number,
                'status'       => $o->status,
                'total_amount' => $o->total_amount,
                'table'        => $o->table ? ['number' => $o->table->number, 'name' => $o->table->name] : null,
                'created_at'   => $o->created_at->toISOString(),
                'items_count'  => $o->items->count(),
            ]);

        $tableStatuses = Table::with('floor')->orderBy('floor_id')->orderBy('number')->get()
            ->map(fn($t) => [
                'id'              => $t->id,
                'number'          => $t->number,
                'name'            => $t->name,
                'status'          => $t->status,
                'floor_id'        => $t->floor_id,
                'floor_name'      => $t->floor?->name ?? '',
                'active_order_id' => $t->active_order_id,
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'todaySales'     => $todaySales,
                'todayOrders'    => $todayOrderCount,
                'activeTables'   => $activeTables,
                'totalTables'    => $totalTables,
                'monthlyRevenue' => $monthlyRevenue,
                'pendingOrders'  => $pendingOrders,
            ],
            'recentOrders'  => $recentOrders,
            'tableStatuses' => $tableStatuses,
        ]);
    }
}
