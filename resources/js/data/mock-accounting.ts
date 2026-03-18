export type LedgerEntryType = 'income' | 'expense' | 'salary' | 'inventory_purchase';

export interface LedgerEntry {
    id: number;
    date: string;
    type: LedgerEntryType;
    reference: string;
    description: string;
    amount: number;
    direction: 'in' | 'out';
    balance: number;
    category?: string;
}

// Running entries sorted ascending by date; balance is cumulative
const rawEntries: Omit<LedgerEntry, 'balance'>[] = [
    // ── Month 1404-10 ────────────────────────────────────────
    { id: 1,  date: '1404-10-01', type: 'expense',           direction: 'out', amount: 30000, reference: 'EXP-001', description: 'کرایه ماه میزان', category: 'rent' },
    { id: 2,  date: '1404-10-05', type: 'expense',           direction: 'out', amount: 4500,  reference: 'EXP-002', description: 'بل برق ماه میزان', category: 'electricity' },
    { id: 3,  date: '1404-10-10', type: 'inventory_purchase',direction: 'out', amount: 22000, reference: 'PO-1404-006', description: 'خرید برنج و آرد از انبار غلات کابل' },
    { id: 4,  date: '1404-10-10', type: 'salary',            direction: 'out', amount: 25000, reference: 'SAL-1404-10-1', description: 'معاش احمد حسینی', category: 'احمد حسینی' },
    { id: 5,  date: '1404-10-10', type: 'salary',            direction: 'out', amount: 15000, reference: 'SAL-1404-10-2', description: 'معاش محمد رضایی', category: 'محمد رضایی' },
    { id: 6,  date: '1404-10-10', type: 'salary',            direction: 'out', amount: 22000, reference: 'SAL-1404-10-3', description: 'معاش علی احمدی + پاداش', category: 'علی احمدی' },
    { id: 7,  date: '1404-10-10', type: 'salary',            direction: 'out', amount: 17000, reference: 'SAL-1404-10-4', description: 'معاش حسن نوری (کسر تاخیر)', category: 'حسن نوری' },
    { id: 8,  date: '1404-10-12', type: 'income',            direction: 'in',  amount: 18500, reference: 'ORD-1010', description: 'فروش روز ۱۴۰۴/۱۰/۱۲' },
    { id: 9,  date: '1404-10-15', type: 'income',            direction: 'in',  amount: 22000, reference: 'ORD-1015', description: 'فروش روز ۱۴۰۴/۱۰/۱۵' },
    { id: 10, date: '1404-10-18', type: 'expense',           direction: 'out', amount: 12000, reference: 'EXP-003', description: 'خرید مرغ و ماهی', category: 'groceries' },
    { id: 11, date: '1404-10-20', type: 'income',            direction: 'in',  amount: 19800, reference: 'ORD-1020', description: 'فروش روز ۱۴۰۴/۱۰/۲۰' },
    { id: 12, date: '1404-10-25', type: 'income',            direction: 'in',  amount: 24500, reference: 'ORD-1025', description: 'فروش روز ۱۴۰۴/۱۰/۲۵' },
    { id: 13, date: '1404-10-28', type: 'expense',           direction: 'out', amount: 15000, reference: 'EXP-004', description: 'خرید گوشت و سبزیجات', category: 'groceries' },

    // ── Month 1404-11 ────────────────────────────────────────
    { id: 14, date: '1404-11-01', type: 'expense',           direction: 'out', amount: 30000, reference: 'EXP-005', description: 'کرایه ماه دلو', category: 'rent' },
    { id: 15, date: '1404-11-05', type: 'expense',           direction: 'out', amount: 4500,  reference: 'EXP-006', description: 'بل برق ماه دلو', category: 'electricity' },
    { id: 16, date: '1404-11-10', type: 'inventory_purchase',direction: 'out', amount: 45000, reference: 'PO-1404-001', description: 'خرید گوشت از شرکت گوشت افغان' },
    { id: 17, date: '1404-11-10', type: 'salary',            direction: 'out', amount: 25000, reference: 'SAL-1404-11-1', description: 'معاش احمد حسینی', category: 'احمد حسینی' },
    { id: 18, date: '1404-11-10', type: 'salary',            direction: 'out', amount: 16000, reference: 'SAL-1404-11-2', description: 'معاش محمد رضایی + پاداش', category: 'محمد رضایی' },
    { id: 19, date: '1404-11-10', type: 'salary',            direction: 'out', amount: 20000, reference: 'SAL-1404-11-3', description: 'معاش علی احمدی', category: 'علی احمدی' },
    { id: 20, date: '1404-11-10', type: 'salary',            direction: 'out', amount: 18000, reference: 'SAL-1404-11-4', description: 'معاش حسن نوری', category: 'حسن نوری' },
    { id: 21, date: '1404-11-12', type: 'income',            direction: 'in',  amount: 26400, reference: 'ORD-1112', description: 'فروش روز ۱۴۰۴/۱۱/۱۲' },
    { id: 22, date: '1404-11-15', type: 'expense',           direction: 'out', amount: 25000, reference: 'EXP-007', description: 'خرید میز و چوکی', category: 'other' },
    { id: 23, date: '1404-11-18', type: 'income',            direction: 'in',  amount: 31200, reference: 'ORD-1118', description: 'فروش روز ۱۴۰۴/۱۱/۱۸' },
    { id: 24, date: '1404-11-22', type: 'income',            direction: 'in',  amount: 28700, reference: 'ORD-1122', description: 'فروش روز ۱۴۰۴/۱۱/۲۲' },
    { id: 25, date: '1404-11-28', type: 'expense',           direction: 'out', amount: 12000, reference: 'EXP-008', description: 'خرید مرغ و ماهی', category: 'groceries' },

    // ── Month 1404-12 ────────────────────────────────────────
    { id: 26, date: '1404-12-01', type: 'expense',           direction: 'out', amount: 30000, reference: 'EXP-009', description: 'کرایه ماه حوت', category: 'rent' },
    { id: 27, date: '1404-12-05', type: 'expense',           direction: 'out', amount: 5000,  reference: 'EXP-010', description: 'بل برق ماه حوت', category: 'electricity' },
    { id: 28, date: '1404-12-05', type: 'expense',           direction: 'out', amount: 3500,  reference: 'EXP-011', description: 'بل گاز ماه حوت', category: 'gas' },
    { id: 29, date: '1404-12-06', type: 'inventory_purchase',direction: 'out', amount: 28000, reference: 'PO-1404-002', description: 'خرید برنج و روغن از انبار غلات کابل' },
    { id: 30, date: '1404-12-08', type: 'income',            direction: 'in',  amount: 22400, reference: 'ORD-1208', description: 'فروش روز ۱۴۰۴/۱۲/۰۸' },
    { id: 31, date: '1404-12-10', type: 'salary',            direction: 'out', amount: 28000, reference: 'SAL-1404-12-1', description: 'معاش احمد حسینی + پاداش', category: 'احمد حسینی' },
    { id: 32, date: '1404-12-10', type: 'salary',            direction: 'out', amount: 13000, reference: 'SAL-1404-12-2', description: 'معاش محمد رضایی (کسر غیرحاضری)', category: 'محمد رضایی' },
    { id: 33, date: '1404-12-12', type: 'salary',            direction: 'out', amount: 10000, reference: 'SAL-1404-12-3', description: 'معاش جزئی علی احمدی', category: 'علی احمدی' },
    { id: 34, date: '1404-12-13', type: 'expense',           direction: 'out', amount: 8500,  reference: 'EXP-012', description: 'خرید برنج و روغن', category: 'groceries' },
    { id: 35, date: '1404-12-14', type: 'expense',           direction: 'out', amount: 15000, reference: 'EXP-013', description: 'خرید گوشت و سبزیجات', category: 'groceries' },
    { id: 36, date: '1404-12-15', type: 'income',            direction: 'in',  amount: 25450, reference: 'ORD-1215', description: 'فروش روز ۱۴۰۴/۱۲/۱۵' },
];

// Calculate running balance
let runningBalance = 0;
export const mockLedgerEntries: LedgerEntry[] = rawEntries.map((entry) => {
    if (entry.direction === 'in') {
        runningBalance += entry.amount;
    } else {
        runningBalance -= entry.amount;
    }
    return { ...entry, balance: runningBalance };
});

// Summary helpers
export function getLedgerSummary() {
    const totalIncome = mockLedgerEntries
        .filter((e) => e.direction === 'in')
        .reduce((sum, e) => sum + e.amount, 0);
    const totalOutflow = mockLedgerEntries
        .filter((e) => e.direction === 'out')
        .reduce((sum, e) => sum + e.amount, 0);
    return {
        totalIncome,
        totalOutflow,
        balance: totalIncome - totalOutflow,
    };
}
