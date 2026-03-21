export type { Salary, SalaryStatus } from '@/types/models';

export type SalaryFormData = {
    employee_id: number | '';
    base_amount: number | '';
    bonuses: number | '';
    deductions: number | '';
    amount: number | '';
    status: 'paid' | 'pending' | 'partial';
    payment_date: string;
    month: string;
    notes: string;
};
