import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatPrice, formatTime } from '@/data/mock';
import type { Order } from '@/data/mock/types';
import { OrderStatusBadge } from './order-status-badge';

interface OrdersTableProps {
    orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
    const { t } = useTranslation();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{t('orders.orderNumber')}</TableHead>
                    <TableHead>{t('orders.table')}</TableHead>
                    <TableHead>{t('orders.itemCount')}</TableHead>
                    <TableHead>{t('orders.total')}</TableHead>
                    <TableHead>{t('orders.status')}</TableHead>
                    <TableHead>{t('orders.time')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            {t('orders.noOrders')}
                        </TableCell>
                    </TableRow>
                ) : (
                    orders.map((order) => (
                        <TableRow
                            key={order.id}
                            className="cursor-pointer"
                            onClick={() => router.visit(`/orders/${order.id}`)}
                        >
                            <TableCell className="font-medium">{order.order_number}</TableCell>
                            <TableCell>
                                {order.table.name || `${t('orders.table')} ${order.table.number}`}
                            </TableCell>
                            <TableCell>{order.items.length}</TableCell>
                            <TableCell>{formatPrice(order.total_amount)}</TableCell>
                            <TableCell>
                                <OrderStatusBadge status={order.status} />
                            </TableCell>
                            <TableCell>{formatTime(order.created_at)}</TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
