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
import { Checkbox } from '@/components/ui/checkbox';
import type { Order } from '@/types/models';
import { OrderStatusBadge } from './order-status-badge';
import { formatShamsiDateTime } from '@/lib/date';

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

interface OrdersTableProps {
    orders: Order[];
    mergeMode?: boolean;
    selectedOrders?: number[];
    onToggleSelect?: (id: number) => void;
}

export function OrdersTable({ orders, mergeMode = false, selectedOrders = [], onToggleSelect }: OrdersTableProps) {
    const { t } = useTranslation();

    console.log('[OrdersTable] mergeMode:', mergeMode, 'orders:', orders.length, 'selectedOrders:', selectedOrders);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {mergeMode && <TableHead className="w-12"></TableHead>}
                    <TableHead>{t('orders.orderNumber')}</TableHead>
                    <TableHead>{t('orders.table')}</TableHead>
                    <TableHead>{t('orders.itemCount')}</TableHead>
                    <TableHead>{t('orders.total')}</TableHead>
                    <TableHead>{t('orders.status')}</TableHead>
                    <TableHead>{t('orders.dateTime')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={mergeMode ? 7 : 6} className="text-center text-muted-foreground py-8">
                            {t('orders.noOrders')}
                        </TableCell>
                    </TableRow>
                ) : (
                    orders.map((order) => {
                        const isSelected = selectedOrders.includes(order.id);
                        const isCancelled = order.status === 'cancelled';

                        return (
                            <TableRow
                                key={order.id}
                                className={`cursor-pointer ${isSelected ? 'bg-primary/10' : ''} ${mergeMode && isCancelled ? 'opacity-40' : ''}`}
                                onClick={() => {
                                    if (mergeMode) {
                                        if (!isCancelled && onToggleSelect) {
                                            console.log('[OrdersTable] toggling order:', order.id);
                                            onToggleSelect(order.id);
                                        }
                                    } else {
                                        router.visit(`/orders/${order.id}`);
                                    }
                                }}
                            >
                                {mergeMode && (
                                    <TableCell>
                                        {!isCancelled && (
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => {
                                                    console.log('[OrdersTable] checkbox toggling order:', order.id);
                                                    onToggleSelect?.(order.id);
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        )}
                                    </TableCell>
                                )}
                                <TableCell className="font-medium">{order.order_number}</TableCell>
                                <TableCell>
                                    {order.table
                                        ? order.table.name || `${t('orders.table')} ${order.table.number}`
                                        : '—'}
                                </TableCell>
                                <TableCell>{order.items.length} {t('orders.itemCount')}</TableCell>
                                <TableCell>{formatPrice(order.total_amount)}</TableCell>
                                <TableCell>
                                    <OrderStatusBadge status={order.status} />
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                    {formatShamsiDateTime(order.created_at)}
                                </TableCell>
                            </TableRow>
                        );
                    })
                )}
            </TableBody>
        </Table>
    );
}
