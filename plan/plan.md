Phase 1 — Core Flow (Order Taking)
Tables page /tables — table grid with status cards
Menu page /menu + /menu/categories — food items & categories
New Order page /orders/create — split-view order creation (most complex page)
Order Detail page /orders/{id} — view order + status actions + print bill
Orders list page /orders — table with status filters
Phase 2 — Kitchen & Operations
Kitchen Monitor /kitchen — full-screen kanban board
Dashboard /dashboard — wire mock data into existing components
Phase 3 — Finance & HR
Expenses page /expenses — CRUD with filters
Employees page /employees — CRUD table
Salaries page /employees/{id}/salary — payment history
Phase 4 — Reporting
Reports page /reports — charts + data table
Phase 5 — Polish
Bill/Receipt print view
Settings (restaurant info, receipt config)
RTL fine-tuning
Responsive polish
The logic behind this order: Tables → Menu → Orders is the core restaurant workflow. Everything else depends on understanding that flow first. Kitchen monitor comes next since it consumes order data. Finance and reports come last since they're independent modules.

