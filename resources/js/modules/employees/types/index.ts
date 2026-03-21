export type { Employee } from '@/types/models';

export type EmployeeFormData = {
    name: string;
    role: 'manager' | 'waiter' | 'chef' | 'cashier' | '';
    phone: string;
    hire_date: string;
    is_active: boolean;
};
