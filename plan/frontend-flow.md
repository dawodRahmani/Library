# Frontend Flow & Page-by-Page Specification

> This document defines how every page looks and behaves from a **frontend-only** perspective.
> All data is **hardcoded/mock** for now. Backend integration comes after approval.

---

## Global Layout

### Sidebar (right side — RTL)
Already built in `app-sidebar.tsx`. Navigation items:
1. داشبورد (Dashboard)
2. فرمایشات (Orders)
3. میزها (Tables)
4. مینو (Menu)
5. آشپزخانه (Kitchen)
6. مصارف (Expenses)
7. کارمندان (Employees)
8. معاشات (Salaries)
9. گزارشات (Reports)
10. تنظیمات (Settings)

### Header
- Breadcrumb navigation
- Language switcher (Dari / English)
- User avatar + dropdown (profile, logout)

---

## 1. Dashboard — `/dashboard` (داشبورد)

**Purpose:** At-a-glance overview of today's restaurant status.

### Layout
```
┌─────────────────────────────────────────────────┐
│  [فروش امروز]  [فرمایشات امروز]  [میز فعال]  [عواید ماهانه]  │
│   12,500 ؋         8              3/10        85,000 ؋       │
├────────────────────────┬────────────────────────┤
│   آخرین فرمایشات       │    وضعیت میزها          │
│   (Recent Orders)      │    (Table Status)       │
│                        │                         │
│   #1024 - میز 3        │    [1 🟢] [2 🔴] [3 🟢] │
│   کابلی پلو x2         │    [4 🟢] [5 🟢] [6 🔴] │
│   مرغ کبابی x1         │    [7 🟢] [8 🟢] [9 🟢] │
│   وضعیت: در آشپزخانه   │    [10 🟢]              │
│                        │                         │
│   #1023 - میز 7        │    🟢 خالی  🔴 مصروف    │
│   چلو کباب x3          │                         │
│   وضعیت: پرداخت شد     │                         │
└────────────────────────┴────────────────────────┘
```

### Components
- **StatCard** (already built) — 4 cards in a row with icon, title, value
- **RecentOrders** — List of last 5-10 orders with: order#, table#, items summary, status badge
- **TableStatusGrid** — Small grid of table cards, color-coded (green=available, red=occupied), clicking a table goes to its order or `/tables`

### Mock Data
```ts
const mockStats = {
  todaySales: '12,500 ؋',
  todayOrders: 8,
  activeTables: '3/10',
  monthlyRevenue: '85,000 ؋',
};

const mockRecentOrders = [
  { id: 1024, table: 3, items: 'کابلی پلو x2, مرغ کبابی x1', total: '1,800 ؋', status: 'in_kitchen' },
  { id: 1023, table: 7, items: 'چلو کباب x3', total: '2,100 ؋', status: 'paid' },
  { id: 1022, table: 1, items: 'بولانی x4, چای x4', total: '600 ؋', status: 'served' },
];

const mockTables = [
  { id: 1, number: 1, status: 'available' },
  { id: 2, number: 2, status: 'occupied' },
  // ...
];
```

### Interactions
- Click a stat card → navigate to relevant page (sales→reports, orders→orders, tables→tables)
- Click a recent order → navigate to order detail
- Click a table → navigate to that table's active order or table management

---

## 2. Orders — `/orders` (فرمایشات)

**Purpose:** View all orders, filter by status, create new orders.

### Layout
```
┌─────────────────────────────────────────────────┐
│  [فرمایش جدید +]                 🔍 جستجو...    │
├─────────────────────────────────────────────────┤
│  فیلترها: [همه] [در انتظار] [آشپزخانه] [آماده] [سرو شده] [پرداخت شد] │
├─────────────────────────────────────────────────┤
│  # شماره  │ میز  │ آیتم‌ها        │ مبلغ     │ وضعیت       │ تاریخ     │
│  1024     │ 3    │ 3 آیتم        │ 1,800 ؋  │ 🟡 آشپزخانه │ 14:30    │
│  1023     │ 7    │ 1 آیتم        │ 2,100 ؋  │ 🟢 پرداخت شد│ 13:45    │
│  1022     │ 1    │ 2 آیتم        │ 600 ؋    │ 🔵 سرو شده  │ 13:20    │
└─────────────────────────────────────────────────┘
```

