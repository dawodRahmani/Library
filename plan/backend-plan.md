# Backend Implementation Plan — رستورانت برتر

## Overview
Frontend is 100% complete with mock data. This plan replaces mock data with a real Laravel backend.
Tech: Laravel 12 + SQLite + Inertia.js + Laravel Reverb (WebSockets) + Queue worker.

---

## Architecture

### Modular Controller Structure
```
app/Http/Controllers/
  TableController.php
  FloorController.php
  CategoryController.php
  MenuItemController.php
  OrderController.php
  ExpenseController.php
  EmployeeController.php
  SalaryController.php
  Inventory/
    InventoryItemController.php
    StockTransactionController.php
    SupplierController.php
    PurchaseOrderController.php
  FinanceController.php
  ReportController.php
  AccountingController.php
  PosController.php
  PublicMenuController.php
  KioskController.php

app/Services/
  OrderService.php       — order creation, status transitions, payment
  LedgerService.php      — auto-creates ledger entries from all events
  InventoryService.php   — stock management, alert generation, PO arrival

app/Events/
  NewOrderCreated.php        — broadcast to kitchen channel
  OrderStatusChanged.php     — broadcast to kitchen channel
  TableStatusChanged.php     — broadcast to restaurant channel
```

---

## Phase 1 — Core Flow (Tables + Menu + Orders) ✅ COMPLETE
**A waiter can log in, see tables, create an order, and pay it.**

### Migrations
| File | Table | Key columns |
|------|-------|-------------|
| create_floors_table | floors | id, name, description, color, order |
| create_tables_table | tables | id, floor_id(FK), number, name, capacity, status(enum: available/occupied), active_order_id(nullable) |
| create_categories_table | categories | id, name, sort_order |
| create_menu_items_table | menu_items | id, category_id(FK), name, price, image(nullable), is_available, sort_order |
| create_orders_table | orders | id, table_id(nullable FK), order_number(unique), status(enum), order_type(enum: dine_in/takeaway/delivery), total_amount, notes, created_by(FK users), paid_at(nullable) |
| create_order_items_table | order_items | id, order_id(FK), menu_item_id(FK), quantity, unit_price, subtotal, notes |

### Models
- `Floor` → hasMany Tables
- `Table` → belongsTo Floor, hasOne Order (active)
- `Category` → hasMany MenuItems
- `MenuItem` → belongsTo Category
- `Order` → belongsTo Table, belongsTo User, hasMany OrderItems
- `OrderItem` → belongsTo Order, belongsTo MenuItem

### OrderService
```php
create(array $data): Order        // generates ORD-XXXX, locks table to occupied
transitionStatus(Order, status): Order
pay(Order, string $method): Order // sets paid_at, frees table, fires event, creates ledger income
cancel(Order, string $reason): Order // frees table
```

### Controllers
- `TableController` (index, store, update, destroy) — index returns floors + tables
- `FloorController` (store, update, destroy)
- `CategoryController` (index, store, update, destroy)
- `MenuItemController` (index, store, update, destroy, toggleAvailability)
- `OrderController` (index, store, show, updateStatus, pay, cancel)

### Seeder
- 4 floors, 10 tables, 4 categories, 12 menu items (matching mock data)

### Frontend Integration
Replace mock imports in pages with `usePage().props`:
- `pages/tables/index.tsx` → receives `tables`, `floors`
- `pages/menu/index.tsx` → receives `items`, `categories`
- `pages/menu/categories.tsx` → receives `categories`
- `pages/orders/index.tsx` → receives `orders`
- `pages/orders/create.tsx` → receives `tables`, `categories`, `items`
- `pages/orders/show.tsx` → receives `order`
- `pages/orders/edit.tsx` → receives `order`, `tables`, `items`
- `pages/dashboard.tsx` → receives `stats`, `recent_orders`, `table_statuses`

---

## Phase 2 — Real-Time (Kitchen + Live Tables) ✅ COMPLETE
**Kitchen screen auto-updates. Table status is live.**

### Install
```bash
php artisan install:broadcasting   # installs Reverb
npm install --save-dev laravel-echo pusher-js
```

### Events (all implement ShouldBroadcast)
- `NewOrderCreated` → broadcasts on `private-kitchen`
- `OrderStatusChanged` → broadcasts on `private-kitchen`
- `TableStatusChanged` → broadcasts on `private-restaurant`

### Fire from OrderService
- `create()` → fires NewOrderCreated
- `transitionStatus()` → fires OrderStatusChanged + TableStatusChanged
- `pay()` → fires TableStatusChanged (table becomes available)

### Channel Authorization (routes/channels.php)
```php
Broadcast::channel('kitchen', fn($user) => $user !== null);
Broadcast::channel('restaurant', fn($user) => $user !== null);
```

