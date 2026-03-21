import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Calendar, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}
import type { MonthlyFinance, ExpenseCategoryBreakdown } from '../types';
import { getPercentChange } from '../types';

interface ProfitMarginCardProps {
    current: MonthlyFinance;
    previous: MonthlyFinance;
    expenseBreakdown: ExpenseCategoryBreakdown[];
}

export function ProfitMarginCard({ current, previous, expenseBreakdown }: ProfitMarginCardProps) {
    const { t } = useTranslation();

    const profitMargin = current.income > 0
        ? Math.round((current.netProfit / current.income) * 100)
        : 0;
    const previousMargin = previous.income > 0
        ? Math.round((previous.netProfit / previous.income) * 100)
        : 0;
    const marginChange = profitMargin - previousMargin;

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const avgDailyIncome = Math.round(current.income / daysInMonth);
    const avgDailyExpense = Math.round((current.expenses + current.salaries) / daysInMonth);

    const topExpense = expenseBreakdown.length > 0
        ? expenseBreakdown.reduce((max, cat) => cat.amount > max.amount ? cat : max)
        : null;

    const stats = [
        {
            label: t('finance.profitMargin'),
            value: `${profitMargin}%`,
            change: marginChange,
            icon: ArrowUpDown,
        },
        {
            label: t('finance.avgDailyIncome'),
            value: formatPrice(avgDailyIncome),
            change: getPercentChange(current.income / daysInMonth, previous.income / daysInMonth),
            icon: TrendingUp,
        },
        {
            label: t('finance.avgDailyExpense'),
            value: formatPrice(avgDailyExpense),
            change: getPercentChange(
                (current.expenses + current.salaries) / daysInMonth,
                (previous.expenses + previous.salaries) / daysInMonth,
            ),
            invertChange: true,
            icon: TrendingDown,
        },
        ...(topExpense ? [{
            label: t('finance.topExpenseCategory'),
            value: topExpense.categoryLabel,
            subValue: formatPrice(topExpense.amount),
            icon: Calendar,
        }] : []),
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('finance.overview')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {stats.map((stat) => {
                    const isPositive = stat.invertChange
                        ? (stat.change ?? 0) <= 0
                        : (stat.change ?? 0) >= 0;
                    return (
                        <div key={stat.label} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-muted p-2">
                                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="font-semibold">{stat.value}</p>
                                    {stat.subValue && (
                                        <p className="text-xs text-muted-foreground">{stat.subValue}</p>
                                    )}
                                </div>
                            </div>
                            {stat.change !== undefined && (
                                <span className={cn(
                                    'text-sm font-medium',
                                    isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
                                )}>
                                    {stat.change > 0 ? '+' : ''}{stat.change}%
                                </span>
                            )}
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
