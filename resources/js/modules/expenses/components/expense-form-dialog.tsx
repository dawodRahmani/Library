import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import type { Expense, ExpenseFormData, ExpenseCategoryItem } from '../types';

interface ExpenseFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ExpenseFormData) => void;
    expense?: Expense | null;
    categories: ExpenseCategoryItem[];
}

function defaultFormData(): ExpenseFormData {
    return {
        expense_category_id: '',
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
    categories,
}: ExpenseFormDialogProps) {
    const { t } = useTranslation();
    const isEditing = !!expense;
    const [form, setForm] = useState<ExpenseFormData>(defaultFormData());
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [savingCategory, setSavingCategory] = useState(false);

    useEffect(() => {
        if (expense) {
            setForm({
                expense_category_id: expense.expense_category_id,
                description: expense.description,
                amount: expense.amount,
                date: expense.date,
                notes: expense.notes || '',
            });
        } else {
            setForm(defaultFormData());
        }
        setShowNewCategory(false);
        setNewCategoryName('');
    }, [expense, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        setSavingCategory(true);
        router.post('/expenses/categories', { name: newCategoryName.trim() }, {
            preserveScroll: true,
            onSuccess: () => {
                setNewCategoryName('');
                setShowNewCategory(false);
                setSavingCategory(false);
            },
            onError: () => {
                setSavingCategory(false);
            },
        });
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
                        {!showNewCategory ? (
                            <div className="flex gap-2">
                                <Select
                                    value={form.expense_category_id ? String(form.expense_category_id) : ''}
                                    onValueChange={(val) => setForm({ ...form, expense_category_id: Number(val) })}
                                >
                                    <SelectTrigger className="h-10 flex-1">
                                        <SelectValue placeholder={t('expenses.selectCategory')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    className="h-10 w-10 shrink-0"
                                    onClick={() => setShowNewCategory(true)}
                                    title={t('expenses.addCategory')}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Input
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder={t('expenses.newCategoryName')}
                                    className="h-10 flex-1"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddCategory();
                                        }
                                        if (e.key === 'Escape') setShowNewCategory(false);
                                    }}
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    className="h-10"
                                    onClick={handleAddCategory}
                                    disabled={savingCategory || !newCategoryName.trim()}
                                >
                                    {savingCategory ? '...' : t('common.save')}
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="h-10"
                                    onClick={() => setShowNewCategory(false)}
                                >
                                    {t('common.cancel')}
                                </Button>
                            </div>
                        )}
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
                            disabled={!form.expense_category_id}
                        >
                            {t('common.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
