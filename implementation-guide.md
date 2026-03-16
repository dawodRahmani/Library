# Top Property — Implementation Guide
# Stack: Laravel + Inertia.js + React (Monorepo — React inside Laravel)

## Why Inertia.js
- React runs inside Laravel — one project, one repo
- No REST API needed for internal pages (no Sanctum tokens, no CORS)
- Laravel handles routing, auth, sessions as normal
- React handles the UI — no page reloads, SPA feel
- Share Laravel data directly to React props via Inertia

---

## Tech Stack
- Backend   : Laravel 11
- Frontend  : React 18 (inside Laravel via Inertia.js)
- Bridge    : Inertia.js
- Styling   : Tailwind CSS + shadcn/ui
- Language  : Dari (RTL)
- Database  : MySQL
- Auth      : Laravel Breeze (Inertia + React preset)
- PDF       : barryvdh/laravel-dompdf
- Export    : maatwebsite/excel
- Charts    : Recharts

---

## Project Structure (Single Laravel Project)

```
top-property/
  app/
    Http/
      Controllers/
        Auth/
        DashboardController.php
        PropertyController.php
        UnitController.php
        TenantController.php
        LeaseController.php
        InvoiceController.php
        RecurringController.php
        ExpenseController.php
        DocumentController.php
        MaintenanceController.php
        NoticeController.php
        ReportController.php
        AgreementController.php
        SettingController.php
      Middleware/
        HandleInertiaRequests.php   <-- shares global data to all React pages
    Models/
      User.php
      Property.php
      Unit.php
      Tenant.php
      Lease.php
      Invoice.php
      Payment.php
      Expense.php
      Document.php
      MaintenanceRequest.php
      MaintenancePerson.php
      Notice.php
      Agreement.php
      Role.php
      Permission.php
  database/
    migrations/
  resources/
    js/                             <-- ALL React code lives here
      Pages/
        Auth/
          Login.jsx
        Dashboard/
          Index.jsx
        Property/
          Index.jsx
          Create.jsx
          Edit.jsx
          Units.jsx
        Tenants/
          Index.jsx
          Create.jsx
          History.jsx
        Billing/
          Index.jsx
          RecurringSettings.jsx
          InvoiceDetail.jsx
        Expense/
          Index.jsx
          Create.jsx
        Documents/
          Index.jsx
        Maintenance/
          Persons.jsx
          Requests.jsx
        Notice/
          Index.jsx
        Reports/
          Earnings.jsx
          Occupancy.jsx
          ProfitLoss.jsx
        Agreement/
          Index.jsx
          Preview.jsx
        Settings/
          Staff.jsx
          Roles.jsx
      Components/
        Layout/
          AppLayout.jsx             <-- sidebar + topbar wrapping all pages
          Sidebar.jsx
          TopBar.jsx
        UI/
          Button.jsx
          Table.jsx
          Modal.jsx
          Card.jsx
          Badge.jsx
      Hooks/
        usePermission.js
      Lib/
        utils.js
      translations/
        dari.js
      app.jsx                       <-- Inertia root
    views/
      app.blade.php                 <-- single Blade file, loads React
  routes/
    web.php                         <-- all routes here (no api.php needed)
  public/
  vite.config.js
  package.json
```

---

## Phase 1 — Installation

### Step 1: Create Laravel project with Breeze (Inertia + React)
```bash
composer create-project laravel/laravel top-property
cd top-property

# Install Breeze with Inertia React stack
composer require laravel/breeze --dev
php artisan breeze:install react

# Install PHP dependencies
composer require barryvdh/laravel-dompdf
composer require maatwebsite/excel

# Install JS dependencies
npm install
npm install recharts
npm install @tanstack/react-query
npm run dev
```

### Step 2: Configure database
```env
# .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=top_property
DB_USERNAME=root
DB_PASSWORD=
```

### Step 3: Run migrations
```bash
php artisan migrate
```

---

## Phase 2 — How Inertia Works (Key Concept)

### Laravel Controller (sends data to React)
```php
// app/Http/Controllers/PropertyController.php
use Inertia\Inertia;

class PropertyController extends Controller
{
    public function index()
    {
        $properties = Property::with('units')->paginate(15);

        return Inertia::render('Property/Index', [
            'properties' => $properties,
        ]);
    }
}
```

