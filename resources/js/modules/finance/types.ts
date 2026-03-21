export interface MonthlyFinance {
    month: string;
    monthLabel: string;
    income: number;
    expenses: number;
    salaries: number;
    netProfit: number;
    ordersCount: number;
}

export interface DailyCashFlow {
    date: string;
    inflow: number;
    outflow: number;
}

export interface ExpenseCategoryBreakdown {
    category: string;
    categoryLabel: string;
    amount: number;
    percentage: number;
    color: string;
}

export interface SalaryOverview {
    employeeName: string;
    role: string;
    baseSalary: number;
    status: 'paid' | 'pending';
    paidDate?: string;
}

export function getPercentChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
}
