import { useTranslation } from 'react-i18next';
import { CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}
import type { SalaryOverview } from '../data/mock-finance';

interface SalaryOverviewCardProps {
    data: SalaryOverview[];
}

export function SalaryOverviewCard({ data }: SalaryOverviewCardProps) {
    const { t } = useTranslation();

    const totalSalary = data.reduce((sum, e) => sum + e.baseSalary, 0);
    const paidCount = data.filter((e) => e.status === 'paid').length;
    const paidAmount = data.filter((e) => e.status === 'paid').reduce((sum, e) => sum + e.baseSalary, 0);
    const pendingAmount = totalSalary - paidAmount;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{t('finance.salaryOutflow')}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                        {paidCount}/{data.length} {t('finance.paidEmployees')}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Summary row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                        <p className="text-xs text-muted-foreground mb-1">{t('finance.paidEmployees')}</p>
                        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                            {formatPrice(paidAmount)}
                        </p>
                    </div>
                    <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                        <p className="text-xs text-muted-foreground mb-1">{t('finance.pendingPayments')}</p>
                        <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
                            {formatPrice(pendingAmount)}
                        </p>
                    </div>
                </div>

                {/* Employee list */}
                <div className="space-y-2">
                    {data.map((employee) => (
                        <div
                            key={employee.employeeName}
                            className="flex items-center justify-between rounded-lg border p-3"
                        >
                            <div className="flex items-center gap-3">
                                {employee.status === 'paid' ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                ) : (
                                    <Clock className="h-4 w-4 text-amber-500" />
                                )}
                                <div>
                                    <p className="font-medium text-sm">{employee.employeeName}</p>
                                    <p className="text-xs text-muted-foreground">{employee.role}</p>
                                </div>
                            </div>
                            <div className="text-end">
                                <p className="font-medium text-sm">{formatPrice(employee.baseSalary)}</p>
                                <Badge
                                    variant="secondary"
                                    className={cn(
                                        'text-xs mt-0.5',
                                        employee.status === 'paid'
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
                                    )}
                                >
                                    {employee.status === 'paid' ? t('finance.paidEmployees') : t('finance.pendingPayments')}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
