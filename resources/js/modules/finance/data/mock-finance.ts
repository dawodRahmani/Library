export interface MonthlyFinance {
    month: string;       // e.g. '1404-12'
    monthLabel: string;  // e.g. 'حوت ۱۴۰۴'
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

// ── This Month vs Last Month ──────────────────────────────
export const mockMonthlyFinance: MonthlyFinance[] = [
    {
        month: '1404-07',
        monthLabel: 'میزان ۱۴۰۴',
        income: 620000,
        expenses: 185000,
        salaries: 78000,
        netProfit: 357000,
        ordersCount: 480,
    },
    {
        month: '1404-08',
        monthLabel: 'عقرب ۱۴۰۴',
        income: 710000,
        expenses: 195000,
        salaries: 78000,
        netProfit: 437000,
        ordersCount: 540,
    },
    {
        month: '1404-09',
        monthLabel: 'قوس ۱۴۰۴',
        income: 580000,
        expenses: 210000,
        salaries: 78000,
        netProfit: 292000,
        ordersCount: 420,
    },
    {
        month: '1404-10',
        monthLabel: 'جدی ۱۴۰۴',
        income: 690000,
        expenses: 175000,
        salaries: 78000,
        netProfit: 437000,
        ordersCount: 510,
    },
    {
        month: '1404-11',
        monthLabel: 'دلو ۱۴۰۴',
        income: 645000,
        expenses: 192000,
        salaries: 78000,
        netProfit: 375000,
        ordersCount: 490,
    },
    {
        month: '1404-12',
        monthLabel: 'حوت ۱۴۰۴',
        income: 735000,
        expenses: 205000,
        salaries: 78000,
        netProfit: 452000,
        ordersCount: 560,
    },
];

// ── Daily Cash Flow (last 14 days) ───────────────────────
export const mockDailyCashFlow: DailyCashFlow[] = [
    { date: '1404-12-01', inflow: 35000, outflow: 32000 },
    { date: '1404-12-02', inflow: 27000, outflow: 3200 },
    { date: '1404-12-03', inflow: 21500, outflow: 2800 },
    { date: '1404-12-04', inflow: 32000, outflow: 4100 },
    { date: '1404-12-05', inflow: 24500, outflow: 8500 },
    { date: '1404-12-06', inflow: 14000, outflow: 1800 },
    { date: '1404-12-07', inflow: 35000, outflow: 5500 },
    { date: '1404-12-08', inflow: 29500, outflow: 1500 },
    { date: '1404-12-09', inflow: 23000, outflow: 2200 },
    { date: '1404-12-10', inflow: 38000, outflow: 80000 },
    { date: '1404-12-11', inflow: 19500, outflow: 1600 },
    { date: '1404-12-12', inflow: 25500, outflow: 2400 },
    { date: '1404-12-13', inflow: 34000, outflow: 8500 },
    { date: '1404-12-14', inflow: 28500, outflow: 15000 },
];

// ── Expense Category Breakdown (this month) ──────────────
export const mockExpenseBreakdown: ExpenseCategoryBreakdown[] = [
    { category: 'groceries', categoryLabel: 'مواد غذایی', amount: 85000, percentage: 41.5, color: '#f59e0b' },
    { category: 'rent', categoryLabel: 'کرایه', amount: 30000, percentage: 14.6, color: '#6366f1' },
    { category: 'salaries', categoryLabel: 'معاشات', amount: 78000, percentage: 27.7, color: '#8b5cf6' },
    { category: 'electricity', categoryLabel: 'برق', amount: 5000, percentage: 2.4, color: '#3b82f6' },
    { category: 'gas', categoryLabel: 'گاز', amount: 3500, percentage: 1.7, color: '#ef4444' },
    { category: 'supplies', categoryLabel: 'لوازم', amount: 3500, percentage: 1.7, color: '#10b981' },
    { category: 'other', categoryLabel: 'سایر', amount: 4000, percentage: 10.4, color: '#94a3b8' },
];

// ── Salary Overview (this month) ─────────────────────────
export const mockSalaryOverview: SalaryOverview[] = [
    { employeeName: 'احمد حسینی', role: 'مدیر', baseSalary: 25000, status: 'paid', paidDate: '1404-12-10' },
    { employeeName: 'محمد رضایی', role: 'گارسون', baseSalary: 15000, status: 'paid', paidDate: '1404-12-10' },
    { employeeName: 'علی احمدی', role: 'آشپز', baseSalary: 20000, status: 'pending' },
    { employeeName: 'حسن نوری', role: 'صندوقدار', baseSalary: 18000, status: 'pending' },
];

// ── Helpers ──────────────────────────────────────────────
export function getCurrentMonth(): MonthlyFinance {
    return mockMonthlyFinance[mockMonthlyFinance.length - 1];
}

export function getLastMonth(): MonthlyFinance {
    return mockMonthlyFinance[mockMonthlyFinance.length - 2];
}

export function getPercentChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
}
