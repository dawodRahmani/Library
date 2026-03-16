# رستورانت برتر - Top Property Restaurant Management System

## Project Overview
A desktop-first restaurant management dashboard that works **online and offline**. Primary language is **Dari (RTL layout)** with easy translation support for other languages.

**Tech Stack:** Laravel + Inertia.js + React (based on existing project setup)

---

## Core Workflow

### 1. Customer Arrival
- Manager/Waiter opens the system on the restaurant computer
- Selects a **Table Number**
- Clicks **New Order (فرمایش جدید)**

### 2. Order Entry (ثبت فرمایش)
- Select food items from the menu list
- Set quantity for each item
- Add multiple food types per order
- System **auto-calculates** total price

### 3. Bill Generation (ایجاد بل)
Bill includes:
- Table number (شماره میز)
- List of food items (لیست غذاها)
- Quantity per item (تعداد)
- Price per item (قیمت هر غذا)
- Total price (مجموع قیمت)

Bill can be:
- **Printed** (Receipt Printer)
- **Saved** in the system

### 4. Kitchen Notification (اطلاع به آشپزخانه)
- After order submission, kitchen is notified
- Kitchen Monitor screen displays pending orders

### 5. Food Preparation (آماده شدن غذا)
- Chef prepares food
- Waiter delivers to the table

### 6. Payment (پرداخت حساب)
- Customer pays the bill
- Manager marks order as **Paid (پرداخت شد)**
- Table status returns to **Available (خالی)**

---

## System Modules

### 1. Food Menu Management (مدیریت غذاها)
- Add, edit, delete food items
- Set prices
- Categorize food items (e.g., appetizers, main dishes, drinks, desserts)
- Enable/disable items (out of stock)

### 2. Order Management (ثبت فرمایش مشتریان)
- Create new orders linked to a table
- Select food items + quantities
- Auto-calculate totals
- Order statuses: Pending → In Kitchen → Ready → Served → Paid
- Edit/cancel orders before kitchen processing

### 3. Table Management (مدیریت میزها)
- Register tables with numbers/names
- Table statuses: **Available (خالی)** / **Occupied (مصروف)**
- Visual table map/grid view
- Quick access to active orders per table

### 4. Expense Tracking (ثبت مصارف رستورانت)
- Record all restaurant expenses
- Categories: groceries, rent, electricity, gas, supplies, other
- Date-based tracking
- Monthly/daily expense summaries

### 5. Employee Management (ثبت کارمندان)
- Employee records: name, role, phone number, hire date
- Roles: Manager, Waiter, Chef, Cashier, etc.
- Active/inactive status

### 6. Salary Management (ثبت معاشات)
- Record salary payments per employee
- Payment date and amount
- Monthly salary tracking
- Payment history

### 7. Sales Reports (گزارش فروش)
- Daily sales report
- Monthly sales report
- Total revenue summaries
- Filter by date range
- Export capability (PDF/Print)

### 8. Kitchen Monitor (مانیتور آشپزخانه)
- Real-time display of all pending orders
- Show order details (table number, food items, quantities)
- Mark items as: Preparing → Ready
- Auto-refresh / live updates
- Designed for a separate screen in the kitchen

---

## Key Requirements

### Offline-First Architecture
- Application must work fully offline (most users will be offline)
- Local database (SQLite) for offline storage
- When online: sync data to server
- Conflict resolution strategy for sync

### RTL & Internationalization (i18n)
- Default language: **Dari** (RTL layout)
- Full RTL support in all UI components
- Translation system for easy addition of other languages (Pashto, English, etc.)
- All labels, messages, and UI text must be translatable

### Receipt Printing
- Support for thermal/receipt printers
- Print bills directly from the system
- Configurable receipt template
