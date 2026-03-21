export type LedgerEntryType = 'income' | 'expense' | 'salary' | 'inventory_purchase' | 'fund';

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
