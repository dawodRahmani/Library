import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Printer, Pencil, ArrowRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { OrderStatus } from '@/data/mock/types';
import { mockOrders, formatPrice, formatTime, formatDate } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderStatusBadge } from '@/modules/orders/components/order-status-badge';
import { OrderItemsTable } from '@/modules/orders/components/order-items-table';
import { OrderStatusActions } from '@/modules/orders/components/order-status-actions';
import { OrderReceipt } from '@/modules/orders/components/order-receipt';

export default function OrderShowPage() {
    const { t } = useTranslation();

    const orderId = parseInt(window.location.pathname.split('/').pop() || '0');
    const order = mockOrders.find((o) => o.id === orderId);

    const [currentStatus, setCurrentStatus] = useState<OrderStatus>(
        order?.status || 'pending',
    );

    if (!order) {
        return (
            <AppLayout breadcrumbs={[]}>
                <Head title={t('orders.notFound')} />
                <div className="flex flex-1 items-center justify-center p-4">
                    <div className="text-center">
                        <h2 className="text-xl font-bold">{t('orders.notFound')}</h2>
                        <Button asChild className="mt-4">
                            <Link href="/orders">{t('orders.backToOrders')}</Link>
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('orders.title'), href: '/orders' },
        { title: order.order_number, href: `/orders/${order.id}` },
    ];

    const handleStatusChange = (newStatus: OrderStatus) => {
        setCurrentStatus(newStatus);
    };

    const handlePrintBill = () => {
        window.print();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('orders.order')} ${order.order_number}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl sm:text-2xl font-bold">
                            {t('orders.order')} {order.order_number}
                        </h1>
                        <OrderStatusBadge status={currentStatus} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrintBill}>
                            <Printer className="me-2 size-4" />
                            {t('orders.printBill')}
                        </Button>
                        {currentStatus === 'pending' && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/orders/${order.id}/edit`}>
                                    <Pencil className="me-2 size-4" />
                                    {t('orders.editOrder')}
                                </Link>
                            </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/orders">
                                <ArrowRight className="me-2 size-4" />
                                {t('orders.backToOrders')}
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {t('orders.table')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-bold">
                                {order.table.name || `${t('orders.table')} ${order.table.number}`}
                            </p>
                            <p className="text-muted-foreground text-sm">
                                {t('orders.capacity')}: {order.table.capacity}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {t('orders.waiter')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-bold">{order.created_by_name}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {t('orders.dateTime')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-bold">{formatTime(order.created_at)}</p>
                            <p className="text-muted-foreground text-sm">
                                {formatDate(order.created_at)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('orders.orderItems')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <OrderItemsTable
                            items={order.items}
                            totalAmount={order.total_amount}
                        />
                    </CardContent>
                </Card>

                {order.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('orders.notes')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{order.notes}</p>
                        </CardContent>
                    </Card>
                )}

                <Separator />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <OrderStatusActions
                        status={currentStatus}
                        onStatusChange={handleStatusChange}
                    />
                    <div className="text-lg sm:text-xl font-bold">
                        {t('orders.total')}: {formatPrice(order.total_amount)}
                    </div>
                </div>
            </div>
            {/* Hidden receipt for printing */}
            <OrderReceipt order={order} />
        </AppLayout>
    );
}
