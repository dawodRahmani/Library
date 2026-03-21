export type InventoryUnitSlugSlug = 'kg' | 'liter' | 'piece' | 'box' | 'bag' | string;

export type TransactionType = 'stock_in' | 'stock_out' | 'waste' | 'adjustment';

export interface InventoryCategoryItem {
    id: number;
    name: string;
    slug: string;
}

export interface InventoryUnitSlugItem {
    id: number;
    name: string;
    slug: string;
}

export interface InventoryItem {
    id: number;
    name: string;
    unit: string;
    unit_name: string;
    inventory_unit_id: number;
    cost_per_unit: number;
    current_stock: number;
    min_stock_level: number;
    category: string;
    category_name: string;
    inventory_category_id: number;
    is_active: boolean;
    last_restocked?: string;
    created_at: string;
}

export interface StockTransaction {
    id: number;
    inventory_item_id: number;
    inventory_item_name: string;
    type: TransactionType;
    quantity: number;
    unit: InventoryUnitSlug;
    cost_per_unit?: number;
    total_cost?: number;
    notes?: string;
    created_by_name: string;
    created_at: string;
}

export interface InventoryAlert {
    id: number;
    inventory_item_id: number;
    item_name: string;
    current_stock: number;
    min_stock_level: number;
    unit: InventoryUnitSlug;
    shortage: number;
    severity: 'critical' | 'warning';
}

export interface InventoryItemFormData {
    name: string;
    inventory_unit_id: number | '';
    cost_per_unit: number | '';
    current_stock: number | '';
    min_stock_level: number | '';
    inventory_category_id: number | '';
}

export interface StockTransactionFormData {
    inventory_item_id: number | '';
    type: TransactionType | '';
    quantity: number | '';
    cost_per_unit: number | '';
    notes: string;
}

// ── Suppliers ────────────────────────────────────────────────
export interface Supplier {
    id: number;
    name: string;
    contact_name: string;
    phone: string;
    address?: string;
    category: string;
    category_name: string;
    notes?: string;
    created_at: string;
}

export interface SupplierFormData {
    name: string;
    contact_name: string;
    phone: string;
    address: string;
    category: string;
    notes: string;
}

// ── Purchase Orders ──────────────────────────────────────────
export type PurchaseOrderStatus = 'draft' | 'ordered' | 'arrived' | 'cancelled';

export interface PurchaseOrderItem {
    inventory_item_id: number;
    inventory_item_name: string;
    quantity: number;
    unit: InventoryUnitSlug;
    unit_cost: number;
    total_cost: number;
}

export interface PurchaseOrder {
    id: number;
    po_number: string;
    supplier_id: number;
    supplier_name: string;
    status: PurchaseOrderStatus;
    items: PurchaseOrderItem[];
    total_amount: number;
    order_date: string;
    expected_delivery: string;
    arrived_date?: string;
    notes?: string;
}

export interface PurchaseOrderFormData {
    supplier_id: number | '';
    order_date: string;
    expected_delivery: string;
    notes: string;
    items: {
        inventory_item_id: number | '';
        quantity: number | '';
        unit_cost: number | '';
    }[];
}
