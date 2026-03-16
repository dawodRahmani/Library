import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatPrice } from '@/data/mock';
import type { Salary } from '../types';

interface SalaryTableProps {
    salaries: Salary[];
    onEdit: (salary: Salary) => void;
    onDelete: (salary: Salary) => void;
}

export function SalaryTable({ salaries, onEdit, onDelete }: SalaryTableProps) {
    const { t } = useTranslation();

    if (salaries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Wallet className="size-12 mb-3 opacity-30" />
                <p className="text-lg font-medium">{t('salaries.noSalaries')}</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-semibold">{t('salaries.month')}</TableHead>
                        <TableHead className="font-semibold">{t('salaries.amount')}</TableHead>
                        <TableHead className="font-semibold">{t('salaries.paymentDate')}</TableHead>
                        <TableHead className="font-semibold">{t('salaries.notes')}</TableHead>
                        <TableHead className="font-semibold text-center">{t('common.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {salaries.map((salary) => (
                        <TableRow key={salary.id} className="group">
                            <TableCell className="font-medium">{salary.month}</TableCell>
                            <TableCell>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    {formatPrice(salary.amount)}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">{salary.payment_date}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">{salary.notes || '—'}</span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(salary)}
                                        className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                    >
                                        <Edit className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(salary)}
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
