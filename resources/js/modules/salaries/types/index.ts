export type { Salary } from '@/data/mock/types';

export type SalaryFormData = {
    employee_id: number | '';
    amount: number | '';
    payment_date: string;
    month: string;
    notes: string;
};
