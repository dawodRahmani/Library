import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import {
    ClipboardList,
    DollarSign,
    SquareMenu,
    TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardStatsProps {
    todaySales: number;
    todayOrders: number;
    activeTables: number;
    totalTables: number;
    dailyRevenue: number;
    pendingOrders: number;
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    valueColor: string;
    description?: string;
}

function StatCard({ title, value, icon: Icon, iconBg, iconColor, valueColor, description }: StatCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={cn('rounded-lg p-2.5', iconBg)}>
                    <Icon className={cn('h-4 w-4', iconColor)} />
                </div>
            </CardHeader>
            <CardContent>
                <div className={cn('text-2xl font-bold', valueColor)}>{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

export function DashboardStats() {
    const { t } = useTranslation();
    const { stats } = usePage<{ stats: DashboardStatsProps }>().props;

    const statCards: StatCardProps[] = [
        {
            title: t('dashboard.todaySales'),
            value: formatPrice(stats.todaySales),
            icon: DollarSign,
            iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            valueColor: 'text-emerald-700 dark:text-emerald-400',
        },
        {
            title: t('dashboard.todayOrders'),
            value: String(stats.todayOrders),
            icon: ClipboardList,
            iconBg: 'bg-amber-100 dark:bg-amber-900/40',
            iconColor: 'text-amber-600 dark:text-amber-400',
            valueColor: 'text-amber-700 dark:text-amber-400',
            description: stats.pendingOrders > 0
                ? `${stats.pendingOrders} ${t('dashboard.pendingOrders')}`
                : undefined,
        },
        {
            title: t('dashboard.activeTables'),
            value: `${stats.activeTables}/${stats.totalTables}`,
            icon: SquareMenu,
            iconBg: 'bg-sky-100 dark:bg-sky-900/40',
            iconColor: 'text-sky-600 dark:text-sky-400',
            valueColor: 'text-sky-700 dark:text-sky-400',
        },
        {
            title: t('dashboard.dailyRevenue'),
            value: formatPrice(stats.dailyRevenue),
            icon: TrendingUp,
            iconBg: 'bg-violet-100 dark:bg-violet-900/40',
            iconColor: 'text-violet-600 dark:text-violet-400',
            valueColor: 'text-violet-700 dark:text-violet-400',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
                <StatCard key={stat.title} {...stat} />
            ))}
        </div>
    );
}
