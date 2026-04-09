# Plan: Dynamic Dashboard & Website Settings System

## Context
The dashboard currently shows hardcoded zeros and static content. The goal is:
1. Make the dashboard show real statistics
2. Allow the admin to edit ALL public-facing website content from the dashboard
3. Support 3 languages now (English, Dari/Farsi, Arabic) + extensible for future languages
4. Keep everything DB-driven so no code change is needed to update content

---

## Current State

### Done ✅
- All content models exist (Book, Video, Audio, Fatwa, Article, Magazine, Category)
- Backend CRUD for all content types
- i18n frontend system with `da` and `en` translation files
- Language switcher component with cookie-based backend sync
- SetLocale middleware and dynamic locale in controllers

### Missing ❌
- Dashboard stats are hardcoded to '۰'
- No site settings system (site name, footer text, social links, contact info, etc. all hardcoded)
- No Arabic (`ar`) or Farsi (`fa`) support
- Language list is hardcoded in LanguageSwitcher, SetLocale, and HandleInertiaRequests
- News ticker content is hardcoded
- Footer recent books/articles are hardcoded arrays
- Quick action buttons on dashboard are not wired up

---

## Architecture Decisions

### Language Strategy
- Keep `da` (Dari) as primary language — all existing content stays
- Add `fa` (Farsi/Persian), `ar` (Arabic), `en` (English)
- DB table `languages` drives which languages are active — adding a new language in future requires only inserting a row and adding a translation file
- All translatable DB JSON columns already support any key — just add `"ar": "..."`, `"fa": "..."`
- Frontend i18n (UI chrome) uses JSON files — one per language code
- Fallback chain: `current_locale → 'da' → first available key`

### Site Settings Strategy
- `site_settings` table: `key`, `value` (JSON for translatable), `group`, `type`, `is_translatable`
- Shared globally via `HandleInertiaRequests` (like `locale` is already shared)
- Admin UI at `/admin/site-settings` with grouped tabs
- Groups: `branding`, `contact`, `social`, `footer`, `seo`, `homepage`

### News Ticker Strategy
- New `news_ticker_items` table (simple: `text` JSON, `is_active`, `sort_order`)
- Admin CRUD at `/admin/news-ticker`
- Public pages receive items via shared Inertia props

---

## Phase 1: Fix Dashboard Stats & Quick Actions

### 1.1 DashboardController
**File:** `app/Http/Controllers/DashboardController.php`

Pass real counts to the dashboard:
```php
public function index(): Response
{
    return Inertia::render('dashboard', [
        'stats' => [
            'books'      => Book::where('is_active', true)->count(),
            'articles'   => Article::where('is_active', true)->count(),
            'audios'     => Audio::where('is_active', true)->count(),
            'videos'     => Video::where('is_active', true)->count(),
            'users'      => User::where('is_active', true)->count(),
            'categories' => Category::count(),
            'fatwas'     => Fatwa::where('is_active', true)->count(),
            'magazines'  => Magazine::where('is_active', true)->count(),
        ],
    ]);
}
```

### 1.2 Dashboard Page
**File:** `resources/js/pages/dashboard.tsx`

- Accept `stats` prop (PageProps interface)
- Replace `STAT_CARDS` hardcoded '۰' with `stats.books`, `stats.articles`, etc.
- Add 2 more stat cards: Fatwas and Magazines
- Wire quick action buttons to their respective admin pages (`/admin/books`, `/admin/articles`, etc.)
- Remove placeholder "coming soon" message
- Add a recent activity section (5 most recently added items across all types)

---

## Phase 2: Language System Extension

### 2.1 Languages DB Table
**New migration:** `database/migrations/2026_04_05_000001_create_languages_table.php`

```
languages:
  id
  code        — 'en', 'da', 'fa', 'ar'
  name        — 'English', 'Dari', 'Farsi', 'Arabic' (display name in English)
  native_name — 'English', 'دری', 'فارسی', 'العربية'
  dir         — 'ltr' or 'rtl'
  is_active   — boolean
  sort_order  — integer
  timestamps
```