### React Page (receives data as props)
```jsx
// resources/js/Pages/Property/Index.jsx
export default function PropertyIndex({ properties }) {
    return (
        <div>
            {properties.data.map(p => (
                <div key={p.id}>{p.name}</div>
            ))}
        </div>
    );
}
```

### Route (web.php)
```php
Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');
```

### Inertia Link (replaces <a> tag — no page reload)
```jsx
import { Link } from '@inertiajs/react';

<Link href="/properties">Properties</Link>
```

### Inertia Form (replaces axios POST)
```jsx
import { useForm } from '@inertiajs/react';

const { data, setData, post, errors } = useForm({ name: '', address: '' });

const submit = (e) => {
    e.preventDefault();
    post('/properties');
};
```

---

## Phase 3 — Global Layout & Shared Data

### HandleInertiaRequests Middleware
This shares data to ALL React pages automatically:
```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth' => [
            'user'        => $request->user(),
            'permissions' => $request->user()?->permissions(),
        ],
        'flash' => [
            'success' => session('success'),
            'error'   => session('error'),
        ],
    ];
}
```

### AppLayout.jsx (wraps all pages)
```jsx
// resources/js/Components/Layout/AppLayout.jsx
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppLayout({ children }) {
    return (
        <div className="flex h-screen" dir="rtl">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
```

### Using layout in a page
```jsx
import AppLayout from '@/Components/Layout/AppLayout';

export default function PropertyIndex({ properties }) {
    return (
        <AppLayout>
            <h1>Properties</h1>
        </AppLayout>
    );
}
```

---

## Phase 4 — Auth & Roles

### Users table addition (migration)
```php
Schema::table('users', function (Blueprint $table) {
    $table->enum('role', ['owner', 'tenant', 'staff'])->default('staff');
    $table->boolean('is_active')->default(true);
});
```

### Tables
```sql
roles:           id, name, description
permissions:     id, name, module, action (view|create|edit|delete)
role_permission: role_id, permission_id
users:           id, name, email, password, role, role_id (FK for staff)
```

### Check permission in Controller
```php
// app/Http/Middleware or Controller
$this->authorize('view', Property::class);
// or
abort_unless(auth()->user()->can('property.view'), 403);
```

### Check permission in React
```jsx
// resources/js/Hooks/usePermission.js
import { usePage } from '@inertiajs/react';

export function usePermission(permission) {
    const { auth } = usePage().props;
    return auth.permissions?.includes(permission) ?? false;
}

// Usage in component
const canCreate = usePermission('property.create');
{canCreate && <Button>Add Property</Button>}
```

---

## Module 1 — Dashboard

### Controller
```php
class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'total_properties'   => Property::count(),
                'total_units'        => Unit::count(),
                'occupied_units'     => Unit::where('status', 'occupied')->count(),
                'vacant_units'       => Unit::where('status', 'vacant')->count(),
                'monthly_income'     => Payment::thisMonth()->sum('amount'),
                'pending_requests'   => MaintenanceRequest::where('status', 'open')->count(),
                'overdue_invoices'   => Invoice::where('status', 'overdue')->count(),
            ],
        ]);
    }
}
```

### Route
```php
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
```

---

## Module 2 — Property

### Migration
```php
Schema::create('properties', function (Blueprint $table) {
    $table->id();
    $table->foreignId('owner_id')->constrained('users');
    $table->string('name');
    $table->enum('type', ['residential', 'commercial', 'mixed']);
    $table->text('address');
    $table->string('city');
    $table->text('description')->nullable();
    $table->enum('status', ['active', 'inactive'])->default('active');
    $table->timestamps();
});

Schema::create('units', function (Blueprint $table) {
    $table->id();
    $table->foreignId('property_id')->constrained()->cascadeOnDelete();
    $table->string('unit_number');
    $table->string('floor')->nullable();
    $table->enum('type', ['apartment', 'shop', 'office', 'warehouse', 'other']);
    $table->decimal('area_m2', 8, 2)->nullable();
    $table->decimal('rent_price', 12, 2);
    $table->enum('status', ['vacant', 'occupied', 'under_maintenance'])->default('vacant');
    $table->timestamps();
});
```

