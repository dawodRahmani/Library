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

    // Dashboard — accessible to all authenticated users
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ── Users ──────────────────────────────────────────────────
    Route::middleware('permission:users.view')->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->middleware('permission:users.create')->name('users.store');
        Route::put('users/{user}', [UserController::class, 'update'])->middleware('permission:users.edit')->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->middleware('permission:users.delete')->name('users.destroy');
        Route::patch('users/{user}/toggle-active', [UserController::class, 'toggleActive'])->middleware('permission:users.edit')->name('users.toggle-active');
    });

    // ── Roles & Permissions ────────────────────────────────────
    Route::middleware('permission:settings.manage')->group(function () {
        Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
        Route::post('roles', [RoleController::class, 'store'])->name('roles.store');
        Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
        Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
        Route::patch('roles/{role}/permissions', [RoleController::class, 'syncPermissions'])->name('roles.permissions');
        Route::get('permissions', [PermissionController::class, 'index'])->name('permissions.index');
    });

    // ── Tables & Floors ────────────────────────────────────────
    Route::middleware('permission:tables.view')->group(function () {
        Route::get('tables', [TableController::class, 'index'])->name('tables.index');
        Route::post('tables', [TableController::class, 'store'])->middleware('permission:tables.create')->name('tables.store');
        Route::patch('tables/{table}', [TableController::class, 'update'])->middleware('permission:tables.edit')->name('tables.update');
        Route::delete('tables/{table}', [TableController::class, 'destroy'])->middleware('permission:tables.delete')->name('tables.destroy');
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

        Route::post('floors', [FloorController::class, 'store'])->middleware('permission:tables.create')->name('floors.store');
        Route::patch('floors/{floor}', [FloorController::class, 'update'])->middleware('permission:tables.edit')->name('floors.update');
        Route::delete('floors/{floor}', [FloorController::class, 'destroy'])->middleware('permission:tables.delete')->name('floors.destroy');
    });

    // ── Menu ───────────────────────────────────────────────────
    Route::middleware('permission:menu.view')->group(function () {
        Route::get('menu', [MenuItemController::class, 'index'])->name('menu.index');
        Route::post('menu/items', [MenuItemController::class, 'store'])->middleware('permission:menu.create')->name('menu.items.store');
        Route::patch('menu/items/{menuItem}', [MenuItemController::class, 'update'])->middleware('permission:menu.edit')->name('menu.items.update');
        Route::delete('menu/items/{menuItem}', [MenuItemController::class, 'destroy'])->middleware('permission:menu.delete')->name('menu.items.destroy');
        Route::patch('menu/items/{menuItem}/availability', [MenuItemController::class, 'toggleAvailability'])->middleware('permission:menu.edit')->name('menu.items.availability');

        Route::get('menu/categories', [CategoryController::class, 'index'])->name('menu.categories');
        Route::post('menu/categories', [CategoryController::class, 'store'])->middleware('permission:menu.create')->name('menu.categories.store');
        Route::patch('menu/categories/{category}', [CategoryController::class, 'update'])->middleware('permission:menu.edit')->name('menu.categories.update');
        Route::delete('menu/categories/{category}', [CategoryController::class, 'destroy'])->middleware('permission:menu.delete')->name('menu.categories.destroy');
    });

    // ── Kitchen ────────────────────────────────────────────────
    Route::get('kitchen', [KitchenController::class, 'index'])->middleware('permission:kitchen.view')->name('kitchen.index');

    // ── Orders ─────────────────────────────────────────────────
    Route::middleware('permission:orders.view')->group(function () {
        Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('orders/create', [OrderController::class, 'create'])->middleware('permission:orders.create')->name('orders.create');
        Route::post('orders', [OrderController::class, 'store'])->middleware('permission:orders.create')->name('orders.store');
        Route::get('orders/active', [OrderController::class, 'active'])->name('orders.active');
        Route::get('orders/{id}', [OrderController::class, 'show'])->name('orders.show');
        Route::get('orders/{id}/edit', [OrderController::class, 'edit'])->middleware('permission:orders.edit')->name('orders.edit');
        Route::patch('orders/{order}', [OrderController::class, 'update'])->middleware('permission:orders.edit')->name('orders.update');
        Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->middleware('permission:orders.manage_status')->name('orders.status');
        Route::patch('orders/{order}/pay', [OrderController::class, 'pay'])->middleware('permission:orders.manage_status')->name('orders.pay');
        Route::post('orders/merge', [OrderController::class, 'merge'])->middleware('permission:orders.edit')->name('orders.merge');
        Route::post('orders/{order}/cancel', [OrderController::class, 'cancel'])->middleware('permission:orders.manage_status')->name('orders.cancel');
    });

    // ── Expenses ───────────────────────────────────────────────
    Route::middleware('permission:expenses.view')->group(function () {
        Route::get('expenses', [ExpenseController::class, 'index'])->name('expenses.index');
        Route::post('expenses', [ExpenseController::class, 'store'])->middleware('permission:expenses.create')->name('expenses.store');
        Route::post('expenses/categories', [ExpenseController::class, 'storeCategory'])->middleware('permission:expenses.create')->name('expenses.categories.store');
        Route::patch('expenses/{expense}', [ExpenseController::class, 'update'])->middleware('permission:expenses.edit')->name('expenses.update');
        Route::delete('expenses/{expense}', [ExpenseController::class, 'destroy'])->middleware('permission:expenses.delete')->name('expenses.destroy');
    });

    // ── Employees ──────────────────────────────────────────────
    Route::middleware('permission:employees.view')->group(function () {
        Route::get('employees', [EmployeeController::class, 'index'])->name('employees.index');
        Route::post('employees', [EmployeeController::class, 'store'])->middleware('permission:employees.create')->name('employees.store');
        Route::patch('employees/{employee}', [EmployeeController::class, 'update'])->middleware('permission:employees.edit')->name('employees.update');
        Route::delete('employees/{employee}', [EmployeeController::class, 'destroy'])->middleware('permission:employees.delete')->name('employees.destroy');
        Route::get('employees/{employee}/salary', [EmployeeController::class, 'salary'])->name('employees.salary');
    });

    // ── Salaries ───────────────────────────────────────────────
    Route::middleware('permission:salaries.view')->group(function () {
        Route::get('salaries', [SalaryController::class, 'index'])->name('salaries.index');
        Route::post('salaries', [SalaryController::class, 'store'])->middleware('permission:salaries.create')->name('salaries.store');
        Route::patch('salaries/{salary}', [SalaryController::class, 'update'])->middleware('permission:salaries.edit')->name('salaries.update');
        Route::delete('salaries/{salary}', [SalaryController::class, 'destroy'])->middleware('permission:salaries.delete')->name('salaries.destroy');
        Route::patch('salaries/{salary}/pay', [SalaryController::class, 'markAsPaid'])->middleware('permission:salaries.edit')->name('salaries.pay');
    });

    // ── Accounting ─────────────────────────────────────────────
    Route::middleware('permission:finance.view')->group(function () {
        Route::get('accounting', [AccountingController::class, 'index'])->name('accounting.index');
        Route::post('accounting/fund', [AccountingController::class, 'addFund'])->name('accounting.fund');
    });

    // ── Inventory ──────────────────────────────────────────────
    Route::middleware('permission:inventory.view')->group(function () {
        Route::get('inventory', [InventoryDashboardController::class, 'index'])->name('inventory.index');

        Route::get('inventory/items', [InventoryItemController::class, 'index'])->name('inventory.items');
        Route::post('inventory/items', [InventoryItemController::class, 'store'])->middleware('permission:inventory.create')->name('inventory.items.store');
        Route::post('inventory/categories', [InventoryItemController::class, 'storeCategory'])->middleware('permission:inventory.create')->name('inventory.categories.store');
        Route::post('inventory/units', [InventoryItemController::class, 'storeUnit'])->middleware('permission:inventory.create')->name('inventory.units.store');
        Route::patch('inventory/items/{inventoryItem}', [InventoryItemController::class, 'update'])->middleware('permission:inventory.edit')->name('inventory.items.update');
        Route::delete('inventory/items/{inventoryItem}', [InventoryItemController::class, 'destroy'])->middleware('permission:inventory.delete')->name('inventory.items.destroy');

        Route::get('inventory/transactions', [StockTransactionController::class, 'index'])->name('inventory.transactions');
        Route::post('inventory/transactions', [StockTransactionController::class, 'store'])->middleware('permission:inventory.create')->name('inventory.transactions.store');

        Route::get('inventory/alerts', function () {
            $alerts = \App\Services\InventoryService::getAlerts();
            return \Inertia\Inertia::render('inventory/alerts', ['alerts' => $alerts]);
        })->name('inventory.alerts');

        Route::get('inventory/suppliers', [SupplierController::class, 'index'])->name('inventory.suppliers');
        Route::post('inventory/suppliers', [SupplierController::class, 'store'])->middleware('permission:inventory.create')->name('inventory.suppliers.store');
        Route::patch('inventory/suppliers/{supplier}', [SupplierController::class, 'update'])->middleware('permission:inventory.edit')->name('inventory.suppliers.update');
        Route::delete('inventory/suppliers/{supplier}', [SupplierController::class, 'destroy'])->middleware('permission:inventory.delete')->name('inventory.suppliers.destroy');

        Route::get('inventory/purchase-orders', [PurchaseOrderController::class, 'index'])->name('inventory.purchase-orders');
        Route::post('inventory/purchase-orders', [PurchaseOrderController::class, 'store'])->middleware('permission:inventory.create')->name('inventory.purchase-orders.store');
        Route::patch('inventory/purchase-orders/{purchaseOrder}', [PurchaseOrderController::class, 'update'])->middleware('permission:inventory.edit')->name('inventory.purchase-orders.update');
        Route::delete('inventory/purchase-orders/{purchaseOrder}', [PurchaseOrderController::class, 'destroy'])->middleware('permission:inventory.delete')->name('inventory.purchase-orders.destroy');
        Route::patch('inventory/purchase-orders/{purchaseOrder}/arrive', [PurchaseOrderController::class, 'markArrived'])->middleware('permission:inventory.edit')->name('inventory.purchase-orders.arrive');
    });

    // ── Reports & Finance ──────────────────────────────────────────
    Route::get('reports', [ReportController::class, 'index'])->middleware('permission:reports.view')->name('reports.index');
    Route::get('finance', [FinanceController::class, 'index'])->middleware('permission:finance.view')->name('finance.index');

    // ── POS ────────────────────────────────────────────────────
    Route::middleware('permission:orders.create')->group(function () {
        Route::get('pos', [PosController::class, 'index'])->name('pos.index');
        Route::post('pos/checkout', [PosController::class, 'checkout'])->name('pos.checkout');
    });
});

require __DIR__.'/settings.php';