**New model:** `app/Models/Language.php`

**New seeder:** `database/seeders/LanguageSeeder.php`
Seed: da (Dari, RTL, active), en (English, LTR, active), ar (Arabic, RTL, active), fa (Farsi, RTL, active)

### 2.2 New i18n Translation Files
**New files:**
- `resources/js/i18n/locales/ar/translation.json` — Arabic UI strings
- `resources/js/i18n/locales/fa/translation.json` — Farsi UI strings

Mirror structure of `da/translation.json` (same keys, translated values).

### 2.3 Update i18n/index.ts
Import and register all 4 language files.
Load language preference from cookie/localStorage.

### 2.4 Update LanguageSwitcher
Instead of hardcoded array, receive active languages via Inertia shared props.
Accept `languages: Language[]` from shared props.
Display `native_name` for each language button.
Set `document.documentElement.dir` based on selected language's `dir` field.

### 2.5 Update SetLocale Middleware
Accept all active language codes dynamically (query from DB or config).

### 2.6 Update HandleInertiaRequests
Share active languages array instead of hardcoded `['da', 'en']`:
```php
'languages' => fn () => Language::where('is_active', true)->orderBy('sort_order')->get(),
'locale'    => fn () => app()->getLocale(),
```

### 2.7 Update All Controllers
Fallback chain for translatable JSON fields:
```php
$locale = app()->getLocale();
$title = $item->title[$locale] ?? $item->title['da'] ?? collect($item->title)->first() ?? '';
```
Apply to: BookController, VideoController, AudioController, FatwaController, ArticleController, MagazineController, CategoryController.

### 2.8 Fix RTL/LTR in Public Pages
All public pages currently have `dir="rtl"` hardcoded.
Use `useTranslation()` hook with `i18n.dir()` to set direction dynamically.
Pattern:
```tsx
const { i18n } = useTranslation();
// ...
<div dir={i18n.dir()} className="min-h-screen ...">
```
Apply to: `library/index.tsx`, `library/videos.tsx`, `audio.tsx`, `articles.tsx`, `dar-ul-ifta.tsx`, `majalla.tsx`.

---

## Phase 3: Site Settings System

### 3.1 Migration
**New file:** `database/migrations/2026_04_05_000002_create_site_settings_table.php`

```
site_settings:
  id
  key            — unique string key e.g. 'site_name', 'footer_description'
  value          — JSON (for translatable) or plain text
  group          — 'branding' | 'contact' | 'social' | 'footer' | 'seo' | 'homepage'
  type           — 'text' | 'textarea' | 'image' | 'url' | 'email' | 'boolean' | 'color'
  is_translatable — boolean (if true, value is JSON like {"da":"...","en":"...","ar":"...","fa":"..."})
  timestamps
```

### 3.2 Model
**New file:** `app/Models/SiteSetting.php`

Static helper:
```php
public static function get(string $key, string $locale = null): mixed
{
    $setting = static::where('key', $key)->first();
    if (!$setting) return null;
    if ($setting->is_translatable) {
        $locale ??= app()->getLocale();
        $val = json_decode($setting->value, true);
        return $val[$locale] ?? $val['da'] ?? collect($val)->first();
    }
    return $setting->value;
}
```

### 3.3 Seeder
**New file:** `database/seeders/SiteSettingSeeder.php`

Default settings to seed:

