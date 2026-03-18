import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // used for description/amount
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShamsiDateInput } from '@/components/ui/shamsi-date-input';
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
import type { Expense, ExpenseFormData, ExpenseCategory } from '../types';

interface ExpenseFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ExpenseFormData) => void;
    expense?: Expense | null;
}

const categories: ExpenseCategory[] = ['groceries', 'rent', 'electricity', 'gas', 'supplies', 'other'];

function defaultFormData(): ExpenseFormData {
    return {
        category: '',
        description: '',
        amount: '',
        date: new Date().toISOString().slice(0, 10),
        notes: '',
    };
}

export function ExpenseFormDialog({
    open,
    onClose,
    onSubmit,
    expense,
}: ExpenseFormDialogProps) {
    const { t } = useTranslation();
    const isEditing = !!expense;
    const [form, setForm] = useState<ExpenseFormData>(defaultFormData());

    useEffect(() => {
        if (expense) {
            setForm({
                category: expense.category,
                description: expense.description,
                amount: expense.amount,
                date: expense.date,
                notes: expense.notes || '',
            });
        } else {
            setForm(defaultFormData());
        }
    }, [expense, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        {isEditing ? t('expenses.editExpense') : t('expenses.addExpense')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? t('expenses.editExpense') : t('expenses.addExpense')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                    {/* Category */}
                    <div className="space-y-2">
                        <Label className="font-medium">{t('expenses.category')}</Label>
                        <Select
                            value={form.category}
                            onValueChange={(val) => setForm({ ...form, category: val as ExpenseCategory })}
                        >
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder={t('expenses.allCategories')} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {t(`expenses.categories.${cat}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="expense-desc" className="font-medium">
                            {t('expenses.description')}
                        </Label>
                        <Input
                            id="expense-desc"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                            className="h-10"
                            placeholder={t('expenses.description')}
                        />
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="expense-amount" className="font-medium">
                            {t('expenses.amount')}
                        </Label>
                        <Input
                            id="expense-amount"
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

                    {/* Date */}
                    <div className="space-y-2">
                        <Label className="font-medium">{t('expenses.date')}</Label>
                        <ShamsiDateInput
                            value={form.date}
                            onChange={(val) => setForm({ ...form, date: val })}
                            className="w-full h-10"
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="expense-notes" className="font-medium">
                            {t('expenses.notes')}
                        </Label>
                        <Textarea
                            id="expense-notes"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            rows={2}
                            placeholder={t('expenses.notes')}
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