### Components
- **OrderFilters** — Horizontal tab/badge filters for status (all, pending, in_kitchen, ready, served, paid, cancelled)
- **OrdersTable** — Data table with columns: order#, table#, item count, total, status badge, time
- **NewOrderButton** — Primary action button → navigates to `/orders/create`

### Status Badges & Colors
| Status | Dari | Color |
|--------|------|-------|
| pending | در انتظار | Gray |
| in_kitchen | در آشپزخانه | Yellow |
| ready | آماده | Orange |
| served | سرو شده | Blue |
| paid | پرداخت شد | Green |
| cancelled | لغو شده | Red |

### Interactions
- Click a row → navigate to `/orders/{id}` (order detail)
- Click "فرمایش جدید" → navigate to `/orders/create`
- Status filter tabs update the table
- Search filters by order# or table#

---

## 3. New Order — `/orders/create` (فرمایش جدید)

**Purpose:** Create a new order by selecting table and food items. This is the **most important page** in the app.

### Layout — Split View
```
┌──────────────────────────────┬───────────────────────┐
│       انتخاب غذا (Menu)      │    سبد فرمایش (Cart)   │
│                              │                       │
│  میز: [▼ انتخاب میز]         │   میز شماره: 3        │
│                              │                       │
│  [پیش غذا] [غذای اصلی]       │   ┌─────────────────┐ │
│  [نوشیدنی] [دسر]             │   │ کابلی پلو        │ │
│                              │   │ [-] 2 [+]  600 ؋ │ │
│  ┌─────────┐ ┌─────────┐    │   │ یادداشت: ...     │ │
│  │ 🍚      │ │ 🍗      │    │   ├─────────────────┤ │
│  │ کابلی   │ │ مرغ     │    │   │ مرغ کبابی       │ │
│  │ پلو     │ │ کبابی   │    │   │ [-] 1 [+]  400 ؋ │ │
│  │ 300 ؋   │ │ 400 ؋   │    │   └─────────────────┘ │
│  │ [افزودن]│ │ [افزودن]│    │                       │
│  └─────────┘ └─────────┘    │   ─────────────────── │
│                              │   جمع: 1,000 ؋        │
│  ┌─────────┐ ┌─────────┐    │                       │
│  │ 🥘      │ │ ☕      │    │  [ثبت فرمایش]         │
│  │ چلو     │ │ چای     │    │  [لغو]                │
│  │ کباب    │ │ سبز     │    │                       │
│  │ 350 ؋   │ │ 50 ؋    │    │                       │
│  └─────────┘ └─────────┘    │                       │
└──────────────────────────────┴───────────────────────┘
```

### Components
- **TableSelector** — Dropdown to pick a table (only show available tables)
- **CategoryTabs** — Horizontal tabs to filter menu by category
- **FoodItemGrid** — Grid of food cards with image, name, price, "Add" button
- **OrderCart** — Right panel showing selected items with qty +/-, notes input, subtotals
- **OrderSummary** — Total at bottom of cart + "Submit Order" button

### Flow
1. User selects a table from dropdown (required)
2. User browses food by category tabs
3. Clicks "افزودن" (Add) on a food item → item appears in cart with qty=1
4. Can adjust quantity with +/- buttons (min=1, click - at 1 removes item)
5. Can add a note per item (optional text input)
6. Total auto-calculates as items are added/removed
7. Click "ثبت فرمایش" (Submit Order) → order is created, redirect to `/orders/{id}`
8. Click "لغو" (Cancel) → confirm dialog → redirect back to `/orders`

### Validation
- Must select a table before submitting
- Must have at least 1 item in cart
- Show error if table is already occupied (and has an unpaid order)

---

## 4. Order Detail — `/orders/{id}` (جزئیات فرمایش)

**Purpose:** View full order info, update status, print bill.

