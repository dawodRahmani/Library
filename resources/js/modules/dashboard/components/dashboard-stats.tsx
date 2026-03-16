import { useTranslation } from 'react-i18next';
import {
    ClipboardList,
    DollarSign,
    SquareMenu,
    TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockOrders, mockTables, formatPrice } from '@/data/mock';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    description?: string;
}

function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

export function DashboardStats() {
    const { t } = useTranslation();

    const todayOrders = mockOrders.filter(o => o.status !== 'cancelled');
    const paidOrders = mockOrders.filter(o => o.status === 'paid');
    const todaySales = paidOrders.reduce((sum, o) => sum + o.total_amount, 0);
    const activeTables = mockTables.filter(t => t.status === 'occupied').length;

    const stats = [
        {
            title: t('dashboard.todaySales'),
            value: formatPrice(todaySales),
            icon: DollarSign,
        },
        {
            title: t('dashboard.todayOrders'),
            value: String(todayOrders.length),
            icon: ClipboardList,
        },
        {
            title: t('dashboard.activeTables'),
            value: `${activeTables}/${mockTables.length}`,
            icon: SquareMenu,
        },
        {
            title: t('dashboard.monthlyRevenue'),
            value: formatPrice(todaySales),
            icon: TrendingUp,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
            ))}
        </div>
    );
}
