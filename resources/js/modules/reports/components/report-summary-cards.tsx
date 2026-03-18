import { useTranslation } from 'react-i18next';
import { DollarSign, CreditCard, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

interface ReportSummaryCardsProps {
    revenue: number;
    expenses: number;
    profit: number;
}

export function ReportSummaryCards({ revenue, expenses, profit }: ReportSummaryCardsProps) {
    const { t } = useTranslation();

    const cards = [
        {
            title: t('reports.revenue'),
            value: formatPrice(revenue),
            icon: DollarSign,
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-50 dark:bg-green-950',
        },
        {
            title: t('reports.expenses'),
            value: formatPrice(expenses),
            icon: CreditCard,
            color: 'text-red-600 dark:text-red-400',
            bg: 'bg-red-50 dark:bg-red-950',
        },
        {
            title: t('reports.netProfit'),
            value: formatPrice(profit),
            icon: TrendingUp,
            color: profit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400',
            bg: profit >= 0 ? 'bg-blue-50 dark:bg-blue-950' : 'bg-red-50 dark:bg-red-950',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {cards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.title}
                        </CardTitle>
                        <div className={cn('rounded-lg p-2', card.bg)}>
                            <card.icon className={cn('h-4 w-4', card.color)} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={cn('text-2xl font-bold', card.color)}>
                            {card.value}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