### Layout
```
┌─────────────────────────────────────────────────┐
│  فرمایش #1024               وضعیت: 🟡 در آشپزخانه │
│  میز: 3 | ویتر: احمد | ساعت: 14:30               │
├─────────────────────────────────────────────────┤
│  آیتم              تعداد    قیمت واحد    جمع     │
│  ────────────────────────────────────────────── │
│  کابلی پلو          2        300 ؋       600 ؋   │
│  مرغ کبابی          1        400 ؋       400 ؋   │
│  چای سبز            2        50 ؋        100 ؋   │
│  ────────────────────────────────────────────── │
│                              مجموع:     1,100 ؋  │
├─────────────────────────────────────────────────┤
│  [ارسال به آشپزخانه]  [آماده]  [سرو شده]  [پرداخت شد]  │
│  [چاپ بل 🖨️]  [ویرایش فرمایش ✏️]  [لغو فرمایش ❌]     │
└─────────────────────────────────────────────────┘
```

### Components
- **OrderHeader** — Order#, table, waiter, time, status badge
- **OrderItemsTable** — List of items with qty, unit price, subtotal
- **OrderTotal** — Total amount (bold, large)
- **StatusActions** — Buttons to move order to next status (only show valid next statuses)
- **OrderActions** — Print bill, edit order, cancel order

### Status Transitions (valid flows)
```
pending → in_kitchen → ready → served → paid
pending → cancelled
in_kitchen → cancelled (with confirmation)
```

### Interactions
- Status buttons advance order to next stage
- "چاپ بل" opens print-friendly bill view (new window/dialog)
- "ویرایش" → navigate to edit page (only if status is `pending`)
- "لغو" → confirmation dialog → mark as cancelled

---

## 5. Tables — `/tables` (میزها)

**Purpose:** Visual grid of all restaurant tables with status.

### Layout
```
┌─────────────────────────────────────────────────┐
│  مدیریت میزها                    [افزودن میز +]  │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │  میز 1  │  │  میز 2  │  │  میز 3  │         │
│  │  🟢     │  │  🔴     │  │  🟢     │         │
│  │  خالی   │  │  مصروف  │  │  خالی   │         │
│  │  4 نفره │  │  #1024  │  │  6 نفره │         │
│  └─────────┘  └─────────┘  └─────────┘         │
│                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │  میز 4  │  │  VIP 1  │  │  میز 6  │         │
│  │  🟢     │  │  🔴     │  │  🟢     │         │
│  │  خالی   │  │  مصروف  │  │  خالی   │         │
│  │  4 نفره │  │  #1025  │  │  2 نفره │         │
│  └─────────┘  └─────────┘  └─────────┘         │
│                                                  │
│  🟢 خالی: 8 میز    🔴 مصروف: 2 میز              │
└─────────────────────────────────────────────────┘
```

### Components
- **TableCard** — Card showing: table number/name, status color (green/red), capacity, active order# if occupied
- **TableGrid** — Responsive grid of TableCards
- **AddTableModal** — Dialog to add a new table (number, name, capacity)
- **TableSummary** — Footer bar showing count of available vs occupied

### Interactions
- Click green (available) table → navigate to `/orders/create?table={id}` (pre-select table)
- Click red (occupied) table → navigate to active order `/orders/{orderId}`
- Click "افزودن میز" → open AddTableModal
- Long press / right-click → edit/delete table

---

## 6. Menu Management — `/menu` (مینو)

**Purpose:** Manage food items and categories.

### Layout
```
┌─────────────────────────────────────────────────┐
│  مدیریت مینو         [دسته‌بندی‌ها]  [افزودن غذا +] │
├─────────────────────────────────────────────────┤
│  🔍 جستجو...                                     │
│  فیلتر: [همه] [پیش غذا] [غذای اصلی] [نوشیدنی] [دسر] │
├─────────────────────────────────────────────────┤
│                                                  │
│  ── پیش غذا ──────────────────────────────────  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  📷      │  │  📷      │  │  📷      │      │
│  │ بولانی   │  │ سلاطه   │  │ آش      │      │
│  │ 100 ؋    │  │ 80 ؋     │  │ 120 ؋    │      │
│  │ ✅ موجود │  │ ❌ ناموجود│  │ ✅ موجود │      │
│  │ [ویرایش] │  │ [ویرایش] │  │ [ویرایش] │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│                                                  │
│  ── غذای اصلی ────────────────────────────────  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  📷      │  │  📷      │  │  📷      │      │
│  │ کابلی پلو│  │ چلو کباب │  │ مرغ کبابی│      │
│  │ 300 ؋    │  │ 350 ؋    │  │ 400 ؋    │      │
│  │ ✅ موجود │  │ ✅ موجود │  │ ✅ موجود │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────┘
```

