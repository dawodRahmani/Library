export interface Category {
    id: number;
    name: string;
    sort_order: number;
    items_count?: number;
}

export interface FoodItem {
    id: number;
    category_id: number;
    category: Category;
    name: string;
    price: number;
    image?: string;
    is_available: boolean;
    sort_order: number;
}

export interface RestaurantTable {
    id: number;
    number: number;
    name?: string;
    capacity: number;
    status: 'available' | 'occupied';
    active_order_id?: number;
}

export type OrderStatus = 'pending' | 'in_kitchen' | 'ready' | 'served' | 'paid' | 'cancelled';

export interface OrderItem {
    id: number;
    order_id: number;
    food_item_id: number;
    food_item: FoodItem;
    quantity: number;
    unit_price: number;
    subtotal: number;
    notes?: string;
}

export interface Order {
    id: number;
    table_id: number;
    table: RestaurantTable;
    order_number: string;
    status: OrderStatus;
    total_amount: number;
    notes?: string;
    created_by: number;
    created_by_name?: string;
    paid_at?: string;
    created_at: string;
    items: OrderItem[];
}

export interface Employee {
    id: number;
    name: string;
    role: 'manager' | 'waiter' | 'chef' | 'cashier';
    phone: string;
    hire_date: string;
    is_active: boolean;
}

export interface Salary {
    id: number;
    employee_id: number;
    amount: number;
    payment_date: string;
    month: string;
    notes?: string;
}

export type ExpenseCategory = 'groceries' | 'rent' | 'electricity' | 'gas' | 'supplies' | 'other';

export interface Expense {
    id: number;
    category: ExpenseCategory;
    description: string;
    amount: number;
    date: string;
    notes?: string;
}
