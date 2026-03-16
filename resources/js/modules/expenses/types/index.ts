import type { ExpenseCategory } from '@/data/mock/types';

export type { Expense, ExpenseCategory } from '@/data/mock/types';

export type ExpenseFormData = {
    category: ExpenseCategory | '';
    description: string;
    amount: number | '';
    date: string;
    notes: string;
};
