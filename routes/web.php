<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('users', 'users/index')->name('users.index');
    Route::inertia('roles', 'roles/index')->name('roles.index');
    Route::inertia('permissions', 'permissions/index')->name('permissions.index');

    // Tables
    Route::inertia('tables', 'tables/index')->name('tables.index');

    // Menu
    Route::inertia('menu', 'menu/index')->name('menu.index');
    Route::inertia('menu/categories', 'menu/categories')->name('menu.categories');

    // Kitchen
    Route::inertia('kitchen', 'kitchen/index')->name('kitchen.index');

    // Orders
    Route::inertia('orders', 'orders/index')->name('orders.index');
    Route::inertia('orders/create', 'orders/create')->name('orders.create');
    Route::inertia('orders/{id}', 'orders/show')->name('orders.show');

    // Expenses
    Route::inertia('expenses', 'expenses/index')->name('expenses.index');

    // Employees
    Route::inertia('employees', 'employees/index')->name('employees.index');
    Route::inertia('employees/{id}/salary', 'employees/salary')->name('employees.salary');

    // Reports
    Route::inertia('reports', 'reports/index')->name('reports.index');
});

require __DIR__.'/settings.php';