### Sub-page: Categories — `/menu/categories`
```
┌─────────────────────────────────────────────────┐
│  دسته‌بندی‌ها                    [افزودن دسته +]   │
├─────────────────────────────────────────────────┤
│  #  │ نام دسته‌بندی    │ تعداد آیتم │ عملیات      │
│  1  │ پیش غذا         │ 5          │ ✏️ 🗑️       │
│  2  │ غذای اصلی       │ 8          │ ✏️ 🗑️       │
│  3  │ نوشیدنی         │ 6          │ ✏️ 🗑️       │
│  4  │ دسر             │ 3          │ ✏️ 🗑️       │
└─────────────────────────────────────────────────┘
```

### Components
- **FoodItemCard** — Card with image, name, price, availability toggle, edit button
- **FoodItemGrid** — Grid grouped by category
- **AddFoodModal** — Dialog: name, category (dropdown), price, image upload, available toggle
- **CategoryList** — Table view of categories with item count
- **AddCategoryModal** — Dialog: category name

### Interactions
- Toggle availability switch → instantly marks item as in/out of stock
- Click "ویرایش" on food card → open edit modal (pre-filled)
- Click "افزودن غذا" → open add modal
- Search field filters items by name in real-time
- Category tabs filter the grid

---

## 7. Kitchen Monitor — `/kitchen` (آشپزخانه)

**Purpose:** Full-screen display for kitchen staff. Shows active orders in kanban columns.

### Layout — Full Screen (no sidebar)
```
┌─────────────────────────────────────────────────────────┐
│  🍳 مانیتور آشپزخانه                    [خروج از صفحه]  │
├──────────────────┬──────────────────┬───────────────────┤
│   فرمایش جدید     │   در حال آماده‌سازی │     آماده          │
│   (New)           │   (Preparing)     │     (Ready)        │
│                   │                   │                    │
│  ┌──────────────┐ │ ┌──────────────┐  │ ┌──────────────┐  │
│  │ 🟡 میز 3     │ │ │ 🟠 میز 7     │  │ │ 🟢 میز 1     │  │
│  │ #1024        │ │ │ #1023        │  │ │ #1020        │  │
│  │ ────────     │ │ │ ────────     │  │ │ ────────     │  │
│  │ کابلی پلو x2 │ │ │ چلو کباب x3  │  │ │ بولانی x4    │  │
│  │ مرغ کبابی x1 │ │ │              │  │ │ چای x4       │  │
│  │ ────────     │ │ │ ────────     │  │ │ ────────     │  │
│  │ ⏱ 5 دقیقه   │ │ │ ⏱ 12 دقیقه  │  │ │ ⏱ 18 دقیقه   │  │
│  │              │ │ │              │  │ │              │  │
│  │ [شروع آماده‌سازی]│ │ [آماده شد ✅] │  │ │ [سرو شد 🍽️]  │  │
│  └──────────────┘ │ └──────────────┘  │ └──────────────┘  │
│                   │                   │                    │
└──────────────────┴──────────────────┴───────────────────┘
```

### Components
- **KitchenBoard** — 3-column kanban layout
- **KitchenOrderCard** — Large card with: table#, order#, item list, elapsed time, action button
- **KitchenHeader** — Minimal header with title and exit button (back to dashboard)

### Key Design Rules
- **No sidebar** — full-screen mode for kitchen display
- **Large text** — readable from 2-3 meters away
- **High contrast** — dark background, bright cards
- **Touch-friendly** — large buttons for kitchen touchscreens
- **Auto-refresh** — poll every 10 seconds for new orders (frontend timer for now)
- **Color coding:** New=Yellow, Preparing=Orange, Ready=Green

### Interactions
- "شروع آماده‌سازی" (Start Preparing) → moves card from New → Preparing
- "آماده شد" (Ready) → moves card from Preparing → Ready
- "سرو شد" (Served) → removes card from board
- Timer shows how long since order was placed

---

## 8. Expenses — `/expenses` (مصارف)

**Purpose:** Track restaurant expenses.

