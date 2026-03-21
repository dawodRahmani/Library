import type { FoodItem } from '@/types/models';

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';
export type PaymentMethod = 'cash' | 'card';

export interface PosCartItem {
    food_item: FoodItem;
    quantity: number;
    notes?: string;
}

export interface HeldOrder {
    id: number;
    table_id: number | null;
    order_type: OrderType;
    items: PosCartItem[];
    created_at: string;
    label: string;
}
