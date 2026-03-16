export type { Employee } from '@/data/mock/types';

export type EmployeeFormData = {
    name: string;
    role: 'manager' | 'waiter' | 'chef' | 'cashier' | '';
    phone: string;
    hire_date: string;
    is_active: boolean;
};
