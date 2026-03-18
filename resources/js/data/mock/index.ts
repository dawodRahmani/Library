import type { Category, FoodItem, RestaurantTable, TableFloor, Order, OrderItem, Employee, Salary, Expense } from './types';

// ── Categories ──────────────────────────────────────────────
export const mockCategories: Category[] = [
    { id: 1, name: 'پیش غذا', sort_order: 1, items_count: 3 },
    { id: 2, name: 'غذای اصلی', sort_order: 2, items_count: 4 },
    { id: 3, name: 'نوشیدنی', sort_order: 3, items_count: 3 },
    { id: 4, name: 'دسر', sort_order: 4, items_count: 2 },
];

// ── Food Items ──────────────────────────────────────────────
export const mockFoodItems: FoodItem[] = [
    // پیش غذا (Appetizers)
    { id: 1, category_id: 1, category: mockCategories[0], name: 'بولانی', price: 100, image: '/images/food/bolani.jpg', is_available: true, sort_order: 1 },
    { id: 2, category_id: 1, category: mockCategories[0], name: 'سلاطه', price: 80, image: '/images/food/salad.jpg', is_available: true, sort_order: 2 },
    { id: 3, category_id: 1, category: mockCategories[0], name: 'آش', price: 120, image: '/images/food/aush.jpg', is_available: false, sort_order: 3 },
    // غذای اصلی (Main Dishes)
    { id: 4, category_id: 2, category: mockCategories[1], name: 'کابلی پلو', price: 300, image: '/images/food/kabuli.jpg', is_available: true, sort_order: 1 },
    { id: 5, category_id: 2, category: mockCategories[1], name: 'چلو کباب', price: 350, image: '/images/food/kabab.jpg', is_available: true, sort_order: 2 },
    { id: 6, category_id: 2, category: mockCategories[1], name: 'مرغ کبابی', price: 400, image: '/images/food/chicken.jpg', is_available: true, sort_order: 3 },
    { id: 7, category_id: 2, category: mockCategories[1], name: 'قابلی ازبکی', price: 280, image: '/images/food/qabuli.jpg', is_available: true, sort_order: 4 },
    // نوشیدنی (Drinks)
    { id: 8, category_id: 3, category: mockCategories[2], name: 'چای سبز', price: 50, image: '/images/food/green-tea.jpg', is_available: true, sort_order: 1 },
    { id: 9, category_id: 3, category: mockCategories[2], name: 'چای سیاه', price: 50, image: '/images/food/black-tea.jpg', is_available: true, sort_order: 2 },
    { id: 10, category_id: 3, category: mockCategories[2], name: 'دوغ', price: 60, image: '/images/food/doogh.jpg', is_available: true, sort_order: 3 },
    // دسر (Desserts)
    { id: 11, category_id: 4, category: mockCategories[3], name: 'فرنی', price: 100, image: '/images/food/firni.jpg', is_available: true, sort_order: 1 },
    { id: 12, category_id: 4, category: mockCategories[3], name: 'شیر یخ', price: 120, image: '/images/food/sheer-yakh.jpg', is_available: true, sort_order: 2 },
];

// ── Floors ──────────────────────────────────────────────────
export const mockFloors: TableFloor[] = [
    { id: 1, name: 'طبقه اول', description: 'سالن اصلی', color: 'emerald', order: 1 },
    { id: 2, name: 'طبقه دوم', description: 'سالن بالایی', color: 'blue', order: 2 },
    { id: 3, name: 'تراس', description: 'فضای باز', color: 'amber', order: 3 },
    { id: 4, name: 'VIP', description: 'اتاق خصوصی', color: 'purple', order: 4 },
];

