import { useTranslation } from 'react-i18next';
import { DollarSign, Gift, MinusCircle, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }
import type { Salary } from '../types';

interface SalaryOverviewSummaryProps {
    salaries: Salary[];
}

export function SalaryOverviewSummary({ salaries }: SalaryOverviewSummaryProps) {
    const { t } = useTranslation();

    const totalBase = salaries.reduce((s, sal) => s + sal.base_amount, 0);
    const totalBonuses = salaries.reduce((s, sal) => s + sal.bonuses, 0);
    const totalDeductions = salaries.reduce((s, sal) => s + sal.deductions, 0);
    const totalNet = salaries.reduce((s, sal) => s + sal.amount, 0);

    const paidCount = salaries.filter((s) => s.status === 'paid').length;
    const pendingCount = salaries.filter((s) => s.status === 'pending').length;
    const partialCount = salaries.filter((s) => s.status === 'partial').length;

    const cards = [
        {
            title: t('salaries.totalBase'),
            value: formatPrice(totalBase),
            icon: DollarSign,
            iconBg: 'bg-slate-100 dark:bg-slate-800',
            iconColor: 'text-slate-600 dark:text-slate-400',
            valueColor: '',
        },
        {
            title: t('salaries.totalBonuses'),
            value: formatPrice(totalBonuses),
            icon: Gift,
            iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            valueColor: 'text-emerald-700 dark:text-emerald-400',
        },
        {
            title: t('salaries.totalDeductions'),
            value: formatPrice(totalDeductions),
            icon: MinusCircle,
            iconBg: 'bg-rose-100 dark:bg-rose-900/40',
            iconColor: 'text-rose-600 dark:text-rose-400',
            valueColor: 'text-rose-700 dark:text-rose-400',
        },
        {
            title: t('salaries.totalNet'),
            value: formatPrice(totalNet),
            icon: Wallet,
            iconBg: 'bg-violet-100 dark:bg-violet-900/40',
            iconColor: 'text-violet-600 dark:text-violet-400',
            valueColor: 'text-violet-700 dark:text-violet-400',
            extra: (
                <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400">{paidCount} {t('salaries.paidCount')}</span>
                    <span className="text-amber-600 dark:text-amber-400">{pendingCount} {t('salaries.pendingCount')}</span>
                    {partialCount > 0 && (
                        <span className="text-sky-600 dark:text-sky-400">{partialCount} {t('salaries.partialCount')}</span>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.title} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.title}
                        </CardTitle>
                        <div className={cn('rounded-lg p-2.5', card.iconBg)}>
                            <card.icon className={cn('h-4 w-4', card.iconColor)} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={cn('text-2xl font-bold', card.valueColor)}>
                            {card.value}
                        </div>
                        {card.extra}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