| Key                  | Group     | Type     | Translatable | Default Value |
|----------------------|-----------|----------|--------------|---------------|
| site_name            | branding  | text     | ✅           | {"da":"کتابخانه رسالت","en":"Resalat Library","ar":"مكتبة رسالت","fa":"کتابخانه رسالت"} |
| site_tagline         | branding  | text     | ✅           | {"da":"سیستم مدیریت کتابخانه دیجیتال","en":"Digital Library Management System",...} |
| site_description     | branding  | textarea | ✅           | multi-lang description |
| contact_email        | contact   | email    | ❌           | admin@gmail.com |
| contact_phone        | contact   | text     | ❌           | "" |
| contact_address      | contact   | textarea | ✅           | {} |
| facebook_url         | social    | url      | ❌           | "" |
| twitter_url          | social    | url      | ❌           | "" |
| youtube_url          | social    | url      | ❌           | "" |
| linkedin_url         | social    | url      | ❌           | "" |
| rss_url              | social    | url      | ❌           | "" |
| footer_description   | footer    | textarea | ✅           | multi-lang footer text |
| footer_copyright     | footer    | text     | ✅           | {"da":"کلیه حقوق محفوظ است","en":"All rights reserved",...} |
| meta_title           | seo       | text     | ✅           | {} |
| meta_description     | seo       | textarea | ✅           | {} |
| hero_title           | homepage  | text     | ✅           | {} |
| hero_subtitle        | homepage  | textarea | ✅           | {} |
| news_ticker_speed    | homepage  | text     | ❌           | "30" |

### 3.4 SiteSettingsController
**New file:** `app/Http/Controllers/Admin/SiteSettingsController.php`

```
GET  /admin/site-settings        → index()  — grouped settings for admin UI
POST /admin/site-settings        → update() — save one or all settings
POST /admin/site-settings/image  → uploadImage() — logo/favicon upload
```

### 3.5 Share Settings via Inertia
**Update:** `app/Http/Middleware/HandleInertiaRequests.php`

Add to shared props:
```php
'siteSettings' => fn () => SiteSetting::all()
    ->groupBy('group')
    ->map(fn ($group) => $group->mapWithKeys(fn ($s) => [
        $s->key => $s->is_translatable
            ? json_decode($s->value, true)[app()->getLocale()]
                ?? json_decode($s->value, true)['da']
                ?? ''
            : $s->value
    ])),
```

Public pages then get `usePage().props.siteSettings.branding.site_name` etc.

### 3.6 Admin Settings UI Page
**New file:** `resources/js/pages/admin/site-settings/index.tsx`

Design:
- Tabs for each group: Branding, Contact, Social, Footer, SEO, Homepage
- For translatable fields: language tabs (da, en, ar, fa) within each field
- Image upload for logo/favicon with preview
- Color picker for theme color
- Save button per group (or global save)
- Uses existing shadcn/ui components (Tabs, Input, Textarea, Switch, Button)

---

## Phase 4: News Ticker System

### 4.1 Migration
**New file:** `database/migrations/2026_04_05_000003_create_news_ticker_items_table.php`

```
news_ticker_items:
  id
  text       — JSON {"da":"...","en":"...","ar":"...","fa":"..."}
  link       — nullable string (URL for clickable ticker items)
  is_active  — boolean
  sort_order — integer
  timestamps
```

### 4.2 Model & Controller
- **New:** `app/Models/NewsTickerItem.php`
- **New:** `app/Http/Controllers/Admin/NewsTickerController.php`
  - CRUD: list, create, update, delete, reorder

### 4.3 Share with Inertia
Add to `HandleInertiaRequests` shared props:
```php
'newsTicker' => fn () => NewsTickerItem::where('is_active', true)
    ->orderBy('sort_order')
    ->get()
    ->map(fn ($i) => [
        'text' => $i->text[app()->getLocale()] ?? $i->text['da'] ?? '',
        'link' => $i->link,
    ]),
```

### 4.4 Update NewsTicker Component
**File:** `resources/js/components/home/news-ticker.tsx`
Use `usePage().props.newsTicker` instead of hardcoded items.

---

## Phase 5: Footer Dynamic Content

### 5.1 Recent Books & Articles in Footer
**Update:** `HandleInertiaRequests`

Add to shared props:
```php
'footerData' => fn () => [
    'recentBooks' => Book::where('is_active', true)
        ->latest()->limit(4)
        ->get()
        ->map(fn ($b) => [
            'title' => $b->title[app()->getLocale()] ?? $b->title['da'] ?? '',
            'slug'  => $b->id,
        ]),
    'recentArticles' => Article::where('is_active', true)
        ->latest()->limit(4)
        ->get()
        ->map(fn ($a) => [
            'title' => $a->title[app()->getLocale()] ?? $a->title['da'] ?? '',
            'slug'  => $a->slug,
        ]),
],
```