// ── Tables ──────────────────────────────────────────────────
export const mockTables: RestaurantTable[] = [
    { id: 1, number: 1, capacity: 4, status: 'available', floor_id: 1, floor_name: 'طبقه اول' },
    { id: 2, number: 2, capacity: 4, status: 'occupied', active_order_id: 1024, floor_id: 1, floor_name: 'طبقه اول' },
    { id: 3, number: 3, capacity: 6, status: 'available', floor_id: 1, floor_name: 'طبقه اول' },
    { id: 4, number: 4, capacity: 4, status: 'available', floor_id: 1, floor_name: 'طبقه اول' },
    { id: 5, number: 5, capacity: 4, status: 'available', floor_id: 2, floor_name: 'طبقه دوم' },
    { id: 6, number: 6, capacity: 6, status: 'available', floor_id: 2, floor_name: 'طبقه دوم' },
    { id: 7, number: 7, capacity: 4, status: 'occupied', active_order_id: 1023, floor_id: 2, floor_name: 'طبقه دوم' },
    { id: 8, number: 8, capacity: 4, status: 'available', floor_id: 3, floor_name: 'تراس' },
    { id: 9, number: 9, capacity: 6, status: 'available', floor_id: 3, floor_name: 'تراس' },
    { id: 10, number: 10, name: 'VIP 1', capacity: 8, status: 'occupied', active_order_id: 1025, floor_id: 4, floor_name: 'VIP' },
];

// ── Employees ───────────────────────────────────────────────
export const mockEmployees: Employee[] = [
    { id: 1, name: 'احمد حسینی', role: 'manager', phone: '0799123456', hire_date: '1403-01-01', is_active: true, base_salary: 25000 },
    { id: 2, name: 'محمد رضایی', role: 'waiter', phone: '0788654321', hire_date: '1403-03-15', is_active: true, base_salary: 15000 },
    { id: 3, name: 'علی احمدی', role: 'chef', phone: '0777111222', hire_date: '1403-02-01', is_active: true, base_salary: 20000 },
    { id: 4, name: 'حسن نوری', role: 'cashier', phone: '0766333444', hire_date: '1403-06-01', is_active: true, base_salary: 18000 },
];