### Controller
```php
class PropertyController extends Controller
{
    public function index()
    {
        return Inertia::render('Property/Index', [
            'properties' => Property::with('units')->paginate(15),
        ]);
    }

    public function create()
    {
        return Inertia::render('Property/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'type'    => 'required|in:residential,commercial,mixed',
            'address' => 'required|string',
            'city'    => 'required|string',
        ]);

        Property::create([...$request->all(), 'owner_id' => auth()->id()]);

        return redirect()->route('properties.index')->with('success', 'Property created.');
    }

    public function edit(Property $property)
    {
        return Inertia::render('Property/Edit', ['property' => $property]);
    }

    public function update(Request $request, Property $property)
    {
        $property->update($request->validated());
        return redirect()->route('properties.index')->with('success', 'Updated.');
    }

    public function destroy(Property $property)
    {
        $property->delete();
        return redirect()->route('properties.index')->with('success', 'Deleted.');
    }
}
```

### Routes
```php
Route::resource('properties', PropertyController::class);
Route::resource('properties.units', UnitController::class);
```

---

## Module 3 — Tenants

### Migration
```php
Schema::create('tenants', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('phone');
    $table->string('national_id')->nullable();
    $table->string('email')->nullable();
    $table->string('emergency_contact')->nullable();
    $table->text('notes')->nullable();
    $table->timestamps();
});

Schema::create('leases', function (Blueprint $table) {
    $table->id();
    $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
    $table->foreignId('unit_id')->constrained();
    $table->date('start_date');
    $table->date('end_date')->nullable();
    $table->decimal('rent_amount', 12, 2);
    $table->decimal('deposit_amount', 12, 2)->default(0);
    $table->enum('status', ['active', 'expired', 'terminated'])->default('active');
    $table->enum('deal_type', ['rent', 'giraw', 'sale'])->default('rent');
    $table->timestamps();
});
```

### Routes
```php
Route::resource('tenants', TenantController::class);
Route::get('tenants/{tenant}/history', [TenantController::class, 'history'])->name('tenants.history');
Route::resource('leases', LeaseController::class);
```

---

## Module 4 — Billing Center

### Migration
```php
Schema::create('invoices', function (Blueprint $table) {
    $table->id();
    $table->foreignId('lease_id')->constrained();
    $table->decimal('amount', 12, 2);
    $table->date('due_date');
    $table->date('paid_date')->nullable();
    $table->enum('status', ['unpaid', 'partial', 'paid', 'overdue'])->default('unpaid');
    $table->enum('type', ['rent', 'deposit', 'other'])->default('rent');
    $table->text('notes')->nullable();
    $table->timestamps();
});

Schema::create('payments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('invoice_id')->constrained();
    $table->decimal('amount', 12, 2);
    $table->enum('method', ['cash', 'bank', 'mobile'])->default('cash');
    $table->string('reference')->nullable();
    $table->timestamp('paid_at');
    $table->text('notes')->nullable();
    $table->timestamps();
});

Schema::create('recurring_settings', function (Blueprint $table) {
    $table->id();
    $table->foreignId('lease_id')->constrained()->cascadeOnDelete();
    $table->enum('frequency', ['monthly', 'quarterly'])->default('monthly');
    $table->unsignedTinyInteger('day_of_month')->default(1);
    $table->date('next_due_date');
    $table->boolean('enabled')->default(true);
    $table->timestamps();
});
```

### Auto Invoice Scheduler
```php
// app/Console/Commands/GenerateRecurringInvoices.php
public function handle()
{
    RecurringSetting::where('enabled', true)
        ->where('next_due_date', '<=', today())
        ->each(function ($setting) {
            Invoice::create([
                'lease_id' => $setting->lease_id,
                'amount'   => $setting->lease->rent_amount,
                'due_date' => $setting->next_due_date,
                'status'   => 'unpaid',
                'type'     => 'rent',
            ]);

            $setting->update([
                'next_due_date' => $setting->frequency === 'monthly'
                    ? $setting->next_due_date->addMonth()
                    : $setting->next_due_date->addQuarter(),
            ]);
        });
}

// routes/console.php
Schedule::command('invoices:generate')->daily();
```

