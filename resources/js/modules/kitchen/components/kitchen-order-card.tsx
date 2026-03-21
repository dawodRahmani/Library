import { useTranslation } from 'react-i18next';
import { Clock, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types/models';

interface KitchenOrderCardProps {
    order: Order;
    onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
}

const columnColors: Record<string, { border: string; bg: string; header: string }> = {
    pending: {
        border: 'border-slate-300 dark:border-slate-600',
        bg: 'bg-slate-50 dark:bg-slate-950',
        header: 'bg-slate-100 dark:bg-slate-900',
    },
    in_kitchen: {
        border: 'border-amber-400 dark:border-amber-600',
        bg: 'bg-amber-50 dark:bg-amber-950',
        header: 'bg-amber-100 dark:bg-amber-900',
    },
    ready: {
        border: 'border-emerald-400 dark:border-emerald-600',
        bg: 'bg-emerald-50 dark:bg-emerald-950',
        header: 'bg-emerald-100 dark:bg-emerald-900',
    },
};

function getElapsedMinutes(createdAt: string): number {
    const now = new Date();
    const created = new Date(createdAt);
    return Math.floor((now.getTime() - created.getTime()) / 60000);
}

export function KitchenOrderCard({ order, onStatusChange }: KitchenOrderCardProps) {
    const { t } = useTranslation();
    const colors = columnColors[order.status] || columnColors.pending;
    const elapsed = getElapsedMinutes(order.created_at);

    return (
        <div className={cn('rounded-xl border-2 overflow-hidden shadow-sm', colors.border, colors.bg)}>
            {/* Header */}
            <div className={cn('flex items-center justify-between px-4 py-3', colors.header)}>
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-black">{order.order_number}</span>
                    <span className="text-lg font-semibold opacity-80">
                        {order.table
                            ? `${t('kitchen.table')} ${order.table.number}${order.table.name ? ` (${order.table.name})` : ''}`
                            : t('orders.takeaway')}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium opacity-70">
                    <Clock className="h-4 w-4" />
                    <span>{elapsed} {t('kitchen.minutes')}</span>
                </div>
            </div>

            {/* Items */}
            <div className="px-4 py-3 space-y-2">
                {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-2">
                            <UtensilsCrossed className="h-4 w-4 opacity-50" />
                            <span className="font-medium">{item.food_item?.name ?? '—'}</span>
                        </div>
                        <span className="font-bold text-xl">x{item.quantity}</span>
                    </div>
                ))}
                {order.items.some(i => i.notes) && (
                    <div className="mt-2 pt-2 border-t border-current/10">
                        {order.items.filter(i => i.notes).map((item) => (
                            <p key={item.id} className="text-sm opacity-70">
                                {item.food_item?.name ?? '—'}: {item.notes}
                            </p>
                        ))}
                    </div>
                )}
            </div>

            {/* Action */}
            <div className="px-4 pb-4">
                {order.status === 'pending' && (
                    <Button
                        className="w-full h-12 text-lg font-bold bg-amber-500 hover:bg-amber-600 text-white"
                        onClick={() => onStatusChange(order.id, 'in_kitchen')}
                    >
                        {t('kitchen.startPreparing')}
                    </Button>
                )}
                {order.status === 'in_kitchen' && (
                    <Button
                        className="w-full h-12 text-lg font-bold bg-emerald-500 hover:bg-emerald-600 text-white"
                        onClick={() => onStatusChange(order.id, 'ready')}
                    >
                        {t('kitchen.markReady')}
                    </Button>
                )}
                {order.status === 'ready' && (
                    <Button
                        className="w-full h-12 text-lg font-bold bg-sky-500 hover:bg-sky-600 text-white"
                        onClick={() => onStatusChange(order.id, 'served')}
                    >
                        {t('kitchen.markServed')}
                    </Button>
                )}
            </div>
        </div>
    );
}
