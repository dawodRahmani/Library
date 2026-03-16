import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockOrders, formatPrice, formatTime } from '@/data/mock';
import type { OrderStatus } from '@/data/mock/types';
import { cn } from '@/lib/utils';

const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-gray-100 text-gray-800',
    in_kitchen: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-orange-100 text-orange-800',
    served: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const statusKeys: Record<OrderStatus, string> = {
    pending: 'orders.statusPending',
    in_kitchen: 'orders.statusInKitchen',
    ready: 'orders.statusReady',
    served: 'orders.statusServed',
    paid: 'orders.statusPaid',
    cancelled: 'orders.statusCancelled',
};

export function RecentOrders() {
    const { t } = useTranslation();

    const recentOrders = mockOrders
        .filter(o => o.status !== 'cancelled')
        .slice(0, 5);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('dashboard.recentOrders')}</CardTitle>
            </CardHeader>
            <CardContent>
                {recentOrders.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                        {t('dashboard.noOrders')}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => router.visit(`/orders/${order.id}`)}
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{order.order_number}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {t('orders.table')} {order.table.number}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {order.items.map(i => `${i.food_item.name} x${i.quantity}`).join('، ')}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <Badge className={cn('text-xs', statusColors[order.status])} variant="secondary">
                                        {t(statusKeys[order.status])}
                                    </Badge>
                                    <span className="text-sm font-medium">{formatPrice(order.total_amount)}</span>
                                    <span className="text-xs text-muted-foreground">{formatTime(order.created_at)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