### Routes
```php
Route::resource('invoices', InvoiceController::class);
Route::post('invoices/{invoice}/pay', [InvoiceController::class, 'pay'])->name('invoices.pay');
Route::get('invoices/{invoice}/pdf', [InvoiceController::class, 'pdf'])->name('invoices.pdf');
Route::resource('recurring', RecurringController::class);
```

---

## Module 5 — Expense

### Migration
```php
Schema::create('expenses', function (Blueprint $table) {
    $table->id();
    $table->foreignId('property_id')->constrained();
    $table->foreignId('unit_id')->nullable()->constrained();
    $table->enum('category', ['maintenance', 'utility', 'tax', 'insurance', 'cleaning', 'other']);
    $table->decimal('amount', 12, 2);
    $table->date('date');
    $table->text('description')->nullable();
    $table->string('receipt_path')->nullable();
    $table->foreignId('created_by')->constrained('users');
    $table->timestamps();
});
```

### Routes
```php
Route::resource('expenses', ExpenseController::class);
```

---

## Module 6 — Documents

### Migration
```php
Schema::create('documents', function (Blueprint $table) {
    $table->id();
    $table->foreignId('tenant_id')->constrained();
    $table->foreignId('lease_id')->nullable()->constrained();
    $table->enum('type', ['national_id', 'contract', 'guarantor', 'photo', 'other']);
    $table->string('file_path');
    $table->string('original_name');
    $table->date('expiry_date')->nullable();
    $table->text('notes')->nullable();
    $table->foreignId('uploaded_by')->constrained('users');
    $table->timestamps();
});
```

### Upload Controller
```php
public function store(Request $request)
{
    $path = $request->file('file')->store('documents', 'private');

    Document::create([
        'tenant_id'     => $request->tenant_id,
        'type'          => $request->type,
        'file_path'     => $path,
        'original_name' => $request->file('file')->getClientOriginalName(),
        'uploaded_by'   => auth()->id(),
    ]);

    return redirect()->back()->with('success', 'Document uploaded.');
}

public function download(Document $document)
{
    return Storage::disk('private')->download($document->file_path, $document->original_name);
}
```

### Routes
```php
Route::resource('documents', DocumentController::class);
Route::get('documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');
```

---

## Module 7 — Maintenance

### Migration
```php
Schema::create('maintenance_persons', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('phone');
    $table->enum('specialty', ['plumbing', 'electrical', 'carpentry', 'painting', 'general']);
    $table->enum('status', ['active', 'inactive'])->default('active');
    $table->timestamps();
});

Schema::create('maintenance_requests', function (Blueprint $table) {
    $table->id();
    $table->foreignId('unit_id')->constrained();
    $table->foreignId('reported_by')->constrained('users');
    $table->foreignId('assigned_to')->nullable()->constrained('maintenance_persons');
    $table->string('issue');
    $table->text('description')->nullable();
    $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
    $table->enum('status', ['open', 'assigned', 'in_progress', 'resolved', 'closed'])->default('open');
    $table->decimal('cost', 12, 2)->nullable();
    $table->timestamp('resolved_at')->nullable();
    $table->timestamps();
});
```

### Routes
```php
Route::resource('maintenance/persons', MaintenancePersonController::class);
Route::resource('maintenance/requests', MaintenanceRequestController::class);
Route::patch('maintenance/requests/{request}/assign', [MaintenanceRequestController::class, 'assign']);
Route::patch('maintenance/requests/{request}/status', [MaintenanceRequestController::class, 'updateStatus']);
```

---

## Module 8 — Notice Board

### Migration
```php
Schema::create('notices', function (Blueprint $table) {
    $table->id();
    $table->foreignId('created_by')->constrained('users');
    $table->string('title');
    $table->text('body');
    $table->enum('target_role', ['all', 'tenant', 'staff', 'owner'])->default('all');
    $table->boolean('is_pinned')->default(false);
    $table->timestamp('published_at')->nullable();
    $table->timestamp('expires_at')->nullable();
    $table->timestamps();
});
```

### Routes
```php
Route::resource('notices', NoticeController::class);
```

---

## Module 9 — Agreement

