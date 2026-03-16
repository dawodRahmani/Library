# Module Details

## 1. Food Menu Management (مدیریت غذاها)

### Features
- CRUD operations for food items
- CRUD operations for categories
- Set price per item
- Upload food image (optional)
- Toggle availability (in stock / out of stock)
- Drag-and-drop sort order

### UI
- Grid/card view of food items grouped by category
- Quick edit inline
- Search/filter by name or category

---

## 2. Order Management (ثبت فرمایش مشتریان)

### Features
- Create new order → select table → add food items
- Food selection: browse by category or search
- Set quantity with +/- buttons
- Auto-calculate subtotals and total
- Add notes per item (e.g., "no salt", "extra spicy")
- Order statuses: pending → in_kitchen → ready → served → paid → cancelled
- Edit order (add/remove items) before kitchen processing
- Cancel order with reason

### UI
- Split view: left = menu items, right = current order summary
- Running total always visible
- Quick category tabs at top
- Big, touch-friendly buttons (for possible tablet use)

---

## 3. Table Management (مدیریت میزها)

### Features
- Add/edit/delete tables
- Set table number, name, capacity
- Visual status: green = available, red = occupied
- Click table → see active order or create new order
- Auto-update status when order is created/paid

### UI
- Grid layout showing all tables as cards
- Color-coded status
- Click to open order

---

## 4. Expense Tracking (ثبت مصارف رستورانت)

### Features
- Record expenses with: category, description, amount, date
- Categories: groceries, rent, electricity, gas, supplies, other
- List view with filters (date range, category)
- Daily/monthly expense totals
- Edit/delete expenses

### UI
- Table list with filters
- Add expense modal/form
- Summary cards at top (today, this month, total)

---

## 5. Employee Management (ثبت کارمندان)

### Features
- Add/edit employees: name, role, phone, hire date
- Roles: manager, waiter, chef, cashier
- Active/inactive toggle
- View employee's salary history

### UI
- Table list of employees
- Click to view/edit details
- Link to salary records

---

## 6. Salary Management (ثبت معاشات)

### Features
- Record salary payment: employee, amount, date, month
- View payment history per employee
- Monthly salary summary (total paid)
- Notes per payment

### UI
- Accessed from employee detail page
- Table of payments with add button
- Monthly summary view

---

## 7. Sales Reports (گزارش فروش)

### Features
- Daily sales: total orders, total revenue, items sold
- Monthly sales summary
- Date range filter
- Top selling items
- Revenue vs expenses comparison
- Print / export reports

### UI
- Dashboard-style with charts (bar chart for daily, line chart for monthly)
- Summary cards: today's revenue, this month, total
- Filterable data table below charts

---

## 8. Kitchen Monitor (مانیتور آشپزخانه)

### Features
- Full-screen view for kitchen display
- Show all pending/in-progress orders
- Each order card shows: table number, items, quantities, time elapsed
- Mark individual items or full order as "Ready"
- Auto-refresh (poll every few seconds or use WebSocket)
- Color coding: new = yellow, preparing = orange, ready = green
- Audio notification for new orders (optional)

### UI
- Kanban-style columns: New Orders | Preparing | Ready
- Large text, high contrast (readable from distance)
- No navigation bar (full-screen kitchen mode)
- Touch-friendly for kitchen screens
