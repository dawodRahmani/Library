import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Salary, SalaryFormData } from '../types';

interface SalaryFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: SalaryFormData) => void;
    salary?: Salary | null;
    employeeId: number;
}

const defaultFormData: SalaryFormData = {
    employee_id: '',
    amount: '',
    payment_date: '',
    month: '',
    notes: '',
};

export function SalaryFormDialog({
    open,
    onClose,
    onSubmit,
    salary,
    employeeId,
}: SalaryFormDialogProps) {
    const { t } = useTranslation();
    const isEditing = !!salary;
    const [form, setForm] = useState<SalaryFormData>(defaultFormData);

    useEffect(() => {
        if (salary) {
            setForm({
                employee_id: salary.employee_id,
                amount: salary.amount,
                payment_date: salary.payment_date,
                month: salary.month,
                notes: salary.notes || '',
            });
        } else {
            setForm({ ...defaultFormData, employee_id: employeeId });
        }
    }, [salary, open, employeeId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        {isEditing ? t('salaries.editSalary') : t('salaries.addSalary')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? t('salaries.editSalary') : t('salaries.addSalary')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="salary-amount" className="font-medium">
                            {t('salaries.amount')}
                        </Label>
                        <Input
                            id="salary-amount"
                            type="number"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value ? Number(e.target.value) : '' })}
                            required
                            min={0}
                            dir="ltr"
                            className="h-10 text-left"
                            placeholder="0"
                        />
                    </div>

                    {/* Month */}
                    <div className="space-y-2">
                        <Label htmlFor="salary-month" className="font-medium">
                            {t('salaries.month')}
                        </Label>
                        <Input
                            id="salary-month"
                            value={form.month}
                            onChange={(e) => setForm({ ...form, month: e.target.value })}
                            required
                            className="h-10"
                            placeholder="1404-12"
                        />
                    </div>

                    {/* Payment Date */}
                    <div className="space-y-2">
                        <Label htmlFor="salary-date" className="font-medium">
                            {t('salaries.paymentDate')}
                        </Label>
                        <Input
                            id="salary-date"
                            value={form.payment_date}
                            onChange={(e) => setForm({ ...form, payment_date: e.target.value })}
                            required
                            className="h-10"
                            placeholder="1404-12-10"
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="salary-notes" className="font-medium">
                            {t('salaries.notes')}
                        </Label>
                        <Textarea
                            id="salary-notes"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            rows={2}
                            placeholder={t('salaries.notes')}
                        />
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
