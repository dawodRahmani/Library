import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ShamsiDateInput } from '@/components/ui/shamsi-date-input';
import type { Employee, EmployeeFormData } from '../types';

interface Role { id: number; name: string; }

interface EmployeeFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: EmployeeFormData) => void;
    employee?: Employee | null;
    roles: Role[];
}

const defaultFormData: EmployeeFormData = {
    name: '',
    role: '',
    phone: '',
    hire_date: '',
    is_active: true,
    base_salary: '',
};

export function EmployeeFormDialog({
    open,
    onClose,
    onSubmit,
    employee,
    roles,
}: EmployeeFormDialogProps) {
    const { t } = useTranslation();
    const isEditing = !!employee;
    const [form, setForm] = useState<EmployeeFormData>(defaultFormData);

    useEffect(() => {
        if (employee) {
            setForm({
                name: employee.name,
                role: employee.role,
                phone: employee.phone,
                hire_date: employee.hire_date,
                is_active: employee.is_active,
                base_salary: employee.base_salary ?? '',
            });
        } else {
            setForm(defaultFormData);
        }
    }, [employee, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        {isEditing ? t('employees.editEmployee') : t('employees.addEmployee')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? t('employees.editEmployeeDesc') : t('employees.addEmployeeDesc')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="emp-name" className="font-medium">
                            {t('employees.name')}
                        </Label>
                        <Input
                            id="emp-name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            className="h-10"
                            placeholder={t('employees.name')}
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <Label className="font-medium">{t('employees.role')}</Label>
                        <Select
                            value={form.role}
                            onValueChange={(val) => setForm({ ...form, role: val as EmployeeFormData['role'] })}
                        >
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder={t('employees.allRoles')} />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.name}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="emp-phone" className="font-medium">
                            {t('employees.phone')}
                        </Label>
                        <Input
                            id="emp-phone"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            required
                            dir="ltr"
                            className="h-10 text-left"
                            placeholder="07XXXXXXXX"
                        />
                    </div>

                    {/* Base Salary */}
                    <div className="space-y-2">
                        <Label htmlFor="emp-base-salary" className="font-medium">
                            {t('employees.baseSalary')}
                        </Label>
                        <Input
                            id="emp-base-salary"
                            type="number"
                            value={form.base_salary}
                            onChange={(e) => setForm({ ...form, base_salary: e.target.value ? Number(e.target.value) : '' })}
                            min={0}
                            dir="ltr"
                            className="h-10 text-left"
                            placeholder="0"
                        />
                    </div>

                    {/* Hire Date */}
                    <div className="space-y-2">
                        <Label className="font-medium">{t('employees.hireDate')}</Label>
                        <ShamsiDateInput
                            value={form.hire_date ?? ''}
                            onChange={(val) => setForm({ ...form, hire_date: val })}
                            className="w-full"
                        />
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3 pt-1">
                        <Checkbox
                            id="emp-active"
                            checked={form.is_active}
                            onCheckedChange={(checked) =>
                                setForm({ ...form, is_active: checked === true })
                            }
                            className="border-emerald-400 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                        />
                        <Label htmlFor="emp-active" className="cursor-pointer">
                            {t('employees.active')}
                        </Label>
                    </div>

                    <DialogFooter className="gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                        >
                            {t('common.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
