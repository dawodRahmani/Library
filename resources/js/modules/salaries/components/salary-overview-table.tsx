import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { CheckCircle2, DollarSign, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}
import type { Salary } from '../types';
import { SalaryStatusBadge } from './salary-status-badge';

interface PageEmployee {
    id: number;
    name: string;
    role: string;
    is_active: boolean;
    base_salary: number;
}

interface SalaryOverviewTableProps {
    employees: PageEmployee[];
    salaries: Salary[];
    month: string;
}

export function SalaryOverviewTable({ employees, salaries, month }: SalaryOverviewTableProps) {
    const { t } = useTranslation();

    const getSalaryForEmployee = (empId: number) =>
        salaries.find((s) => s.employee_id === empId && s.month === month);


    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        {t('salaries.monthlyOverview')}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableHead className="font-semibold">{t('salaries.employeeName')}</TableHead>
                                <TableHead className="font-semibold">{t('salaries.baseSalary')}</TableHead>
                                <TableHead className="font-semibold">{t('salaries.bonuses')}</TableHead>
                                <TableHead className="font-semibold">{t('salaries.deductions')}</TableHead>
                                <TableHead className="font-semibold">{t('salaries.netAmount')}</TableHead>
                                <TableHead className="font-semibold">{t('salaries.status')}</TableHead>
                                <TableHead className="font-semibold text-center">{t('common.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.filter((e) => e.is_active).map((employee) => {
                                const salary = getSalaryForEmployee(employee.id);
                                const baseAmount = salary?.base_amount ?? employee.base_salary;
                                const bonuses = salary?.bonuses ?? 0;
                                const deductions = salary?.deductions ?? 0;
                                const netAmount = salary?.amount ?? 0;
                                const status = salary?.status ?? 'pending';
                                const remaining = status === 'partial' ? (baseAmount + bonuses - deductions) - netAmount : 0;

                                return (
                                    <TableRow key={employee.id} className="group">
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{employee.name}</p>
                                                <p className="text-xs text-muted-foreground">{t(`employees.roles.${employee.role}`, employee.role)}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatPrice(baseAmount)}</TableCell>
                                        <TableCell>
                                            {bonuses > 0 ? (
                                                <span className="text-emerald-600 dark:text-emerald-400">+{formatPrice(bonuses)}</span>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {deductions > 0 ? (
                                                <span className="text-rose-600 dark:text-rose-400">-{formatPrice(deductions)}</span>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <span className="font-semibold">{formatPrice(netAmount)}</span>
                                                {remaining > 0 && (
                                                    <p className="text-xs text-amber-600 dark:text-amber-400">
                                                        {t('salaries.remaining')}: {formatPrice(remaining)}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <SalaryStatusBadge status={status} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-1">
                                                {salary && salary.status !== 'paid' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                                        onClick={() => router.patch(`/salaries/${salary.id}/pay`)}
                                                    >
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        <span className="text-xs">{t('salaries.markAsPaid')}</span>
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 gap-1.5"
                                                    onClick={() => router.visit(`/employees/${employee.id}/salary`)}
                                                >
                                                    <DollarSign className="h-3.5 w-3.5" />
                                                    <span className="text-xs">{t('salaries.salaryHistory')}</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