### 5.2 Update HomeFooter Component
**File:** `resources/js/components/home/home-footer.tsx`

Replace `RECENT_BOOKS` and `RECENT_ARTICLES` hardcoded arrays with data from `usePage().props.footerData`.
Replace hardcoded social links with data from `usePage().props.siteSettings.social`.
Replace hardcoded footer description with `usePage().props.siteSettings.footer.footer_description`.

---

## Phase 6: Update Admin Sidebar Navigation

**File:** `resources/js/components/app-sidebar.tsx`

Add new "Website Settings" group:
```tsx
{
    title: t('sidebar.websiteSettings'),  // new translation key
    icon: Globe,
    items: [
        { title: t('sidebar.siteSettings'),  href: '/admin/site-settings', icon: Settings2 },
        { title: t('sidebar.newsTicker'),    href: '/admin/news-ticker',   icon: Newspaper },
        { title: t('sidebar.languages'),     href: '/admin/languages',     icon: Languages },
    ]
}
```

Add permission: `site.manage` for site settings access.
Add new route group in `routes/web.php`.
Add new translation keys to `da/translation.json` and `en/translation.json`.

---

## Phase 7: Languages Admin Page

### 7.1 LanguageController
**New file:** `app/Http/Controllers/Admin/LanguageController.php`

```
GET   /admin/languages             → index()   — list all languages
POST  /admin/languages             → store()   — add new language
PUT   /admin/languages/{lang}      → update()  — edit name, dir, active
PATCH /admin/languages/{lang}/toggle → toggle active status
```

### 7.2 Language Admin UI
**New file:** `resources/js/pages/admin/languages/index.tsx`

- Table: code, name, native_name, direction, active toggle
- Add language modal (code, name, native_name, direction)
- Note: adding a language here creates the DB row but admin must also add translation file

---

## New Routes to Add (routes/web.php)

```php
// Website management (permission: site.manage)
Route::get('/admin/site-settings',         [SiteSettingsController::class, 'index']);
Route::post('/admin/site-settings',        [SiteSettingsController::class, 'update']);
Route::post('/admin/site-settings/image',  [SiteSettingsController::class, 'uploadImage']);
Route::delete('/admin/site-settings/image',[SiteSettingsController::class, 'removeImage']);

Route::get('/admin/news-ticker',           [NewsTickerController::class, 'index']);
Route::post('/admin/news-ticker',          [NewsTickerController::class, 'store']);
Route::put('/admin/news-ticker/{item}',    [NewsTickerController::class, 'update']);
Route::delete('/admin/news-ticker/{item}', [NewsTickerController::class, 'destroy']);
Route::post('/admin/news-ticker/reorder',  [NewsTickerController::class, 'reorder']);

Route::get('/admin/languages',             [LanguageController::class, 'index']);
Route::post('/admin/languages',            [LanguageController::class, 'store']);
Route::put('/admin/languages/{lang}',      [LanguageController::class, 'update']);
Route::patch('/admin/languages/{lang}/toggle', [LanguageController::class, 'toggle']);
```

---

## New Permissions to Seed

Add to `PermissionSeeder`:
- `site.manage` — access site settings, news ticker, languages

---

## New Translation Keys to Add

In both `da/translation.json` and `en/translation.json` (and new `ar/`, `fa/`):

```json
"sidebar": {
    "websiteSettings": "تنظیمات وب‌سایت",
    "siteSettings": "تنظیمات سایت",
    "newsTicker": "خبر روان",
    "languages": "زبان‌ها"
},
"settings": {
    "branding": "هویت بصری",
    "contact": "اطلاعات تماس",
    "social": "شبکه‌های اجتماعی",
    "footer": "پاورقی",
    "seo": "سئو",
    "homepage": "صفحه اصلی",
    "siteName": "نام سایت",
    "siteTagline": "شعار سایت",
    "siteDescription": "توضیحات سایت",
    "contactEmail": "ایمیل تماس",
    "contactPhone": "تلفن تماس",
    "save": "ذخیره",
    "saved": "ذخیره شد"
}
```

