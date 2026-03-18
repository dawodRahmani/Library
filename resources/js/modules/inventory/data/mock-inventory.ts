import type { InventoryItem, StockTransaction, InventoryAlert } from '../types';

// ── Inventory Items ─────────────────────────────────────────
export const mockInventoryItems: InventoryItem[] = [
    { id: 1, name: 'برنج', unit: 'kg', cost_per_unit: 120, current_stock: 45, min_stock_level: 20, category: 'grains', is_active: true, last_restocked: '1404-12-12', created_at: '1404-06-01' },
    { id: 2, name: 'روغن', unit: 'liter', cost_per_unit: 250, current_stock: 8, min_stock_level: 10, category: 'oils', is_active: true, last_restocked: '1404-12-10', created_at: '1404-06-01' },
    { id: 3, name: 'گوشت گاو', unit: 'kg', cost_per_unit: 550, current_stock: 12, min_stock_level: 15, category: 'meat', is_active: true, last_restocked: '1404-12-13', created_at: '1404-06-01' },
    { id: 4, name: 'گوشت مرغ', unit: 'kg', cost_per_unit: 350, current_stock: 18, min_stock_level: 10, category: 'meat', is_active: true, last_restocked: '1404-12-13', created_at: '1404-06-01' },
    { id: 5, name: 'آرد', unit: 'kg', cost_per_unit: 80, current_stock: 30, min_stock_level: 25, category: 'grains', is_active: true, last_restocked: '1404-12-08', created_at: '1404-06-01' },
    { id: 6, name: 'پیاز', unit: 'kg', cost_per_unit: 40, current_stock: 25, min_stock_level: 15, category: 'vegetables', is_active: true, last_restocked: '1404-12-14', created_at: '1404-06-01' },
    { id: 7, name: 'بادنجان رومی', unit: 'kg', cost_per_unit: 60, current_stock: 10, min_stock_level: 8, category: 'vegetables', is_active: true, last_restocked: '1404-12-14', created_at: '1404-06-01' },
    { id: 8, name: 'مرچ', unit: 'kg', cost_per_unit: 100, current_stock: 3, min_stock_level: 5, category: 'spices', is_active: true, last_restocked: '1404-12-10', created_at: '1404-06-01' },
    { id: 9, name: 'زردچوبه', unit: 'kg', cost_per_unit: 300, current_stock: 2, min_stock_level: 3, category: 'spices', is_active: true, last_restocked: '1404-12-05', created_at: '1404-06-01' },
    { id: 10, name: 'نمک', unit: 'kg', cost_per_unit: 25, current_stock: 15, min_stock_level: 5, category: 'spices', is_active: true, last_restocked: '1404-12-01', created_at: '1404-06-01' },
    { id: 11, name: 'چای سبز', unit: 'kg', cost_per_unit: 400, current_stock: 5, min_stock_level: 3, category: 'beverages', is_active: true, last_restocked: '1404-12-10', created_at: '1404-06-01' },
    { id: 12, name: 'چای سیاه', unit: 'kg', cost_per_unit: 350, current_stock: 4, min_stock_level: 3, category: 'beverages', is_active: true, last_restocked: '1404-12-10', created_at: '1404-06-01' },
    { id: 13, name: 'شکر', unit: 'kg', cost_per_unit: 90, current_stock: 20, min_stock_level: 10, category: 'grains', is_active: true, last_restocked: '1404-12-08', created_at: '1404-06-01' },
    { id: 14, name: 'دوغ', unit: 'liter', cost_per_unit: 60, current_stock: 2, min_stock_level: 10, category: 'beverages', is_active: true, last_restocked: '1404-12-12', created_at: '1404-06-01' },
    { id: 15, name: 'کچالو', unit: 'kg', cost_per_unit: 35, current_stock: 40, min_stock_level: 20, category: 'vegetables', is_active: true, last_restocked: '1404-12-14', created_at: '1404-06-01' },
    { id: 16, name: 'لوبیا سفید', unit: 'kg', cost_per_unit: 150, current_stock: 0, min_stock_level: 5, category: 'grains', is_active: false, created_at: '1404-06-01' },
];

