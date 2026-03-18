import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Users, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}
import type { MonthlyFinance } from '../data/mock-finance';
import { getPercentChange } from '../data/mock-finance';

interface FinanceSummaryCardsProps {
    current: MonthlyFinance;
    previous: MonthlyFinance;
}

export function FinanceSummaryCards({ current, previous }: FinanceSummaryCardsProps) {
    const { t } = useTranslation();

    const incomeChange = getPercentChange(current.income, previous.income);
    const expenseChange = getPercentChange(current.expenses, previous.expenses);
    const salaryChange = getPercentChange(current.salaries, previous.salaries);
    const profitChange = getPercentChange(current.netProfit, previous.netProfit);

    const cards = [
        {
            title: t('finance.totalIncome'),
            value: formatPrice(current.income),
            change: incomeChange,
            icon: DollarSign,
            iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            valueColor: 'text-emerald-700 dark:text-emerald-400',
        },
        {
            title: t('finance.totalExpenses'),
            value: formatPrice(current.expenses),
            change: expenseChange,
            invertChange: true,
            icon: CreditCard,
            iconBg: 'bg-rose-100 dark:bg-rose-900/40',
            iconColor: 'text-rose-600 dark:text-rose-400',
            valueColor: 'text-rose-700 dark:text-rose-400',
        },
        {
            title: t('finance.totalSalaries'),
            value: formatPrice(current.salaries),
            change: salaryChange,
            icon: Users,
            iconBg: 'bg-violet-100 dark:bg-violet-900/40',
            iconColor: 'text-violet-600 dark:text-violet-400',
            valueColor: 'text-violet-700 dark:text-violet-400',
        },
        {
            title: current.netProfit >= 0 ? t('finance.netProfit') : t('finance.netLoss'),
            value: formatPrice(Math.abs(current.netProfit)),
            change: profitChange,
            icon: BarChart3,
            iconBg: current.netProfit >= 0
                ? 'bg-sky-100 dark:bg-sky-900/40'
                : 'bg-rose-100 dark:bg-rose-900/40',
            iconColor: current.netProfit >= 0
                ? 'text-sky-600 dark:text-sky-400'
                : 'text-rose-600 dark:text-rose-400',
            valueColor: current.netProfit >= 0
                ? 'text-sky-700 dark:text-sky-400'
                : 'text-rose-700 dark:text-rose-400',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => {
                const isPositive = card.invertChange ? card.change <= 0 : card.change >= 0;
                return (
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
                            <div className="mt-1 flex items-center gap-1 text-xs">
                                {card.change !== 0 ? (
                                    <>
                                        {isPositive ? (
                                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                                        ) : (
                                            <TrendingDown className="h-3 w-3 text-rose-500" />
                                        )}
                                        <span className={isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                                            {Math.abs(card.change)}%
                                        </span>
                                        <span className="text-muted-foreground">
                                            {t('finance.vs')} {t('finance.lastMonth')}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-muted-foreground">{t('finance.noChange')}</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
