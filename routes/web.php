<?php

use App\Http\Controllers\AccountingController;
use App\Http\Controllers\KioskController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\FloorController;
use App\Http\Controllers\Inventory\InventoryDashboardController;
use App\Http\Controllers\Inventory\InventoryItemController;
use App\Http\Controllers\Inventory\PurchaseOrderController;
use App\Http\Controllers\Inventory\StockTransactionController;
use App\Http\Controllers\Inventory\SupplierController;
use App\Http\Controllers\KitchenController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\PublicMenuController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SalaryController;
use App\Http\Controllers\TableController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login');

// Public routes (no auth)
Route::get('digital-menu', [PublicMenuController::class, 'index'])->name('digital-menu');
Route::get('kiosk', [KioskController::class, 'index'])->name('kiosk.index');
Route::post('kiosk/order', [KioskController::class, 'placeOrder'])->name('kiosk.order');

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ── Users ──────────────────────────────────────────────────
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::patch('users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggle-active');

    // ── Roles ───────────────────────────────────────────────────
    Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
    Route::post('roles', [RoleController::class, 'store'])->name('roles.store');
    Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
    Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
    Route::patch('roles/{role}/permissions', [RoleController::class, 'syncPermissions'])->name('roles.permissions');

    // ── Permissions (read-only) ─────────────────────────────────
    Route::get('permissions', [PermissionController::class, 'index'])->name('permissions.index');

    // ── Tables & Floors ────────────────────────────────────────
    Route::get('tables', [TableController::class, 'index'])->name('tables.index');
    Route::post('tables', [TableController::class, 'store'])->name('tables.store');
    Route::patch('tables/{table}', [TableController::class, 'update'])->name('tables.update');
    Route::delete('tables/{table}', [TableController::class, 'destroy'])->name('tables.destroy');
    Route::get('tables/qr-codes', function () {
        $tables = \App\Models\Table::with('floor')->orderBy('number')->get()->map(fn ($t) => [
            'id'         => $t->id,
            'number'     => $t->number,
            'name'       => $t->name,
            'capacity'   => $t->capacity,
            'status'     => $t->status,
            'floor_id'   => $t->floor_id,
            'floor_name' => $t->floor?->name ?? '',
        ]);
        return \Inertia\Inertia::render('tables/qr-codes', ['tables' => $tables]);
    })->name('tables.qr-codes');

    Route::post('floors', [FloorController::class, 'store'])->name('floors.store');
    Route::patch('floors/{floor}', [FloorController::class, 'update'])->name('floors.update');
    Route::delete('floors/{floor}', [FloorController::class, 'destroy'])->name('floors.destroy');

    // ── Menu ───────────────────────────────────────────────────
    Route::get('menu', [MenuItemController::class, 'index'])->name('menu.index');
    Route::post('menu/items', [MenuItemController::class, 'store'])->name('menu.items.store');
    Route::patch('menu/items/{menuItem}', [MenuItemController::class, 'update'])->name('menu.items.update');
    Route::delete('menu/items/{menuItem}', [MenuItemController::class, 'destroy'])->name('menu.items.destroy');
    Route::patch('menu/items/{menuItem}/availability', [MenuItemController::class, 'toggleAvailability'])->name('menu.items.availability');

    Route::get('menu/categories', [CategoryController::class, 'index'])->name('menu.categories');
    Route::post('menu/categories', [CategoryController::class, 'store'])->name('menu.categories.store');
    Route::patch('menu/categories/{category}', [CategoryController::class, 'update'])->name('menu.categories.update');
    Route::delete('menu/categories/{category}', [CategoryController::class, 'destroy'])->name('menu.categories.destroy');

    // ── Kitchen ────────────────────────────────────────────────
    Route::get('kitchen', [KitchenController::class, 'index'])->name('kitchen.index');

    // ── Orders ─────────────────────────────────────────────────
    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/create', [OrderController::class, 'create'])->name('orders.create');
    Route::post('orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('orders/{id}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('orders/{id}/edit', [OrderController::class, 'edit'])->name('orders.edit');
    Route::patch('orders/{order}', [OrderController::class, 'update'])->name('orders.update');
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
    Route::patch('orders/{order}/pay', [OrderController::class, 'pay'])->name('orders.pay');
    Route::post('orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');

    // ── Expenses ───────────────────────────────────────────────
    Route::get('expenses', [ExpenseController::class, 'index'])->name('expenses.index');
    Route::post('expenses', [ExpenseController::class, 'store'])->name('expenses.store');
    Route::patch('expenses/{expense}', [ExpenseController::class, 'update'])->name('expenses.update');
    Route::delete('expenses/{expense}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');

    // ── Employees ──────────────────────────────────────────────
    Route::get('employees', [EmployeeController::class, 'index'])->name('employees.index');
    Route::post('employees', [EmployeeController::class, 'store'])->name('employees.store');
    Route::patch('employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
    Route::delete('employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');
    Route::get('employees/{employee}/salary', [EmployeeController::class, 'salary'])->name('employees.salary');

    // ── Salaries ───────────────────────────────────────────────
    Route::get('salaries', [SalaryController::class, 'index'])->name('salaries.index');
    Route::post('salaries', [SalaryController::class, 'store'])->name('salaries.store');
    Route::patch('salaries/{salary}', [SalaryController::class, 'update'])->name('salaries.update');
    Route::delete('salaries/{salary}', [SalaryController::class, 'destroy'])->name('salaries.destroy');
    Route::patch('salaries/{salary}/pay', [SalaryController::class, 'markAsPaid'])->name('salaries.pay');

    // ── Accounting ─────────────────────────────────────────────
    Route::get('accounting', [AccountingController::class, 'index'])->name('accounting.index');

    // ── Inventory ──────────────────────────────────────────────
    Route::get('inventory', [InventoryDashboardController::class, 'index'])->name('inventory.index');

    Route::get('inventory/items', [InventoryItemController::class, 'index'])->name('inventory.items');
    Route::post('inventory/items', [InventoryItemController::class, 'store'])->name('inventory.items.store');
    Route::patch('inventory/items/{inventoryItem}', [InventoryItemController::class, 'update'])->name('inventory.items.update');
    Route::delete('inventory/items/{inventoryItem}', [InventoryItemController::class, 'destroy'])->name('inventory.items.destroy');

    Route::get('inventory/transactions', [StockTransactionController::class, 'index'])->name('inventory.transactions');
    Route::post('inventory/transactions', [StockTransactionController::class, 'store'])->name('inventory.transactions.store');

    Route::get('inventory/alerts', function () {
        $alerts = \App\Services\InventoryService::getAlerts();
        return \Inertia\Inertia::render('inventory/alerts', ['alerts' => $alerts]);
    })->name('inventory.alerts');

    Route::get('inventory/suppliers', [SupplierController::class, 'index'])->name('inventory.suppliers');
    Route::post('inventory/suppliers', [SupplierController::class, 'store'])->name('inventory.suppliers.store');
    Route::patch('inventory/suppliers/{supplier}', [SupplierController::class, 'update'])->name('inventory.suppliers.update');
    Route::delete('inventory/suppliers/{supplier}', [SupplierController::class, 'destroy'])->name('inventory.suppliers.destroy');

    Route::get('inventory/purchase-orders', [PurchaseOrderController::class, 'index'])->name('inventory.purchase-orders');
    Route::post('inventory/purchase-orders', [PurchaseOrderController::class, 'store'])->name('inventory.purchase-orders.store');
    Route::patch('inventory/purchase-orders/{purchaseOrder}', [PurchaseOrderController::class, 'update'])->name('inventory.purchase-orders.update');
    Route::delete('inventory/purchase-orders/{purchaseOrder}', [PurchaseOrderController::class, 'destroy'])->name('inventory.purchase-orders.destroy');
    Route::patch('inventory/purchase-orders/{purchaseOrder}/arrive', [PurchaseOrderController::class, 'markArrived'])->name('inventory.purchase-orders.arrive');

    // ── Reports & Finance ──────────────────────────────────────────
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('finance', [FinanceController::class, 'index'])->name('finance.index');

    // ── POS ────────────────────────────────────────────────────
    Route::get('pos', [PosController::class, 'index'])->name('pos.index');
    Route::post('pos/checkout', [PosController::class, 'checkout'])->name('pos.checkout');
});

require __DIR__.'/settings.php';