// ── Stock Transactions ──────────────────────────────────────
export const mockStockTransactions: StockTransaction[] = [
    { id: 1, inventory_item_id: 1, inventory_item_name: 'برنج', type: 'stock_in', quantity: 50, unit: 'kg', cost_per_unit: 120, total_cost: 6000, notes: 'خرید از بازار', created_by_name: 'احمد حسینی', created_at: '1404-12-12' },
    { id: 2, inventory_item_id: 3, inventory_item_name: 'گوشت گاو', type: 'stock_in', quantity: 20, unit: 'kg', cost_per_unit: 550, total_cost: 11000, notes: 'خرید از قصابی', created_by_name: 'احمد حسینی', created_at: '1404-12-13' },
    { id: 3, inventory_item_id: 4, inventory_item_name: 'گوشت مرغ', type: 'stock_in', quantity: 25, unit: 'kg', cost_per_unit: 350, total_cost: 8750, created_by_name: 'احمد حسینی', created_at: '1404-12-13' },
    { id: 4, inventory_item_id: 1, inventory_item_name: 'برنج', type: 'stock_out', quantity: 5, unit: 'kg', notes: 'مصرف روزانه', created_by_name: 'علی احمدی', created_at: '1404-12-14' },
    { id: 5, inventory_item_id: 3, inventory_item_name: 'گوشت گاو', type: 'stock_out', quantity: 8, unit: 'kg', notes: 'مصرف روزانه', created_by_name: 'علی احمدی', created_at: '1404-12-14' },
    { id: 6, inventory_item_id: 4, inventory_item_name: 'گوشت مرغ', type: 'stock_out', quantity: 7, unit: 'kg', notes: 'مصرف روزانه', created_by_name: 'علی احمدی', created_at: '1404-12-14' },
    { id: 7, inventory_item_id: 2, inventory_item_name: 'روغن', type: 'stock_in', quantity: 10, unit: 'liter', cost_per_unit: 250, total_cost: 2500, created_by_name: 'احمد حسینی', created_at: '1404-12-10' },
    { id: 8, inventory_item_id: 2, inventory_item_name: 'روغن', type: 'stock_out', quantity: 2, unit: 'liter', notes: 'مصرف روزانه', created_by_name: 'علی احمدی', created_at: '1404-12-14' },
    { id: 9, inventory_item_id: 7, inventory_item_name: 'بادنجان رومی', type: 'waste', quantity: 3, unit: 'kg', notes: 'خراب شده بود', created_by_name: 'علی احمدی', created_at: '1404-12-13' },
    { id: 10, inventory_item_id: 14, inventory_item_name: 'دوغ', type: 'stock_out', quantity: 8, unit: 'liter', notes: 'فروش روزانه', created_by_name: 'حسن نوری', created_at: '1404-12-14' },
    { id: 11, inventory_item_id: 8, inventory_item_name: 'مرچ', type: 'stock_out', quantity: 2, unit: 'kg', notes: 'مصرف آشپزخانه', created_by_name: 'علی احمدی', created_at: '1404-12-13' },
    { id: 12, inventory_item_id: 6, inventory_item_name: 'پیاز', type: 'stock_in', quantity: 30, unit: 'kg', cost_per_unit: 40, total_cost: 1200, created_by_name: 'احمد حسینی', created_at: '1404-12-14' },
    { id: 13, inventory_item_id: 9, inventory_item_name: 'زردچوبه', type: 'adjustment', quantity: -1, unit: 'kg', notes: 'تصحیح موجودی', created_by_name: 'احمد حسینی', created_at: '1404-12-11' },
    { id: 14, inventory_item_id: 15, inventory_item_name: 'کچالو', type: 'stock_in', quantity: 50, unit: 'kg', cost_per_unit: 35, total_cost: 1750, created_by_name: 'احمد حسینی', created_at: '1404-12-14' },
    { id: 15, inventory_item_id: 15, inventory_item_name: 'کچالو', type: 'stock_out', quantity: 10, unit: 'kg', notes: 'مصرف روزانه', created_by_name: 'علی احمدی', created_at: '1404-12-14' },
];

// ── Alerts (auto-generated from items below min stock) ──────
export const mockInventoryAlerts: InventoryAlert[] = mockInventoryItems
    .filter((item) => item.is_active && item.current_stock < item.min_stock_level)
    .map((item, idx) => ({
        id: idx + 1,
        inventory_item_id: item.id,
        item_name: item.name,
        current_stock: item.current_stock,
        min_stock_level: item.min_stock_level,
        unit: item.unit,
        shortage: item.min_stock_level - item.current_stock,
        severity: item.current_stock <= item.min_stock_level * 0.3 ? 'critical' as const : 'warning' as const,
    }));

// ── Categories for inventory items ──────────────────────────
export const inventoryCategories = [
    { value: 'meat', label: 'گوشت' },
    { value: 'grains', label: 'غلات' },
    { value: 'vegetables', label: 'سبزیجات' },
    { value: 'oils', label: 'روغنیات' },
    { value: 'spices', label: 'ادویه‌جات' },
    { value: 'beverages', label: 'نوشیدنی‌ها' },
    { value: 'dairy', label: 'لبنیات' },
    { value: 'other', label: 'سایر' },
];

// ── Summary stats ───────────────────────────────────────────
export function getInventoryStats() {
    const totalItems = mockInventoryItems.filter((i) => i.is_active).length;
    const lowStockCount = mockInventoryAlerts.length;
    const criticalCount = mockInventoryAlerts.filter((a) => a.severity === 'critical').length;
    const totalValue = mockInventoryItems.reduce(
        (sum, item) => sum + item.current_stock * item.cost_per_unit,
        0,
    );

    // Total money spent on purchases (stock_in)
    const totalPurchases = mockStockTransactions
        .filter((tx) => tx.type === 'stock_in')
        .reduce((sum, tx) => sum + (tx.total_cost || 0), 0);

    // Total loss from waste
    const totalWasteLoss = mockStockTransactions
        .filter((tx) => tx.type === 'waste')
        .reduce((sum, tx) => {
            const item = mockInventoryItems.find((i) => i.id === tx.inventory_item_id);
            return sum + Math.abs(tx.quantity) * (item?.cost_per_unit || 0);
        }, 0);

    return { totalItems, lowStockCount, criticalCount, totalValue, totalPurchases, totalWasteLoss };
}