### Layout
```
┌─────────────────────────────────────────────────┐
│  ثبت مصارف                       [افزودن مصرف +] │
├─────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ مصارف    │  │ مصارف    │  │ مصارف    │      │
│  │ امروز    │  │ این ماه  │  │ مجموع    │      │
│  │ 3,500 ؋  │  │ 45,000 ؋ │  │ 320,000 ؋│      │
│  └──────────┘  └──────────┘  └──────────┘      │
├─────────────────────────────────────────────────┤
│  فیلتر: تاریخ [از ___ تا ___]  دسته [▼ همه]     │
├─────────────────────────────────────────────────┤
│  تاریخ     │ دسته      │ شرح           │ مبلغ   │ عملیات │
│  1404/12/20│ مواد غذایی │ خرید گوشت     │ 2,000 ؋│ ✏️ 🗑️  │
│  1404/12/20│ گاز       │ بل گاز        │ 1,500 ؋│ ✏️ 🗑️  │
│  1404/12/19│ لوازم     │ ظروف جدید     │ 3,000 ؋│ ✏️ 🗑️  │
└─────────────────────────────────────────────────┘
```

### Components
- **ExpenseSummaryCards** — 3 cards: today, this month, total
- **ExpenseFilters** — Date range picker + category dropdown
- **ExpensesTable** — Data table with date, category, description, amount, actions
- **AddExpenseModal** — Dialog: category (dropdown), description, amount, date, notes

### Expense Categories
| Key | Dari |
|-----|------|
| groceries | مواد غذایی |
| rent | کرایه |
| electricity | برق |
| gas | گاز |
| supplies | لوازم |
| other | سایر |

---

## 9. Employees — `/employees` (کارمندان)

**Purpose:** Manage employee records.

### Layout
```
┌─────────────────────────────────────────────────┐
│  کارمندان                       [افزودن کارمند +] │
├─────────────────────────────────────────────────┤
│  نام        │ نقش     │ تلفن         │ وضعیت  │ عملیات    │
│  احمد حسینی │ مدیر    │ 0799123456   │ ✅ فعال │ ✏️ 💰 🗑️ │
│  محمد رضایی │ ویتر    │ 0788654321   │ ✅ فعال │ ✏️ 💰 🗑️ │
│  علی احمدی  │ آشپز    │ 0777111222   │ ✅ فعال │ ✏️ 💰 🗑️ │
│  حسن نوری  │ صندوقدار │ 0766333444   │ ❌ غیرفعال│ ✏️ 💰 🗑️│
└─────────────────────────────────────────────────┘
```

### Components
- **EmployeesTable** — Data table with name, role, phone, status, actions
- **AddEmployeeModal** — Dialog: name, role (dropdown), phone, hire date
- **EmployeeDetailModal** — View/edit employee info

### Employee Roles
| Key | Dari |
|-----|------|
| manager | مدیر |
| waiter | ویتر |
| chef | آشپز |
| cashier | صندوقدار |

### Interactions
- ✏️ Edit → open edit modal
- 💰 Salary → navigate to `/employees/{id}/salary`
- 🗑️ Delete → confirmation dialog
- Status toggle → activate/deactivate employee

---

## 10. Salaries — `/employees/{id}/salary` (معاشات)

**Purpose:** View and record salary payments for a specific employee.

### Layout
```
┌─────────────────────────────────────────────────┐
│  ← بازگشت    معاشات: احمد حسینی (مدیر)          │
├─────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐             │
│  │ آخرین پرداخت │  │ مجموع سال    │             │
│  │ 15,000 ؋     │  │ 180,000 ؋    │             │
│  └──────────────┘  └──────────────┘             │
├─────────────────────────────────────────────────┤
│  تاریخ پرداخت │ ماه       │ مبلغ     │ یادداشت  │ عملیات │
│  1404/12/28   │ حوت ۱۴۰۴ │ 15,000 ؋ │          │ ✏️ 🗑️ │
│  1404/11/29   │ دلو ۱۴۰۴ │ 15,000 ؋ │          │ ✏️ 🗑️ │
│  1404/10/30   │ جدی ۱۴۰۴ │ 15,000 ؋ │ بونس     │ ✏️ 🗑️ │
├─────────────────────────────────────────────────┤
│                              [ثبت پرداخت جدید +] │
└─────────────────────────────────────────────────┘
```

### Components
- **SalarySummaryCards** — Last payment, yearly total
- **SalaryTable** — Payment history with date, month, amount, notes, actions
- **AddSalaryModal** — Dialog: amount, payment date, month, notes
- **BackButton** — Navigate back to employees list

