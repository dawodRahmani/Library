import { useRef, useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Printer, ChevronRight, X, ClipboardList } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Order, OrderStatus } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { OrderStatusBadge } from '@/modules/orders/components/order-status-badge';
import { OrderReceipt } from '@/modules/orders/components/order-receipt';
import { useOrderEvents } from '@/hooks/use-order-events';
import { formatTime } from '@/lib/date';
import { cn } from '@/lib/utils';

interface Props extends Record<string, unknown> {
    orders: Order[];
}

const statusCardStyles: Record<string, string> = {
    pending:    'border-s-4 border-s-slate-400   bg-slate-50/60   dark:bg-slate-900/20',
    in_kitchen: 'border-s-4 border-s-amber-500   bg-amber-50/60   dark:bg-amber-900/10',
    ready:      'border-s-4 border-s-emerald-500 bg-emerald-50/60 dark:bg-emerald-900/10',
    served:     'border-s-4 border-s-sky-500     bg-sky-50/60     dark:bg-sky-900/10',
};

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
    pending:    'in_kitchen',
    in_kitchen: 'ready',
    ready:      'served',
    served:     'paid',
};

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

export default function ActiveOrdersPage() {
    const { t } = useTranslation();
    const { orders } = usePage<Props>().props;

    const [printOrder, setPrintOrder] = useState<Order | null>(null);
    const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
    const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});

    useOrderEvents({ reloadProps: ['orders'], showNotifications: true });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('activeOrders.title'), href: '/orders/active' },
    ];

    function setLoading(id: number, val: boolean) {
        setLoadingMap((prev) => ({ ...prev, [id]: val }));
    }

    function handleStatusChange(order: Order, newStatus: OrderStatus) {
        setLoading(order.id, true);
        if (newStatus === 'paid') {
            router.patch(`/orders/${order.id}/pay`, {}, {
                onFinish: () => setLoading(order.id, false),
            });
            return;
        }
        router.patch(`/orders/${order.id}/status`, { status: newStatus }, {
            onFinish: () => setLoading(order.id, false),
        });
    }

    function handleCancel(orderId: number) {
        setLoading(orderId, true);
        router.post(`/orders/${orderId}/cancel`, {}, {
            onFinish: () => {
                setLoading(orderId, false);
                setCancelOrderId(null);
            },
        });
    }

    function handlePrint(order: Order) {
        setPrintOrder(order);
        setTimeout(() => window.print(), 100);
    }

    const nextStatusLabel: Partial<Record<OrderStatus, string>> = {
        pending:    t('orders.sendToKitchen'),
        in_kitchen: t('orders.markReady'),
        ready:      t('orders.markServed'),
        served:     t('orders.markPaid'),
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('activeOrders.title')} />

            {/* Hidden receipt — only shown when printing */}
            {printOrder && <OrderReceipt order={printOrder} />}

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{t('activeOrders.title')}</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {orders.length} {t('activeOrders.activeCount')}
                        </p>
                    </div>
                </div>

                {/* Status legend */}
                <div className="flex flex-wrap gap-3 text-xs">
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block h-3 w-1 rounded-full bg-slate-400" />
                        {t('orders.statusPending')}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block h-3 w-1 rounded-full bg-amber-500" />
                        {t('orders.statusInKitchen')}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block h-3 w-1 rounded-full bg-emerald-500" />
                        {t('orders.statusReady')}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block h-3 w-1 rounded-full bg-sky-500" />
                        {t('orders.statusServed')}
                    </span>
                </div>

                {/* Empty state */}
                {orders.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
                        <ClipboardList className="size-16 opacity-25" />
                        <p className="text-lg font-medium">{t('activeOrders.noActiveOrders')}</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {orders.map((order) => (
                            <Card
                                key={order.id}
                                className={cn(
                                    'overflow-hidden shadow-sm transition-all',
                                    statusCardStyles[order.status] ?? '',
                                )}
                            >
                                <CardHeader className="pb-2 pt-3 px-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-bold text-base">{order.order_number}</span>
                                        <OrderStatusBadge status={order.status} />
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center justify-between mt-1">
                                        <span>
                                            {order.table
                                                ? `${t('orders.table')}: ${order.table.name || order.table.number}`
                                                : order.order_type === 'takeaway'
                                                    ? t('orders.takeaway')
                                                    : t('orders.delivery')}
                                        </span>
                                        <span>{formatTime(order.created_at)}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="px-4 pb-4 space-y-3">
                                    {/* Items list */}
                                    <ul className="text-sm space-y-1 border-t pt-2">
                                        {order.items.map((item) => (
                                            <li key={item.id} className="flex justify-between gap-2">
                                                <span className="truncate">
                                                    {item.food_item?.name ?? '—'} × {item.quantity}
                                                </span>
                                                <span className="text-muted-foreground shrink-0">
                                                    {item.subtotal.toLocaleString()} ؋
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Total */}
                                    <div className="flex items-center justify-between font-semibold border-t pt-2 text-sm">
                                        <span>{t('orders.total')}</span>
                                        <span>{formatPrice(order.total_amount)}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 pt-1">
                                        {/* Primary action: advance to next status */}
                                        {nextStatus[order.status] && (
                                            <Button
                                                size="sm"
                                                className="w-full"
                                                disabled={loadingMap[order.id]}
                                                onClick={() =>
                                                    handleStatusChange(order, nextStatus[order.status]!)
                                                }
                                            >
                                                <ChevronRight className="size-4 me-1" />
                                                {nextStatusLabel[order.status]}
                                            </Button>
                                        )}

                                        <div className="flex gap-2">
                                            {/* Print Bill */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => handlePrint(order)}
                                            >
                                                <Printer className="size-4 me-1" />
                                                {t('orders.printBill')}
                                            </Button>

                                            {/* Cancel (only for pending/in_kitchen) */}
                                            {(order.status === 'pending' || order.status === 'in_kitchen') && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="flex-1"
                                                    disabled={loadingMap[order.id]}
                                                    onClick={() => setCancelOrderId(order.id)}
                                                >
                                                    <X className="size-4 me-1" />
                                                    {t('orders.cancelOrder')}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel confirmation dialog */}
            <Dialog open={cancelOrderId !== null} onOpenChange={(open) => !open && setCancelOrderId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('orders.cancelOrder')}</DialogTitle>
                        <DialogDescription>{t('orders.confirmCancel')}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCancelOrderId(null)}>
                            {t('orders.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={cancelOrderId !== null && loadingMap[cancelOrderId]}
                            onClick={() => cancelOrderId !== null && handleCancel(cancelOrderId)}
                        >
                            {t('orders.cancelOrder')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
