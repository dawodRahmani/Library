import { useState, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Plus, CreditCard } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';
import { ExpenseTable } from '@/modules/expenses/components/expense-table';
import { ExpenseFormDialog } from '@/modules/expenses/components/expense-form-dialog';
import { ExpenseDeleteDialog } from '@/modules/expenses/components/expense-delete-dialog';
import { ExpenseFilters } from '@/modules/expenses/components/expense-filters';
import type { Expense, ExpenseFormData, ExpenseCategoryItem } from '@/modules/expenses/types';

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

interface Props extends Record<string, unknown> {
    expenses: Expense[];
    categories: ExpenseCategoryItem[];
}

export default function ExpensesIndex() {
    const { t } = useTranslation();
    const { expenses, categories } = usePage<Props>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.expenses'), href: '/expenses' },
    ];

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

    const filteredExpenses = useMemo(() => {
        return expenses.filter((expense) => {
            const matchesSearch =
                !search ||
                expense.description.toLowerCase().includes(search.toLowerCase());
            const matchesCategory =
                categoryFilter === 'all' || String(expense.expense_category_id) === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [expenses, search, categoryFilter]);

    const totalAmount = useMemo(() => {
        return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    }, [filteredExpenses]);

    const handleEdit = (expense: Expense) => {
        setEditingExpense(expense);
        setFormOpen(true);
    };

    const handleDelete = (expense: Expense) => {
        setDeletingExpense(expense);
        setDeleteOpen(true);
    };

    const handleFormSubmit = (data: ExpenseFormData) => {
        if (editingExpense) {
            router.patch(`/expenses/${editingExpense.id}`, { ...data }, {
                onSuccess: () => { setFormOpen(false); setEditingExpense(null); },
            });
        } else {
            router.post('/expenses', { ...data }, {
                onSuccess: () => { setFormOpen(false); },
            });
        }
    };

    const handleDeleteConfirm = () => {
        if (!deletingExpense) return;
        router.delete(`/expenses/${deletingExpense.id}`, {
            onSuccess: () => { setDeleteOpen(false); setDeletingExpense(null); },
        });
    };

    const handleAddNew = () => {
        setEditingExpense(null);
        setFormOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('expenses.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-purple-600 text-white shadow-md">
                            <CreditCard className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{t('expenses.title')}</h1>
                            <p className="text-sm text-muted-foreground">
                                {t('common.showing')} {filteredExpenses.length} {t('common.of')} {expenses.length} {t('common.results')}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Total badge */}
                        <div className="rounded-xl border bg-card px-4 py-2 shadow-sm">
                            <p className="text-xs text-muted-foreground">{t('expenses.totalExpenses')}</p>
                            <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatPrice(totalAmount)}</p>
                        </div>
                        <Button
                            onClick={handleAddNew}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
                        >
                            <Plus className="size-4 me-2" />
                            {t('expenses.addExpense')}
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <ExpenseFilters
                    search={search}
                    onSearchChange={setSearch}
                    categoryFilter={categoryFilter}
                    onCategoryFilterChange={setCategoryFilter}
                    categories={categories}
                />

                {/* Table */}
                <ExpenseTable
                    expenses={filteredExpenses}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {filteredExpenses.length > 0 && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                        {t('common.showing')} {filteredExpenses.length} {t('common.of')} {expenses.length} {t('common.results')}
                    </div>
                )}
            </div>

            <ExpenseFormDialog
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setEditingExpense(null);
                }}
                onSubmit={handleFormSubmit}
                expense={editingExpense}
                categories={categories}
            />

            <ExpenseDeleteDialog
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setDeletingExpense(null);
                }}
                onConfirm={handleDeleteConfirm}
                expense={deletingExpense}
            />
        </AppLayout>
    );
}
