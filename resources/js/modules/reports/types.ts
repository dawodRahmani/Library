export interface DailySalesData {
    date: string;
    orders: number;
    revenue: number;
    expenses: number;
    profit: number;
}

export interface TopSellingItem {
    name: string;
    quantity: number;
    revenue: number;
}

export function getTotalRevenue(data: DailySalesData[]): number {
    return data.reduce((sum, d) => sum + d.revenue, 0);
}

export function getTotalExpenses(data: DailySalesData[]): number {
    return data.reduce((sum, d) => sum + d.expenses, 0);
}

export function getTotalProfit(data: DailySalesData[]): number {
    return data.reduce((sum, d) => sum + d.profit, 0);
}

export function getTotalOrders(data: DailySalesData[]): number {
    return data.reduce((sum, d) => sum + d.orders, 0);
}
