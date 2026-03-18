import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Wallet, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Salary } from '../types';
import { SalaryStatusBadge } from './salary-status-badge';
import { formatShamsiDate } from '@/lib/date';

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

interface SalaryTableProps {
    salaries: Salary[];
    onEdit: (salary: Salary) => void;
    onDelete: (salary: Salary) => void;
    onPayslip: (salary: Salary) => void;
}

export function SalaryTable({ salaries, onEdit, onDelete, onPayslip }: SalaryTableProps) {
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
                        <TableHead className="font-semibold">{t('salaries.baseSalary')}</TableHead>
                        <TableHead className="font-semibold">{t('salaries.bonuses')}</TableHead>
                        <TableHead className="font-semibold">{t('salaries.deductions')}</TableHead>
                        <TableHead className="font-semibold">{t('salaries.netAmount')}</TableHead>
                        <TableHead className="font-semibold">{t('salaries.status')}</TableHead>
                        <TableHead className="font-semibold">{t('salaries.paymentDate')}</TableHead>
                        <TableHead className="font-semibold">{t('salaries.notes')}</TableHead>
                        <TableHead className="font-semibold text-center">{t('common.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {salaries.map((salary) => (
                        <TableRow key={salary.id} className="group">
                            <TableCell className="font-medium">{salary.month}</TableCell>
                            <TableCell>{formatPrice(salary.base_amount)}</TableCell>
                            <TableCell>
                                {salary.bonuses > 0 ? (
                                    <span className="text-emerald-600 dark:text-emerald-400">+{formatPrice(salary.bonuses)}</span>
                                ) : (
                                    <span className="text-muted-foreground">—</span>
                                )}
                            </TableCell>
                            <TableCell>
                                {salary.deductions > 0 ? (
                                    <span className="text-rose-600 dark:text-rose-400">-{formatPrice(salary.deductions)}</span>
                                ) : (
                                    <span className="text-muted-foreground">—</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <span className="font-semibold">{formatPrice(salary.amount)}</span>
                            </TableCell>
                            <TableCell>
                                <SalaryStatusBadge status={salary.status} />
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">
                                    {formatShamsiDate(salary.payment_date)}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">{salary.notes || '—'}</span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onPayslip(salary)}
                                        className="h-8 w-8 p-0 text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                                    >
                                        <Printer className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(salary)}
                                        className="h-8 w-8 p-0 text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                                    >
                                        <Edit className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(salary)}
                                        className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
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
