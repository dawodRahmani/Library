export interface ExpenseCategoryItem {
    id: number;
    name: string;
    slug: string;
}

export interface Expense {
    id: number;
    expense_category_id: number;
    category: string;
    category_name: string;
    description: string;
    amount: number;
    date: string;
    notes?: string;
}

export type ExpenseFormData = {
    expense_category_id: number | '';
    description: string;
    amount: number | '';
    date: string;
    notes: string;
};
