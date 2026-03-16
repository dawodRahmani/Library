# Technical Architecture

## Stack
- **Backend:** Laravel (PHP) — already set up
- **Frontend:** React + Inertia.js — already set up
- **UI Components:** shadcn/ui (based on components.json in project)
- **Database:** SQLite (offline-first) / MySQL (online server)
- **Build Tool:** Vite

## Offline-First Strategy

### Option A: SQLite Local + Server Sync
- Use SQLite as primary local database
- App runs fully from local DB
- When internet is available, sync to remote MySQL server
- Best for: desktop app scenario where data lives on the machine

### Option B: Service Worker + IndexedDB (PWA)
- Laravel serves as API
- Frontend caches data in IndexedDB
- Service worker handles offline requests
- Best for: browser-based access

**Recommended: Option A** — since most users are offline and it's a desktop app.

## RTL & i18n Strategy

### Layout
- Use CSS `direction: rtl` as default
- Tailwind CSS RTL plugin or logical properties (start/end instead of left/right)
- All components must support RTL natively

### Translation System
- Use **react-i18next** for frontend translations
- JSON-based translation files:
  ```
  resources/lang/
  ├── da/        (Dari - default)
  │   └── translation.json
  ├── ps/        (Pashto)
  │   └── translation.json
  └── en/        (English)
      └── translation.json
  ```
- All UI strings referenced by key, never hardcoded
- Database translatable fields use JSON columns (for food names, categories)

## Page Structure

```
/dashboard              → Overview (today's sales, active orders, table status)
/orders                 → Order list + New Order
/orders/{id}            → Order detail
/tables                 → Table management + visual grid
/menu                   → Food menu management
/menu/categories        → Category management
/kitchen                → Kitchen monitor (full-screen mode)
/expenses               → Expense tracking
/employees              → Employee list
/employees/{id}/salary  → Salary history
/reports                → Sales reports (daily/monthly)
/settings               → System settings, language, printer config
```

## Key Frontend Components

```
components/
├── layout/
│   ├── DashboardLayout.tsx    (RTL sidebar + header)
│   ├── Sidebar.tsx
│   └── Header.tsx
├── orders/
│   ├── NewOrderForm.tsx
│   ├── OrderCard.tsx
│   ├── OrderItemRow.tsx
│   └── BillReceipt.tsx
├── tables/
│   ├── TableGrid.tsx
│   └── TableCard.tsx
├── kitchen/
│   └── KitchenBoard.tsx
├── menu/
│   ├── FoodItemCard.tsx
│   └── CategoryList.tsx
├── reports/
│   └── SalesChart.tsx
└── shared/
    ├── LanguageSwitcher.tsx
    └── PrintButton.tsx
```

## Receipt Printing
- Use browser's `window.print()` with a print-specific CSS stylesheet
- Or integrate with **ESC/POS** protocol for thermal printers via a local print service
- Receipt template: configurable with restaurant name, logo, footer text
