<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Models\StockTransaction;
use App\Services\InventoryService;
use Inertia\Inertia;
use Inertia\Response;

class InventoryDashboardController extends Controller
{
    public function index(): Response
    {
        $alerts = InventoryService::getAlerts();

        $recentTransactions = StockTransaction::with('item', 'creator')
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit(8)
            ->get()
            ->map(fn($t) => [
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
            ]);

        // Stats — only active items
        $activeItems = InventoryItem::where('is_active', true)->get();
        $totalItems = $activeItems->count();
        $totalValue = (int) $activeItems->sum(fn($i) => $i->current_stock * $i->cost_per_unit);

        // Aggregate from DB directly (no loading all rows)
        $totalPurchases = (int) StockTransaction::where('type', 'stock_in')
            ->whereNotNull('total_cost')
            ->sum('total_cost');
        $totalWasteLoss = (int) StockTransaction::where('type', 'waste')
            ->get()
            ->sum(fn($t) => abs($t->quantity) * ($t->cost_per_unit ?? 0));

        return Inertia::render('inventory/index', [
            'alerts'             => $alerts,
            'recentTransactions' => $recentTransactions,
            'stats'              => [
                'totalItems'     => $totalItems,
                'totalValue'     => $totalValue,
                'totalPurchases' => $totalPurchases,
                'totalWasteLoss' => $totalWasteLoss,
                'lowStockCount'  => $alerts->count(),
                'criticalCount'  => $alerts->where('severity', 'critical')->count(),
            ],
        ]);
    }
}