---

## 11. Reports — `/reports` (گزارشات)

**Purpose:** Sales and financial reports with charts.

### Layout
```
┌─────────────────────────────────────────────────┐
│  گزارشات                                         │
│  فیلتر: [امروز] [این هفته] [این ماه] [سفارشی]    │
│  تاریخ: [از ___] [تا ___]                        │
├─────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ عواید    │  │ مصارف    │  │ سود خالص │      │
│  │ 85,000 ؋ │  │ 45,000 ؋ │  │ 40,000 ؋ │      │
│  └──────────┘  └──────────┘  └──────────┘      │
├────────────────────────┬────────────────────────┤
│  📊 نمودار فروش روزانه │  📊 پرفروش‌ترین غذاها   │
│  (Bar Chart)           │  (Horizontal Bar)      │
│                        │                        │
│  ████ ██ ████ ███      │  کابلی پلو  ████████   │
│  ██ ████ ██ █████      │  چلو کباب   ██████     │
│                        │  مرغ کبابی  █████      │
│                        │  بولانی     ████       │
├────────────────────────┴────────────────────────┤
│  جزئیات فروش                                     │
│  تاریخ     │ تعداد فرمایش │ عواید    │ مصارف    │ سود     │
│  1404/12/20│ 12          │ 15,000 ؋ │ 5,000 ؋  │ 10,000 ؋│
│  1404/12/19│ 8           │ 12,000 ؋ │ 3,000 ؋  │ 9,000 ؋ │
├─────────────────────────────────────────────────┤
│  [چاپ گزارش 🖨️]  [دانلود PDF 📄]                 │
└─────────────────────────────────────────────────┘
```

### Components
- **ReportFilters** — Quick filter tabs (today, this week, this month, custom) + date range picker
- **ReportSummaryCards** — Revenue, expenses, net profit
- **DailySalesChart** — Bar chart (use Recharts) showing daily revenue
- **TopItemsChart** — Horizontal bar chart of most sold items
- **ReportTable** — Detailed daily breakdown table
- **ExportButtons** — Print report, download PDF

---

## 12. Settings — `/settings` (تنظیمات)

**Purpose:** System configuration.

### Already Built
- Profile settings (name, email)
- Security settings (password, 2FA)
- Appearance settings (theme)

### To Add
- **Restaurant Info** — Restaurant name, logo, address, phone (used in receipt header)
- **Receipt Settings** — Footer text, show/hide logo
- **Language** — Language switcher (already have LanguageSwitcher component)

---

## Frontend File Structure (to build)

