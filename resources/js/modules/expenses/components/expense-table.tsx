import { useTranslation } from 'react-i18next';
import { Edit, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatPrice } from '@/data/mock';
import type { Expense } from '../types';

interface ExpenseTableProps {
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (expense: Expense) => void;
}

const categoryColors: Record<string, string> = {
    groceries: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700',
    rent: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
    electricity: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
    gas: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
    supplies: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    other: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700',
};

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
    const { t } = useTranslation();

    if (expenses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <CreditCard className="size-12 mb-3 opacity-30" />
                <p className="text-lg font-medium">{t('expenses.noExpenses')}</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-semibold">{t('expenses.description')}</TableHead>
                        <TableHead className="font-semibold">{t('expenses.category')}</TableHead>
                        <TableHead className="font-semibold">{t('expenses.amount')}</TableHead>
                        <TableHead className="font-semibold">{t('expenses.date')}</TableHead>
                        <TableHead className="font-semibold">{t('expenses.notes')}</TableHead>
                        <TableHead className="font-semibold text-center">{t('common.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.map((expense) => (
                        <TableRow key={expense.id} className="group">
                            <TableCell className="font-medium">{expense.description}</TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={`text-xs font-medium ${categoryColors[expense.category] || ''}`}
                                >
                                    {t(`expenses.categories.${expense.category}`)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className="font-semibold text-red-600 dark:text-red-400">
                                    {formatPrice(expense.amount)}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">{expense.date}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">{expense.notes || '—'}</span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(expense)}
                                        className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                    >
                                        <Edit className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(expense)}
                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
