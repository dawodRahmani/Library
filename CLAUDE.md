# Library Management System

## Project Overview
A desktop-first library management system with offline-first architecture. Primary language is **Dari (RTL)** with i18n support.

## Tech Stack
- **Backend:** Laravel 12 + PHP 8.2
- **Frontend:** React 19 + TypeScript + Inertia.js
- **UI:** Tailwind CSS v4 + shadcn/ui + Radix UI
- **Database:** SQLite (offline-first, local storage)
- **Auth:** Laravel Fortify (with 2FA support)
- **Build:** Vite 7

## Key Commands
- `composer dev` — Run full dev environment (server + queue + logs + vite)
- `npm run dev` — Vite dev server only
- `npm run build` — Production build
- `npm run lint:check` — ESLint check
- `npm run format:check` — Prettier check
- `npm run types:check` — TypeScript type check
- `php artisan test` — Run PHPUnit tests
- `composer lint` — Run Pint (PHP linter)

## Architecture
- **Monorepo:** React lives inside Laravel via Inertia.js — no separate API needed
- **Frontend pages:** `resources/js/pages/` (Inertia resolves these automatically)
- **Components:** `resources/js/components/` (shadcn/ui components in `ui/` subfolder)
- **Layouts:** `resources/js/layouts/`
- **Routes:** `routes/web.php` (main), `routes/settings.php`
- **Controllers:** `app/Http/Controllers/`
- **Models:** `app/Models/`
- **Migrations:** `database/migrations/`
- **Wayfinder:** Laravel Wayfinder generates TypeScript route actions in `resources/js/actions/`

## Conventions
- Frontend uses `.tsx` files with TypeScript
- RTL layout is default — use logical CSS properties (start/end, not left/right)
- All UI text should use translation keys, never hardcoded strings
- Database translatable fields use JSON columns
- SQLite is the database — avoid MySQL-specific syntax