### Frontend (kitchen/index.tsx)
```typescript
Echo.private('kitchen')
  .listen('NewOrderCreated', (e) => addOrder(e.order))
  .listen('OrderStatusChanged', (e) => updateStatus(e.order_id, e.status))
```

---

## Phase 3 — Finance & HR (Expenses, Employees, Salaries, Ledger)

### Migrations
| Table | Key columns |
|-------|-------------|
| employees | id, name, role(enum), phone, hire_date, is_active, base_salary |
| salaries | id, employee_id(FK), month(char 7), base_amount, bonuses, deductions, amount, status(enum), payment_date(nullable), notes |
| expenses | id, category(enum), description, amount, date, notes, created_by(FK) |
| ledger_entries | id, date, type(enum: income/expense/salary/inventory_purchase), reference, description, amount, direction(enum: in/out), category(nullable) |

### LedgerService (auto-creates entries)
Called by:
- `OrderService::pay()` → income entry
- `ExpenseController::store()` → expense entry
- `SalaryController::markAsPaid()` → salary entry
- `InventoryService::markPOArrived()` → inventory_purchase entry

### Frontend Integration
- `pages/expenses/index.tsx` → receives `expenses`
- `pages/employees/index.tsx` → receives `employees`
- `pages/salaries/index.tsx` → receives `salaries`, `employees`
- `pages/accounting/index.tsx` → receives `entries`, `summary`

---

## Phase 4 — Inventory + Suppliers + Purchase Orders

### Migrations
| Table | Key columns |
|-------|-------------|
| suppliers | id, name, contact_name, phone, address, category, notes |
| inventory_items | id, name, unit(enum), cost_per_unit, current_stock, min_stock_level, category, is_active, last_restocked(nullable) |
| stock_transactions | id, inventory_item_id(FK), type(enum), quantity, unit, cost_per_unit(nullable), total_cost(nullable), notes, created_by(FK) |
| purchase_orders | id, po_number(unique), supplier_id(FK), status(enum), total_amount, order_date, expected_delivery, arrived_date(nullable), notes |
| purchase_order_items | id, purchase_order_id(FK), inventory_item_id(FK), inventory_item_name, quantity, unit, unit_cost, total_cost |

### InventoryService
```php
recordTransaction(array $data): StockTransaction  // updates current_stock
getAlerts(): Collection                           // items below min_stock_level
markPOArrived(PurchaseOrder $po): void            // creates stock_in transactions + ledger entry
```

### Frontend Integration
- `pages/inventory/index.tsx`, `items.tsx`, `transactions.tsx`, `alerts.tsx`
- `pages/inventory/suppliers.tsx`
- `pages/inventory/purchase-orders.tsx`

---

## Phase 5 — Reports, Finance Dashboard, Accounting

### Controllers (read-only, computed from existing data)
- `FinanceController::index()` — aggregates orders + expenses + salaries by month
- `ReportController::sales()` — groups orders by date
- `ReportController::topItems()` — groups order_items by menu_item
- `AccountingController::index()` — returns ledger_entries with running balance computed in PHP

### Frontend Integration
- `pages/finance/index.tsx` → receives `summary`, `daily_cash_flow`, `expense_breakdown`
- `pages/reports/index.tsx` → receives `daily_sales`, `top_items`
- `pages/accounting/index.tsx` → receives real entries from DB

---

## Phase 6 — POS, Digital Menu, Kiosk

### POS
- `PosController::index()` — menu + tables (authenticated)
- `PosController::checkout()` — creates + immediately pays order via OrderService

### Public Pages (no auth)
- `PublicMenuController::index()` — available menu items (no auth)
- `KioskController::index()` — menu + tables (no auth)
- `KioskController::placeOrder()` — creates order via OrderService (type='kiosk')

---

## Hosting Setup (Production)

### .env
```
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=restaurant-app
REVERB_APP_KEY=generated-key
REVERB_APP_SECRET=generated-secret
REVERB_HOST=your-domain.com
REVERB_PORT=8080
REVERB_SCHEME=https
```

### Processes (via Supervisor)
```
php artisan reverb:start --port=8080    # WebSocket server
php artisan queue:work                  # Background jobs
```

### Nginx Proxy
```nginx
# Laravel app
location / { try_files $uri $uri/ /index.php?$query_string; }

# Reverb WebSocket
location /app { proxy_pass http://localhost:8080; proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; }
```

---

## Summary

| Phase | What | When backend wires in |
|-------|------|-----------------------|
| 1 | Tables + Menu + Orders | Core restaurant workflow |
| 2 | Real-time (Reverb) | Kitchen display goes live |
| 3 | Expenses + Employees + Salaries + Ledger | Finance tracking |
| 4 | Inventory + Suppliers + POs | Stock management |
| 5 | Reports + Finance Dashboard + Accounting | Analytics |
| 6 | POS + Digital Menu + Kiosk | Customer-facing + cashier |
