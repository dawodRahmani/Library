<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Employee;
use App\Models\Expense;
use App\Models\Floor;
use App\Models\InventoryItem;
use App\Models\MenuItem;
use App\Models\Salary;
use App\Models\Supplier;
use App\Models\Table;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Permissions & Roles (must run before users) ─────────
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
        ]);

        // ── Admin User ──────────────────────────────────────────
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            ['name' => 'Admin', 'password' => Hash::make('1234'), 'is_active' => true],
        );
        $admin->syncRoles(['admin']);

        // ── Floors ──────────────────────────────────────────────
        $floors = [
            ['name' => 'طبقه اول',  'description' => 'سالن اصلی',   'color' => 'emerald', 'order' => 1],
            ['name' => 'طبقه دوم',  'description' => 'سالن بالایی', 'color' => 'blue',    'order' => 2],
            ['name' => 'تراس',      'description' => 'فضای باز',    'color' => 'amber',   'order' => 3],
            ['name' => 'VIP',       'description' => 'اتاق خصوصی',  'color' => 'purple',  'order' => 4],
        ];

        $createdFloors = [];
        foreach ($floors as $floorData) {
            $createdFloors[] = Floor::firstOrCreate(['name' => $floorData['name']], $floorData);
        }

        // ── Tables ──────────────────────────────────────────────
        $tables = [
            ['floor' => 'طبقه اول', 'number' => 1,  'capacity' => 4],
            ['floor' => 'طبقه اول', 'number' => 2,  'capacity' => 4],
            ['floor' => 'طبقه اول', 'number' => 3,  'capacity' => 6],
            ['floor' => 'طبقه اول', 'number' => 4,  'capacity' => 4],
            ['floor' => 'طبقه دوم', 'number' => 5,  'capacity' => 4],
            ['floor' => 'طبقه دوم', 'number' => 6,  'capacity' => 6],
            ['floor' => 'طبقه دوم', 'number' => 7,  'capacity' => 4],
            ['floor' => 'تراس',     'number' => 8,  'capacity' => 4],
            ['floor' => 'تراس',     'number' => 9,  'capacity' => 6],
            ['floor' => 'VIP',      'number' => 10, 'capacity' => 8, 'name' => 'VIP 1'],
        ];

        $floorMap = Floor::pluck('id', 'name');
        foreach ($tables as $tableData) {
            $floorId = $floorMap[$tableData['floor']];
            Table::firstOrCreate(
                ['number' => $tableData['number']],
                [
                    'floor_id' => $floorId,
                    'capacity' => $tableData['capacity'],
                    'name'     => $tableData['name'] ?? null,
                    'status'   => 'available',
                ],
            );
        }

        // ── Categories ──────────────────────────────────────────
        $categories = [
            ['name' => 'پیش غذا',   'sort_order' => 1],
            ['name' => 'غذای اصلی', 'sort_order' => 2],
            ['name' => 'نوشیدنی',   'sort_order' => 3],
            ['name' => 'دسر',       'sort_order' => 4],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['name' => $cat['name']], $cat);
        }

        $catMap = Category::pluck('id', 'name');

        // ── Menu Items ──────────────────────────────────────────
        $items = [
            // پیش غذا
            ['category' => 'پیش غذا',   'name' => 'بولانی',        'price' => 100, 'sort_order' => 1],
            ['category' => 'پیش غذا',   'name' => 'سلاطه',         'price' => 80,  'sort_order' => 2],
            ['category' => 'پیش غذا',   'name' => 'آش',            'price' => 120, 'sort_order' => 3, 'is_available' => false],
            // غذای اصلی
            ['category' => 'غذای اصلی', 'name' => 'کابلی پلو',     'price' => 300, 'sort_order' => 1],
            ['category' => 'غذای اصلی', 'name' => 'چلو کباب',      'price' => 350, 'sort_order' => 2],
            ['category' => 'غذای اصلی', 'name' => 'مرغ کبابی',     'price' => 400, 'sort_order' => 3],
            ['category' => 'غذای اصلی', 'name' => 'قابلی ازبکی',   'price' => 280, 'sort_order' => 4],
            // نوشیدنی
            ['category' => 'نوشیدنی',   'name' => 'چای سبز',       'price' => 50,  'sort_order' => 1],
            ['category' => 'نوشیدنی',   'name' => 'چای سیاه',      'price' => 50,  'sort_order' => 2],
            ['category' => 'نوشیدنی',   'name' => 'دوغ',           'price' => 60,  'sort_order' => 3],
            // دسر
            ['category' => 'دسر',       'name' => 'فرنی',          'price' => 100, 'sort_order' => 1],
            ['category' => 'دسر',       'name' => 'شیر یخ',        'price' => 120, 'sort_order' => 2],
        ];

        foreach ($items as $item) {
            MenuItem::firstOrCreate(
                ['name' => $item['name'], 'category_id' => $catMap[$item['category']]],
                [
                    'category_id'  => $catMap[$item['category']],
                    'price'        => $item['price'],
                    'sort_order'   => $item['sort_order'],
                    'is_available' => $item['is_available'] ?? true,
                ],
            );
        }

        // ── Employees ───────────────────────────────────────────
        $employees = [
            ['name' => 'احمد رحمانی',  'role' => 'manager',  'phone' => '0700000001', 'hire_date' => '2023-01-01', 'base_salary' => 15000],
            ['name' => 'علی محمدی',    'role' => 'waiter',   'phone' => '0700000002', 'hire_date' => '2023-03-15', 'base_salary' => 8000],
            ['name' => 'فاطمه کریمی',  'role' => 'waiter',   'phone' => '0700000003', 'hire_date' => '2023-06-01', 'base_salary' => 8000],
            ['name' => 'محمد حسینی',   'role' => 'chef',     'phone' => '0700000004', 'hire_date' => '2022-11-01', 'base_salary' => 12000],
            ['name' => 'زهرا نوری',    'role' => 'cashier',  'phone' => '0700000005', 'hire_date' => '2024-01-10', 'base_salary' => 9000],
        ];

        foreach ($employees as $emp) {
            Employee::firstOrCreate(
                ['phone' => $emp['phone']],
                array_merge($emp, ['is_active' => true]),
            );
        }

        // ── Expenses ────────────────────────────────────────────
        $adminId = User::where('email', 'admin@gmail.com')->value('id');
        $expenseData = [
            ['category' => 'rent',        'description' => 'اجاره ماهانه',        'amount' => 50000, 'date' => '2026-03-01'],
            ['category' => 'electricity', 'description' => 'برق ماه مارچ',        'amount' => 8000,  'date' => '2026-03-05'],
            ['category' => 'groceries',   'description' => 'خرید مواد اولیه',     'amount' => 25000, 'date' => '2026-03-10'],
            ['category' => 'supplies',    'description' => 'لوازم آشپزخانه',      'amount' => 5000,  'date' => '2026-03-12'],
            ['category' => 'gas',         'description' => 'گاز ماه مارچ',        'amount' => 4000,  'date' => '2026-03-15'],
        ];

        foreach ($expenseData as $exp) {
            Expense::firstOrCreate(
                ['description' => $exp['description'], 'date' => $exp['date']],
                array_merge($exp, ['created_by' => $adminId]),
            );
        }

        // ── Suppliers ───────────────────────────────────────────
        $supplierData = [
            ['name' => 'شرکت غلات کابل',    'contact_name' => 'حسین احمدی',   'phone' => '0700111001', 'category' => 'grains',     'address' => 'کابل، مارکت شیرپور'],
            ['name' => 'قصابی برادران نوری', 'contact_name' => 'علی نوری',     'phone' => '0700111002', 'category' => 'meat',       'address' => 'کابل، چهراهی قمبر'],
            ['name' => 'بازار سبزیجات مرکزی','contact_name' => 'محمد رضایی',   'phone' => '0700111003', 'category' => 'vegetables', 'address' => 'کابل، مارکت پل سرخ'],
            ['name' => 'شرکت لبنیات افغان',  'contact_name' => 'زهرا کریمی',   'phone' => '0700111004', 'category' => 'dairy',      'address' => 'کابل، کارته سه'],
        ];

        foreach ($supplierData as $sup) {
            Supplier::firstOrCreate(['phone' => $sup['phone']], $sup);
        }

        // ── Inventory Items ─────────────────────────────────────
        $inventoryData = [
            ['name' => 'برنج',        'unit' => 'kg',    'cost_per_unit' => 120, 'current_stock' => 45, 'min_stock_level' => 20, 'category' => 'grains'],
            ['name' => 'روغن',        'unit' => 'liter', 'cost_per_unit' => 250, 'current_stock' => 8,  'min_stock_level' => 10, 'category' => 'oils'],
            ['name' => 'گوشت گاو',   'unit' => 'kg',    'cost_per_unit' => 550, 'current_stock' => 12, 'min_stock_level' => 15, 'category' => 'meat'],
            ['name' => 'گوشت مرغ',   'unit' => 'kg',    'cost_per_unit' => 350, 'current_stock' => 18, 'min_stock_level' => 10, 'category' => 'meat'],
            ['name' => 'آرد',         'unit' => 'kg',    'cost_per_unit' => 80,  'current_stock' => 30, 'min_stock_level' => 25, 'category' => 'grains'],
            ['name' => 'پیاز',        'unit' => 'kg',    'cost_per_unit' => 40,  'current_stock' => 25, 'min_stock_level' => 15, 'category' => 'vegetables'],
            ['name' => 'بادنجان رومی','unit' => 'kg',    'cost_per_unit' => 60,  'current_stock' => 10, 'min_stock_level' => 8,  'category' => 'vegetables'],
            ['name' => 'مرچ',         'unit' => 'kg',    'cost_per_unit' => 100, 'current_stock' => 3,  'min_stock_level' => 5,  'category' => 'spices'],
            ['name' => 'زردچوبه',     'unit' => 'kg',    'cost_per_unit' => 300, 'current_stock' => 2,  'min_stock_level' => 3,  'category' => 'spices'],
            ['name' => 'نمک',         'unit' => 'kg',    'cost_per_unit' => 25,  'current_stock' => 15, 'min_stock_level' => 5,  'category' => 'spices'],
            ['name' => 'چای سبز',    'unit' => 'kg',    'cost_per_unit' => 400, 'current_stock' => 5,  'min_stock_level' => 3,  'category' => 'beverages'],
            ['name' => 'چای سیاه',   'unit' => 'kg',    'cost_per_unit' => 350, 'current_stock' => 4,  'min_stock_level' => 3,  'category' => 'beverages'],
            ['name' => 'شکر',         'unit' => 'kg',    'cost_per_unit' => 90,  'current_stock' => 20, 'min_stock_level' => 10, 'category' => 'grains'],
            ['name' => 'دوغ',         'unit' => 'liter', 'cost_per_unit' => 60,  'current_stock' => 2,  'min_stock_level' => 10, 'category' => 'beverages'],
            ['name' => 'کچالو',       'unit' => 'kg',    'cost_per_unit' => 35,  'current_stock' => 40, 'min_stock_level' => 20, 'category' => 'vegetables'],
        ];

        foreach ($inventoryData as $inv) {
            InventoryItem::firstOrCreate(
                ['name' => $inv['name']],
                array_merge($inv, ['is_active' => true]),
            );
        }
    }
}