// ── Orders ──────────────────────────────────────────────────
export const mockOrders: Order[] = [
    {
        id: 1024,
        table_id: 2,
        table: mockTables[1],
        order_number: '#1024',
        status: 'in_kitchen',
        total_amount: 1100,
        created_by: 2,
        created_by_name: 'محمد رضایی',
        created_at: '2026-03-15T14:30:00',
        items: [
            { id: 1, order_id: 1024, food_item_id: 4, food_item: mockFoodItems[3], quantity: 2, unit_price: 300, subtotal: 600 },
            { id: 2, order_id: 1024, food_item_id: 6, food_item: mockFoodItems[5], quantity: 1, unit_price: 400, subtotal: 400 },
            { id: 3, order_id: 1024, food_item_id: 8, food_item: mockFoodItems[7], quantity: 2, unit_price: 50, subtotal: 100 },
        ],
    },
    {
        id: 1025,
        table_id: 5,
        table: mockTables[4],
        order_number: '#1025',
        status: 'pending',
        total_amount: 1560,
        created_by: 2,
        created_by_name: 'محمد رضایی',
        created_at: '2026-03-15T14:45:00',
        items: [
            { id: 4, order_id: 1025, food_item_id: 5, food_item: mockFoodItems[4], quantity: 3, unit_price: 350, subtotal: 1050 },
            { id: 5, order_id: 1025, food_item_id: 1, food_item: mockFoodItems[0], quantity: 3, unit_price: 100, subtotal: 300 },
            { id: 6, order_id: 1025, food_item_id: 10, food_item: mockFoodItems[9], quantity: 3, unit_price: 60, subtotal: 180, notes: 'سرد باشه' },
        ],
    },
    {
        id: 1023,
        table_id: 7,
        table: mockTables[6],
        order_number: '#1023',
        status: 'served',
        total_amount: 2100,
        created_by: 2,
        created_by_name: 'محمد رضایی',
        created_at: '2026-03-15T13:45:00',
        items: [
            { id: 7, order_id: 1023, food_item_id: 5, food_item: mockFoodItems[4], quantity: 3, unit_price: 350, subtotal: 1050 },
            { id: 8, order_id: 1023, food_item_id: 4, food_item: mockFoodItems[3], quantity: 2, unit_price: 300, subtotal: 600 },
            { id: 9, order_id: 1023, food_item_id: 8, food_item: mockFoodItems[7], quantity: 3, unit_price: 50, subtotal: 150 },
            { id: 10, order_id: 1023, food_item_id: 9, food_item: mockFoodItems[8], quantity: 3, unit_price: 50, subtotal: 150, notes: 'بدون شکر' },
            { id: 11, order_id: 1023, food_item_id: 11, food_item: mockFoodItems[10], quantity: 1, unit_price: 100, subtotal: 100, notes: 'اضافه شیر' },
        ],
    },
    {
        id: 1022,
        table_id: 1,
        table: mockTables[0],
        order_number: '#1022',
        status: 'paid',
        total_amount: 600,
        created_by: 1,
        created_by_name: 'احمد حسینی',
        paid_at: '2026-03-15T13:30:00',
        created_at: '2026-03-15T12:50:00',
        items: [
            { id: 12, order_id: 1022, food_item_id: 1, food_item: mockFoodItems[0], quantity: 4, unit_price: 100, subtotal: 400 },
            { id: 13, order_id: 1022, food_item_id: 8, food_item: mockFoodItems[7], quantity: 4, unit_price: 50, subtotal: 200 },
        ],
    },
    {
        id: 1021,
        table_id: 3,
        table: mockTables[2],
        order_number: '#1021',
        status: 'paid',
        total_amount: 1850,
        created_by: 2,
        created_by_name: 'محمد رضایی',
        paid_at: '2026-03-15T12:15:00',
        created_at: '2026-03-15T11:30:00',
        items: [
            { id: 14, order_id: 1021, food_item_id: 6, food_item: mockFoodItems[5], quantity: 2, unit_price: 400, subtotal: 800 },
            { id: 15, order_id: 1021, food_item_id: 7, food_item: mockFoodItems[6], quantity: 2, unit_price: 280, subtotal: 560 },
            { id: 16, order_id: 1021, food_item_id: 2, food_item: mockFoodItems[1], quantity: 2, unit_price: 80, subtotal: 160 },
            { id: 17, order_id: 1021, food_item_id: 12, food_item: mockFoodItems[11], quantity: 2, unit_price: 120, subtotal: 240 },
            { id: 18, order_id: 1021, food_item_id: 8, food_item: mockFoodItems[7], quantity: 2, unit_price: 50, subtotal: 100, notes: 'با هل' },
        ],
    },
    {
        id: 1020,
        table_id: 4,
        table: mockTables[3],
        order_number: '#1020',
        status: 'cancelled',
        total_amount: 350,
        notes: 'مشتری رفت',
        created_by: 2,
        created_by_name: 'محمد رضایی',
        created_at: '2026-03-15T11:00:00',
        items: [
            { id: 19, order_id: 1020, food_item_id: 5, food_item: mockFoodItems[4], quantity: 1, unit_price: 350, subtotal: 350 },
        ],
    },
];

