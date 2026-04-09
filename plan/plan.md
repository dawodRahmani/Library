# Multilanguage Plan — Persian (da) · English (en) · Arabic (ar)

---

## Current State (already working)

| Layer | How it works |
|---|---|
| Static UI strings | `i18next` — JSON files per language in `resources/js/i18n/locales/` |
| Dynamic DB content | JSON columns — `{"da":"...", "en":"..."}` stored in SQLite |
| Language switcher | Cookie + session — sets `locale` cookie, syncs with Laravel backend |
| Backend locale | `SetLocale` middleware reads cookie → `app()->setLocale()` |
| Display fallback | `$b->title[$locale] ?? $b->title['da'] ?? ''` |

Only `da` and `en` exist. Need to extend to `ar`.

---

## Architecture Decision — Keep What We Have

The current JSON-column approach is the right one. **Do not change it.**

- DB schema: no changes needed — JSON columns accept any key
- Adding Arabic = add `"ar": "..."` key to existing JSON values  
- Adding a 4th language later = same process, zero schema changes
- Fallback chain: `current_locale → da → first available`

---

## What Needs to Change (in order)

### 1. Static UI — i18n files

**Files to create/update:**
- Create `resources/js/i18n/locales/ar/translation.json` — translate all keys to Arabic
- Update `resources/js/i18n/index.ts` — register `ar` resource
- Update `resources/js/components/language-switcher.tsx` — add Arabic button (العربية)

**Arabic is RTL** — same direction as Dari, so no `dir` change needed when switching. Already handled.

---

### 2. Backend — accept Arabic locale

**`app/Http/Middleware/SetLocale.php`**
```php
// Change from:
$request->getPreferredLanguage(['da', 'en'])
// To:
$request->getPreferredLanguage(['da', 'en', 'ar'])
```

**`app/Http/Middleware/HandleInertiaRequests.php`**
- `navCategories` already reads `$locale` from `app()->getLocale()` — works automatically
- `share()` already passes `locale` — works automatically

---

### 3. Dynamic Content — Admin forms

Every admin form that has translatable fields needs an Arabic input added.

| Page | Translatable fields |
|---|---|
| Books | `title`, `description` |
| Videos | `title`, `description` |
| Audios | `title`, `description` |
| Fatwas | `title`, `description` |
| Articles | `title`, `excerpt`, `content` |
| Magazines | `title`, `description` |
| Categories | `name` |
| Site Settings | `site_name`, `footer_about` |

**Pattern for each form (example — Books):**

Admin form currently has:
```tsx
<Input value={form.title.da} onChange={...} />  // Dari only
```

Needs to become:
```tsx
<Input value={form.title.da} onChange={...} placeholder="دری" />
<Input value={form.title.en} onChange={...} placeholder="English" dir="ltr" />
<Input value={form.title.ar} onChange={...} placeholder="العربية" />
```

Backend validation — currently:
```php
'title.da' => ['required', 'string'],
```
Needs:
```php
'title.da' => ['required', 'string'],
'title.en' => ['nullable', 'string'],
'title.ar' => ['nullable', 'string'],
```

---

### 4. Seeder data — add Arabic keys

Each seeder book/video/etc needs `ar` added to JSON fields:
```php
'title' => ['da' => '...', 'en' => '...', 'ar' => '...'],
```

---

### 5. Public display — already works

All public controllers already do:
```php
$b->title[$locale] ?? $b->title['da'] ?? ''
```
This means:
- If user is on Arabic and `ar` key exists → shows Arabic
- If `ar` key missing → falls back to Dari
- No code change needed here ✅

---

## Implementation Order

```
Step 1 — ar/translation.json         (static strings)
Step 2 — i18n/index.ts + switcher    (register + UI)
Step 3 — SetLocale middleware         (backend accepts ar)
Step 4 — Admin forms (all 8)         (enter Arabic content)
Step 5 — Validators (all controllers) (accept title.ar)
Step 6 — Seeders                      (sample Arabic data)
```

---

## What NOT to do

- ❌ Don't add separate DB tables per language (too complex)
- ❌ Don't add language columns (`title_da`, `title_en`, `title_ar`) — JSON is better
- ❌ Don't use a translation package (Spatie Translatable etc.) — overkill for this setup
- ❌ Don't store Arabic in a separate service — keep it in the same JSON column

---

## Scaling to a 4th language (e.g. Pashto `ps`)

1. Add `ps/translation.json`
2. Add `ps` to `i18n/index.ts`
3. Add button to language switcher
4. Add `ps` to `SetLocale` accepted list
5. Add `title.ps` fields to admin forms + validators
6. Done — DB and display logic need zero changes
