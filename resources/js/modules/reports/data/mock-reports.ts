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

// Mock daily sales data for the past 14 days
export const mockDailySales: DailySalesData[] = [
    { date: '1404-12-01', orders: 15, revenue: 18500, expenses: 35000, profit: -16500 },
    { date: '1404-12-02', orders: 22, revenue: 27000, expenses: 3200, profit: 23800 },
    { date: '1404-12-03', orders: 18, revenue: 21500, expenses: 2800, profit: 18700 },
    { date: '1404-12-04', orders: 25, revenue: 32000, expenses: 4100, profit: 27900 },
    { date: '1404-12-05', orders: 20, revenue: 24500, expenses: 8500, profit: 16000 },
    { date: '1404-12-06', orders: 12, revenue: 14000, expenses: 1800, profit: 12200 },
    { date: '1404-12-07', orders: 28, revenue: 35000, expenses: 5500, profit: 29500 },
    { date: '1404-12-08', orders: 24, revenue: 29500, expenses: 1500, profit: 28000 },
    { date: '1404-12-09', orders: 19, revenue: 23000, expenses: 2200, profit: 20800 },
    { date: '1404-12-10', orders: 30, revenue: 38000, expenses: 2000, profit: 36000 },
    { date: '1404-12-11', orders: 16, revenue: 19500, expenses: 1600, profit: 17900 },
    { date: '1404-12-12', orders: 21, revenue: 25500, expenses: 2400, profit: 23100 },
    { date: '1404-12-13', orders: 27, revenue: 34000, expenses: 8500, profit: 25500 },
    { date: '1404-12-14', orders: 23, revenue: 28500, expenses: 15000, profit: 13500 },
];

// Top selling food items
export const mockTopSellingItems: TopSellingItem[] = [
    { name: 'کابلی پلو', quantity: 145, revenue: 43500 },
    { name: 'چلو کباب', quantity: 120, revenue: 42000 },
    { name: 'مرغ کبابی', quantity: 98, revenue: 39200 },
    { name: 'قابلی ازبکی', quantity: 85, revenue: 23800 },
    { name: 'بولانی', quantity: 210, revenue: 21000 },
    { name: 'چای سبز', quantity: 350, revenue: 17500 },
    { name: 'دوغ', quantity: 180, revenue: 10800 },
    { name: 'فرنی', quantity: 65, revenue: 6500 },
];

// Aggregate helpers
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