### Migration
```php
Schema::create('agreements', function (Blueprint $table) {
    $table->id();
    $table->foreignId('lease_id')->constrained();
    $table->enum('type', ['rent', 'giraw', 'sale']);
    $table->json('terms')->nullable();
    $table->string('file_path')->nullable();
    $table->timestamp('generated_at')->nullable();
    $table->timestamp('signed_at')->nullable();
    $table->timestamps();
});
```

### PDF Generation
```php
use Barryvdh\DomPDF\Facade\Pdf;

public function generate(Request $request)
{
    $lease     = Lease::with(['tenant', 'unit.property'])->findOrFail($request->lease_id);
    $agreement = Agreement::create([
        'lease_id'     => $lease->id,
        'type'         => $request->type,
        'terms'        => $request->terms,
        'generated_at' => now(),
    ]);

    $pdf  = Pdf::loadView('agreements.' . $request->type, compact('lease', 'agreement'));
    $path = 'agreements/' . $agreement->id . '.pdf';
    Storage::put($path, $pdf->output());
    $agreement->update(['file_path' => $path]);

    return redirect()->route('agreements.index')->with('success', 'Agreement generated.');
}
```

### Routes
```php
Route::resource('agreements', AgreementController::class);
Route::post('agreements/generate', [AgreementController::class, 'generate'])->name('agreements.generate');
Route::get('agreements/{agreement}/download', [AgreementController::class, 'download'])->name('agreements.download');
```

---

## Module 10 — Reports

### Controller Example
```php
public function earnings(Request $request)
{
    $earnings = Payment::query()
        ->when($request->from, fn($q) => $q->whereDate('paid_at', '>=', $request->from))
        ->when($request->to,   fn($q) => $q->whereDate('paid_at', '<=', $request->to))
        ->when($request->property_id, fn($q) => $q->whereHas('invoice.lease.unit', fn($q) =>
            $q->where('property_id', $request->property_id)))
        ->selectRaw('DATE_FORMAT(paid_at, "%Y-%m") as month, SUM(amount) as total')
        ->groupBy('month')
        ->orderBy('month')
        ->get();

    return Inertia::render('Reports/Earnings', [
        'earnings'   => $earnings,
        'properties' => Property::select('id', 'name')->get(),
        'filters'    => $request->only(['from', 'to', 'property_id']),
    ]);
}
```

### Routes
```php
Route::prefix('reports')->name('reports.')->group(function () {
    Route::get('earnings',    [ReportController::class, 'earnings'])->name('earnings');
    Route::get('profit-loss', [ReportController::class, 'profitLoss'])->name('profit_loss');
    Route::get('expenses',    [ReportController::class, 'expenses'])->name('expenses');
    Route::get('occupancy',   [ReportController::class, 'occupancy'])->name('occupancy');
    Route::get('maintenance', [ReportController::class, 'maintenance'])->name('maintenance');
    Route::get('tenants',     [ReportController::class, 'tenants'])->name('tenants');
    Route::get('{type}/export', [ReportController::class, 'export'])->name('export');
});
```

---

## Module 11 — Settings

### Routes
```php
Route::prefix('settings')->name('settings.')->group(function () {
    Route::resource('staff',       StaffController::class);
    Route::resource('roles',       RoleController::class);
    Route::put('roles/{role}/permissions', [RoleController::class, 'updatePermissions'])
         ->name('roles.permissions');
});
```

---

## Dari / RTL Setup

### resources/views/app.blade.php
```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased bg-gray-100">
    @inertia
</body>
</html>
```

### Tailwind RTL Plugin
```bash
npm install tailwindcss-rtl
```
```js
// tailwind.config.js
module.exports = {
    plugins: [require('tailwindcss-rtl')],
}
```

### Dari Translations
```js
// resources/js/translations/dari.js
export const t = {
    dashboard     : 'داشبورد',
    properties    : 'ملکیت ها',
    units         : 'واحد ها',
    tenants       : 'مستاجران',
    billing       : 'مرکز بیلینگ',
    invoices      : 'فاکتور ها',
    expense       : 'مصارف',
    documents     : 'اسناد',
    maintenance   : 'ساختمانی',
    notices       : 'اعلانات',
    reports       : 'راپور ها',
    agreements    : 'قراردادها',
    settings      : 'تنظیمات',
    staff         : 'کارمندان',
    save          : 'ذخیره',
    cancel        : 'لغو',
    delete        : 'حذف',
    edit          : 'ویرایش',
    add           : 'اضافه کردن',
    search        : 'جستجو',
    status        : 'وضعیت',
    name          : 'نام',
    phone         : 'تلفن',
    address       : 'آدرس',
    date          : 'تاریخ',
    amount        : 'مبلغ',
    active        : 'فعال',
    inactive      : 'غیر فعال',
    occupied      : 'اشغال',
    vacant        : 'خالی',
    paid          : 'پرداخت شده',
    unpaid        : 'پرداخت نشده',
    overdue       : 'عقب افتاده',
}
```

