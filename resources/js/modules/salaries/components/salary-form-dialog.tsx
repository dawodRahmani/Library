import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShamsiDateInput } from '@/components/ui/shamsi-date-input';
import { ShamsiMonthInput } from '@/components/ui/shamsi-month-input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { todayParts } from '@/lib/date';
import type { Salary, SalaryFormData } from '../types';

interface SalaryFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: SalaryFormData) => void;
    salary?: Salary | null;
    employeeId: number;
    employeeName?: string;
    baseSalary?: number;
}

function currentShamsiMonth(): string {
    const p = todayParts();
    return `${p.year}-${String(p.month).padStart(2, '0')}`;
}

export function SalaryFormDialog({
    open,
    onClose,
    onSubmit,
    salary,
    employeeId,
    employeeName,
    baseSalary,
}: SalaryFormDialogProps) {
    const { t } = useTranslation();
    const isEditing = !!salary;

    const defaultFormData: SalaryFormData = {
        employee_id: employeeId,
        base_amount: baseSalary ?? '',
        bonuses: 0,
        deductions: 0,
        amount: baseSalary ?? '',
        status: 'paid',
        payment_date: '',
        month: currentShamsiMonth(),
        notes: '',
    };

    const [form, setForm] = useState<SalaryFormData>(defaultFormData);

    useEffect(() => {
        if (salary) {
            setForm({
                employee_id: salary.employee_id,
                base_amount: salary.base_amount,
                bonuses: salary.bonuses,
                deductions: salary.deductions,
                amount: salary.amount,
                status: salary.status,
                payment_date: salary.payment_date || '',
                month: salary.month,
                notes: salary.notes || '',
            });
        } else {
            setForm({
                employee_id: employeeId,
                base_amount: baseSalary ?? '',
                bonuses: 0,
                deductions: 0,
                amount: baseSalary ?? '',
                status: 'paid',
                payment_date: '',
                month: currentShamsiMonth(),
                notes: '',
            });
        }
    }, [salary, open, employeeId, baseSalary]);

    // Auto-calculate net amount
    useEffect(() => {
        const base = Number(form.base_amount) || 0;
        const bonus = Number(form.bonuses) || 0;
        const deduction = Number(form.deductions) || 0;
        setForm((prev) => ({ ...prev, amount: base + bonus - deduction }));
    }, [form.base_amount, form.bonuses, form.deductions]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        {isEditing ? t('salaries.editSalary') : t('salaries.addSalary')}
                    </DialogTitle>
                    {employeeName && (
                        <DialogDescription>{employeeName}</DialogDescription>
                    )}
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    {/* Month */}
                    <div className="space-y-2">
                        <Label className="font-medium">{t('salaries.month')}</Label>
                        <ShamsiMonthInput
                            value={form.month}
                            onChange={(val) => setForm({ ...form, month: val })}
                            className="w-full"
                        />
                    </div>

                    {/* Base Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="salary-base" className="font-medium">
                            {t('salaries.baseSalary')}
                        </Label>
                        <Input
                            id="salary-base"
                            type="number"
                            value={form.base_amount}
                            onChange={(e) => setForm({ ...form, base_amount: e.target.value ? Number(e.target.value) : '' })}
                            required
                            min={0}
                            dir="ltr"
                            className="h-10 text-left"
                            placeholder="0"
                        />
                    </div>

                    {/* Bonuses & Deductions */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="salary-bonuses" className="font-medium">
                                {t('salaries.bonuses')}
                            </Label>
                            <Input
                                id="salary-bonuses"
                                type="number"
                                value={form.bonuses}
                                onChange={(e) => setForm({ ...form, bonuses: e.target.value ? Number(e.target.value) : 0 })}
                                min={0}
                                dir="ltr"
                                className="h-10 text-left"
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salary-deductions" className="font-medium">
                                {t('salaries.deductions')}
                            </Label>
                            <Input
                                id="salary-deductions"
                                type="number"
                                value={form.deductions}
                                onChange={(e) => setForm({ ...form, deductions: e.target.value ? Number(e.target.value) : 0 })}
                                min={0}
                                dir="ltr"
                                className="h-10 text-left"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Net Amount (read-only) */}
                    <div className="space-y-2">
                        <Label className="font-medium">{t('salaries.netAmount')}</Label>
                        <div className="h-10 flex items-center px-3 rounded-md border bg-muted/50 text-lg font-bold" dir="ltr">
                            {Number(form.amount).toLocaleString()} ؋
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label className="font-medium">{t('salaries.status')}</Label>
                        <div className="flex gap-2">
                            {(['paid', 'partial', 'pending'] as const).map((status) => (
                                <Button
                                    key={status}
                                    type="button"
                                    variant={form.status === status ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setForm({ ...form, status })}
                                >
                                    {t(`salaries.status${status.charAt(0).toUpperCase() + status.slice(1)}`)}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Payment Date */}
                    <div className="space-y-2">
                        <Label className="font-medium">{t('salaries.paymentDate')}</Label>
                        <ShamsiDateInput
                            value={form.payment_date}
                            onChange={(val) => setForm({ ...form, payment_date: val })}
                            className="w-full"
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
                        <Button type="submit">
                            {t('common.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
