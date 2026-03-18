import { useTranslation } from 'react-i18next';
import { Package, AlertTriangle, ShoppingCart, Trash2, DollarSign, AlertOctagon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

interface InventoryStatsData {
    totalItems: number;
    totalValue: number;
    totalPurchases: number;
    totalWasteLoss: number;
    lowStockCount: number;
    criticalCount: number;
}

interface InventoryStatsProps {
    stats: InventoryStatsData;
}

export function InventoryStats({ stats }: InventoryStatsProps) {
    const { t } = useTranslation();

    const cards = [
        {
            label: t('inventory.totalItems'),
            value: stats.totalItems.toString(),
            icon: Package,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        },
        {
            label: t('inventory.totalValue'),
            value: formatPrice(stats.totalValue),
            icon: DollarSign,
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-50 dark:bg-purple-900/20',
        },
        {
            label: t('inventory.totalPurchases'),
            value: formatPrice(stats.totalPurchases),
            icon: ShoppingCart,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            label: t('inventory.wasteLoss'),
            value: formatPrice(stats.totalWasteLoss),
            icon: Trash2,
            color: 'text-red-600 dark:text-red-400',
            bg: 'bg-red-50 dark:bg-red-900/20',
        },
        {
            label: t('inventory.lowStockItems'),
            value: stats.lowStockCount.toString(),
            icon: AlertTriangle,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
        },
        {
            label: t('inventory.criticalItems'),
            value: stats.criticalCount.toString(),
            icon: AlertOctagon,
            color: 'text-red-600 dark:text-red-400',
            bg: 'bg-red-50 dark:bg-red-900/20',
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
                <Card key={card.label} className="border-border/50 shadow-sm">
                    <CardContent className="flex items-center gap-4 p-4">
                        <div className={`flex size-11 items-center justify-center rounded-xl ${card.bg}`}>
                            <card.icon className={`size-5 ${card.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{card.label}</p>
                            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