```
resources/js/
├── modules/
│   ├── dashboard/
│   │   └── components/
│   │       ├── dashboard-stats.tsx      ✅ (built)
│   │       ├── recent-orders.tsx        ✅ (built, needs mock data)
│   │       └── table-status-grid.tsx    ✅ (built, needs mock data)
│   ├── orders/
│   │   ├── components/
│   │   │   ├── order-filters.tsx
│   │   │   ├── orders-table.tsx
│   │   │   ├── order-cart.tsx
│   │   │   ├── order-item-row.tsx
│   │   │   ├── order-header.tsx
│   │   │   ├── order-status-actions.tsx
│   │   │   └── bill-receipt.tsx
│   │   └── data/
│   │       └── mock-orders.ts
│   ├── tables/
│   │   ├── components/
│   │   │   ├── table-card.tsx
│   │   │   ├── table-grid.tsx
│   │   │   └── add-table-modal.tsx
│   │   └── data/
│   │       └── mock-tables.ts
│   ├── menu/
│   │   ├── components/
│   │   │   ├── food-item-card.tsx
│   │   │   ├── food-item-grid.tsx
│   │   │   ├── add-food-modal.tsx
│   │   │   ├── category-list.tsx
│   │   │   └── add-category-modal.tsx
│   │   └── data/
│   │       └── mock-menu.ts
│   ├── kitchen/
│   │   ├── components/
│   │   │   ├── kitchen-board.tsx
│   │   │   ├── kitchen-order-card.tsx
│   │   │   └── kitchen-header.tsx
│   │   └── data/
│   │       └── mock-kitchen.ts
│   ├── expenses/
│   │   ├── components/
│   │   │   ├── expense-summary-cards.tsx
│   │   │   ├── expense-filters.tsx
│   │   │   ├── expenses-table.tsx
│   │   │   └── add-expense-modal.tsx
│   │   └── data/
│   │       └── mock-expenses.ts
│   ├── employees/
│   │   ├── components/
│   │   │   ├── employees-table.tsx
│   │   │   ├── add-employee-modal.tsx
│   │   │   ├── salary-table.tsx
│   │   │   ├── salary-summary-cards.tsx
│   │   │   └── add-salary-modal.tsx
│   │   └── data/
│   │       └── mock-employees.ts
│   └── reports/
│       ├── components/
│       │   ├── report-filters.tsx
│       │   ├── report-summary-cards.tsx
│       │   ├── daily-sales-chart.tsx
│       │   ├── top-items-chart.tsx
│       │   ├── report-table.tsx
│       │   └── export-buttons.tsx
│       └── data/
│           └── mock-reports.ts
├── pages/
│   ├── dashboard.tsx                    ✅ (built)
│   ├── orders/
│   │   ├── index.tsx                    (order list)
│   │   ├── create.tsx                   (new order — split view)
│   │   └── [id].tsx                     (order detail)
│   ├── tables/
│   │   └── index.tsx                    (table grid)
│   ├── menu/
│   │   ├── index.tsx                    (food items)
│   │   └── categories.tsx              (categories)
│   ├── kitchen/
│   │   └── index.tsx                    (full-screen kitchen)
│   ├── expenses/
│   │   └── index.tsx                    (expense tracking)
│   ├── employees/
│   │   ├── index.tsx                    (employee list)
│   │   └── [id]/
│   │       └── salary.tsx              (salary history)
│   └── reports/
│       └── index.tsx                    (sales reports)
└── data/
    └── mock/                            (shared mock data & types)
        ├── types.ts                     (TypeScript interfaces for all entities)
        └── index.ts                     (re-exports)
```

---

## Implementation Order (Frontend Only)

### Phase 1 — Core Flow (Order Taking)
1. **Tables page** — grid view with mock tables
2. **Menu page** — food items + categories with mock data
3. **New Order page** — the split-view order creation (most complex)
4. **Order Detail page** — view order + status actions
5. **Orders list page** — table with filters

### Phase 2 — Kitchen & Operations
6. **Kitchen Monitor** — full-screen kanban board
7. **Dashboard** — wire up mock data to existing components

### Phase 3 — Finance & HR
8. **Expenses page** — CRUD with filters
9. **Employees page** — CRUD table
10. **Salaries page** — payment history per employee

### Phase 4 — Reporting
11. **Reports page** — charts + data table

### Phase 5 — Polish
12. **Bill/Receipt print view**
13. **Settings additions** (restaurant info, receipt config)
14. **RTL fine-tuning** across all pages
15. **Responsive polish** for different screen sizes

---

## Shared Mock Data Types

```ts
// types.ts — to be created in resources/js/data/mock/types.ts

interface Category {
  id: number;
  name: string;
  sort_order: number;
}

interface FoodItem {
  id: number;
  category_id: number;
  category: Category;
  name: string;
  price: number;
  image?: string;
  is_available: boolean;
  sort_order: number;
}

interface Table {
  id: number;
  number: number;
  name?: string;
  capacity: number;
  status: 'available' | 'occupied';
  active_order_id?: number;
}

interface Order {
  id: number;
  table_id: number;
  table: Table;
  order_number: string;
  status: 'pending' | 'in_kitchen' | 'ready' | 'served' | 'paid' | 'cancelled';
  total_amount: number;
  notes?: string;
  created_by: number;
  paid_at?: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  order_id: number;
  food_item_id: number;
  food_item: FoodItem;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes?: string;
}

interface Employee {
  id: number;
  name: string;
  role: 'manager' | 'waiter' | 'chef' | 'cashier';
  phone: string;
  hire_date: string;
  is_active: boolean;
}

interface Salary {
  id: number;
  employee_id: number;
  amount: number;
  payment_date: string;
  month: string;
  notes?: string;
}

interface Expense {
  id: number;
  category: 'groceries' | 'rent' | 'electricity' | 'gas' | 'supplies' | 'other';
  description: string;
  amount: number;
  date: string;
  notes?: string;
}
```