```jsx
// resources/js/Hooks/useLang.js
import { t } from '../translations/dari';
export const useLang = () => t;

// Usage anywhere
const lang = useLang();
<h1>{lang.properties}</h1>
```

---

## All Routes Summary (web.php)

```php
<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    DashboardController, PropertyController, UnitController,
    TenantController, LeaseController, InvoiceController,
    RecurringController, ExpenseController, DocumentController,
    MaintenancePersonController, MaintenanceRequestController,
    NoticeController, ReportController, AgreementController,
    StaffController, RoleController
};

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('properties', PropertyController::class);
    Route::resource('properties.units', UnitController::class)->shallow();

    Route::resource('tenants', TenantController::class);
    Route::get('tenants/{tenant}/history', [TenantController::class, 'history'])->name('tenants.history');
    Route::resource('leases', LeaseController::class);

    Route::resource('invoices', InvoiceController::class);
    Route::post('invoices/{invoice}/pay', [InvoiceController::class, 'pay'])->name('invoices.pay');
    Route::get('invoices/{invoice}/pdf', [InvoiceController::class, 'pdf'])->name('invoices.pdf');
    Route::resource('recurring', RecurringController::class);

    Route::resource('expenses', ExpenseController::class);

    Route::resource('documents', DocumentController::class);
    Route::get('documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');

    Route::resource('maintenance/persons', MaintenancePersonController::class)->names('maintenance.persons');
    Route::resource('maintenance/requests', MaintenanceRequestController::class)->names('maintenance.requests');
    Route::patch('maintenance/requests/{request}/assign', [MaintenanceRequestController::class, 'assign'])->name('maintenance.requests.assign');

    Route::resource('notices', NoticeController::class);

    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('earnings',    [ReportController::class, 'earnings'])->name('earnings');
        Route::get('profit-loss', [ReportController::class, 'profitLoss'])->name('profitLoss');
        Route::get('expenses',    [ReportController::class, 'expenses'])->name('expenses');
        Route::get('occupancy',   [ReportController::class, 'occupancy'])->name('occupancy');
        Route::get('maintenance', [ReportController::class, 'maintenance'])->name('maintenance');
        Route::get('tenants',     [ReportController::class, 'tenants'])->name('tenants');
        Route::get('{type}/export', [ReportController::class, 'export'])->name('export');
    });

    Route::resource('agreements', AgreementController::class);
    Route::post('agreements/generate', [AgreementController::class, 'generate'])->name('agreements.generate');
    Route::get('agreements/{agreement}/download', [AgreementController::class, 'download'])->name('agreements.download');

    Route::prefix('settings')->name('settings.')->group(function () {
        Route::resource('staff', StaffController::class);
        Route::resource('roles', RoleController::class);
        Route::put('roles/{role}/permissions', [RoleController::class, 'updatePermissions'])->name('roles.permissions');
    });
});

require __DIR__ . '/auth.php';
```

---

## Development Workflow

```
For each module:
1. php artisan make:migration create_{table}_table
2. php artisan migrate
3. php artisan make:model {Model}
4. php artisan make:controller {Module}Controller
5. Add routes in web.php
6. Create React page in resources/js/Pages/{Module}/
7. Test in browser
```

## Key Commands
```bash
php artisan serve          # start Laravel server
npm run dev                # start Vite (React hot reload)
php artisan migrate        # run migrations
php artisan migrate:fresh  # reset all migrations
php artisan tinker         # Laravel REPL for testing
php artisan schedule:run   # run scheduled tasks (auto invoices)
php artisan queue:work     # run background jobs (PDF, exports)
```