// ── Salaries ───────────────────────────────────────────────
export const mockSalaries: Salary[] = [
    // Current month (1404-12) — 2 paid, 1 partial, 1 pending
    { id: 1, employee_id: 1, base_amount: 25000, bonuses: 3000, deductions: 0, amount: 28000, status: 'paid', payment_date: '1404-12-10', month: '1404-12', notes: 'معاش ماه حوت + پاداش' },
    { id: 2, employee_id: 2, base_amount: 15000, bonuses: 0, deductions: 2000, amount: 13000, status: 'paid', payment_date: '1404-12-10', month: '1404-12', notes: 'کسر غیرحاضری' },
    { id: 3, employee_id: 3, base_amount: 20000, bonuses: 0, deductions: 0, amount: 10000, status: 'partial', payment_date: '1404-12-12', month: '1404-12', notes: 'نیمی پرداخت شد' },
    { id: 4, employee_id: 4, base_amount: 18000, bonuses: 0, deductions: 0, amount: 0, status: 'pending', month: '1404-12' },
    // Previous month (1404-11) — all paid
    { id: 5, employee_id: 1, base_amount: 25000, bonuses: 0, deductions: 0, amount: 25000, status: 'paid', payment_date: '1404-11-10', month: '1404-11' },
    { id: 6, employee_id: 2, base_amount: 15000, bonuses: 1000, deductions: 0, amount: 16000, status: 'paid', payment_date: '1404-11-10', month: '1404-11', notes: 'پاداش اضافه‌کاری' },
    { id: 7, employee_id: 3, base_amount: 20000, bonuses: 0, deductions: 0, amount: 20000, status: 'paid', payment_date: '1404-11-10', month: '1404-11' },
    { id: 8, employee_id: 4, base_amount: 18000, bonuses: 0, deductions: 0, amount: 18000, status: 'paid', payment_date: '1404-11-10', month: '1404-11' },
    // Older month (1404-10) — all paid
    { id: 9, employee_id: 1, base_amount: 25000, bonuses: 0, deductions: 0, amount: 25000, status: 'paid', payment_date: '1404-10-10', month: '1404-10' },
    { id: 10, employee_id: 2, base_amount: 15000, bonuses: 0, deductions: 0, amount: 15000, status: 'paid', payment_date: '1404-10-10', month: '1404-10' },
    { id: 11, employee_id: 3, base_amount: 20000, bonuses: 2000, deductions: 0, amount: 22000, status: 'paid', payment_date: '1404-10-10', month: '1404-10' },
    { id: 12, employee_id: 4, base_amount: 18000, bonuses: 0, deductions: 1000, amount: 17000, status: 'paid', payment_date: '1404-10-10', month: '1404-10', notes: 'کسر تاخیر' },
];

// ── Expenses ───────────────────────────────────────────────
export const mockExpenses: Expense[] = [
    { id: 1, category: 'groceries', description: 'خرید گوشت و سبزیجات', amount: 15000, date: '1404-12-14', notes: 'برای هفته آینده' },
    { id: 2, category: 'groceries', description: 'خرید برنج و روغن', amount: 8500, date: '1404-12-13' },
    { id: 3, category: 'rent', description: 'کرایه ماه حوت', amount: 30000, date: '1404-12-01' },
    { id: 4, category: 'electricity', description: 'بل برق ماه حوت', amount: 5000, date: '1404-12-05' },
    { id: 5, category: 'gas', description: 'بل گاز ماه حوت', amount: 3500, date: '1404-12-05' },
    { id: 6, category: 'supplies', description: 'خرید ظروف یکبار مصرف', amount: 2000, date: '1404-12-10' },
    { id: 7, category: 'supplies', description: 'خرید مواد پاک‌کننده', amount: 1500, date: '1404-12-08' },
    { id: 8, category: 'other', description: 'تعمیر یخچال', amount: 4000, date: '1404-12-07', notes: 'تعمیر کمپرسور' },
    { id: 9, category: 'groceries', description: 'خرید مرغ و ماهی', amount: 12000, date: '1404-11-28' },
    { id: 10, category: 'rent', description: 'کرایه ماه دلو', amount: 30000, date: '1404-11-01' },
    { id: 11, category: 'electricity', description: 'بل برق ماه دلو', amount: 4500, date: '1404-11-05' },
    { id: 12, category: 'other', description: 'خرید میز و چوکی', amount: 25000, date: '1404-11-15', notes: 'دو میز و ۸ چوکی' },
];

// ── Helpers ─────────────────────────────────────────────────
export function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

export function formatTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('fa-AF', { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fa-AF');
}
