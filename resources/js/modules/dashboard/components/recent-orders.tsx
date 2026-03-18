import { useTranslation } from 'react-i18next';
import { usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
type OrderStatus = 'pending' | 'in_kitchen' | 'ready' | 'served' | 'paid' | 'cancelled';
import { cn } from '@/lib/utils';
import { formatShamsiDateTime } from '@/lib/date';

interface RecentOrder {
    id: number;
    order_number: string;
    status: OrderStatus;
    total_amount: number;
    table: { number: number; name: string | null } | null;
    created_at: string;
    items_count: number;
}

const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    in_kitchen: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    ready: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    served: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
    paid: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
    cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
};

const statusKeys: Record<OrderStatus, string> = {
    pending: 'orders.statusPending',
    in_kitchen: 'orders.statusInKitchen',
    ready: 'orders.statusReady',
    served: 'orders.statusServed',
    paid: 'orders.statusPaid',
    cancelled: 'orders.statusCancelled',
};

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

export function RecentOrders() {
    const { t } = useTranslation();
    const { recentOrders } = usePage<{ recentOrders: RecentOrder[] }>().props;

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
                                        {order.table && (
                                            <span className="text-sm text-muted-foreground">
                                                {t('orders.table')} {order.table.number}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {t('orders.itemsCount', { count: order.items_count })}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <Badge className={cn('text-xs', statusColors[order.status])} variant="secondary">
                                        {t(statusKeys[order.status])}
                                    </Badge>
                                    <span className="text-sm font-medium">{formatPrice(order.total_amount)}</span>
                                    <span className="text-xs text-muted-foreground">{formatShamsiDateTime(order.created_at)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