---

## Implementation Order (Priority)

| Step | Task | Priority | Files |
|------|------|----------|-------|
| 1 | Dashboard real stats | 🔴 HIGH | DashboardController, dashboard.tsx |
| 2 | Dashboard quick action links | 🔴 HIGH | dashboard.tsx |
| 3 | Languages table + seeder | 🔴 HIGH | migration, model, seeder |
| 4 | Arabic + Farsi i18n files | 🔴 HIGH | locales/ar/, locales/fa/ |
| 5 | Update LanguageSwitcher for 4 langs | 🔴 HIGH | language-switcher.tsx, i18n/index.ts |
| 6 | Fix RTL/LTR direction in public pages | 🟠 MEDIUM | all public page components |
| 7 | Site settings migration + model + seeder | 🔴 HIGH | migration, SiteSetting.php, seeder |
| 8 | SiteSettingsController + routes | 🔴 HIGH | controller, web.php |
| 9 | Admin site settings UI page | 🔴 HIGH | pages/admin/site-settings/index.tsx |
| 10 | Share siteSettings via Inertia | 🔴 HIGH | HandleInertiaRequests |
| 11 | News ticker DB + admin UI | 🟠 MEDIUM | migration, controller, NewsTicker.tsx |
| 12 | Footer dynamic content | 🟠 MEDIUM | HomeFooter, HandleInertiaRequests |
| 13 | Update admin sidebar | 🟠 MEDIUM | app-sidebar.tsx |
| 14 | Languages admin page | 🟡 LOW | pages/admin/languages/ |
| 15 | Update controllers for 4-lang fallback | 🟠 MEDIUM | all content controllers |
| 16 | Add `site.manage` permission | 🟠 MEDIUM | PermissionSeeder |

---

## Critical Files to Create (New)

```
database/migrations/2026_04_05_000001_create_languages_table.php
database/migrations/2026_04_05_000002_create_site_settings_table.php
database/migrations/2026_04_05_000003_create_news_ticker_items_table.php
database/seeders/LanguageSeeder.php
database/seeders/SiteSettingSeeder.php
app/Models/Language.php
app/Models/SiteSetting.php
app/Models/NewsTickerItem.php
app/Http/Controllers/Admin/SiteSettingsController.php
app/Http/Controllers/Admin/NewsTickerController.php
app/Http/Controllers/Admin/LanguageController.php
resources/js/i18n/locales/ar/translation.json
resources/js/i18n/locales/fa/translation.json
resources/js/pages/admin/site-settings/index.tsx
resources/js/pages/admin/languages/index.tsx
resources/js/pages/admin/news-ticker/index.tsx
```

## Critical Files to Modify (Existing)

```
app/Http/Controllers/DashboardController.php
app/Http/Middleware/HandleInertiaRequests.php
app/Http/Middleware/SetLocale.php
resources/js/pages/dashboard.tsx
resources/js/components/language-switcher.tsx
resources/js/components/home/news-ticker.tsx
resources/js/components/home/home-footer.tsx
resources/js/components/app-sidebar.tsx
resources/js/i18n/index.ts
resources/js/i18n/locales/da/translation.json
resources/js/i18n/locales/en/translation.json
routes/web.php
database/seeders/DatabaseSeeder.php
```

---

## Success Criteria

- Dashboard shows real counts for all content types
- Admin can edit site name, tagline, description, contact info, social links from admin panel
- Admin can edit footer text in all 4 languages
- Admin can manage news ticker items (add/edit/delete/reorder)
- Language switcher shows all 4 active languages
- Switching language changes both UI text AND content (from DB)
- RTL/LTR layout switches correctly for Arabic/Dari/Farsi (RTL) vs English (LTR)
- Adding a 5th language in future requires: 1 DB row + 1 translation JSON file — no code changes
