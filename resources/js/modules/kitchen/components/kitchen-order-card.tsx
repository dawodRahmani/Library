import { useTranslation } from 'react-i18next';
import { Clock, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus } from '@/data/mock/types';

interface KitchenOrderCardProps {
    order: Order;
    onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
}

const columnColors: Record<string, { border: string; bg: string; header: string }> = {
    pending: {
        border: 'border-yellow-400 dark:border-yellow-600',
        bg: 'bg-yellow-50 dark:bg-yellow-950',
        header: 'bg-yellow-100 dark:bg-yellow-900',
    },
    in_kitchen: {
        border: 'border-orange-400 dark:border-orange-600',
        bg: 'bg-orange-50 dark:bg-orange-950',
        header: 'bg-orange-100 dark:bg-orange-900',
    },
    ready: {
        border: 'border-green-400 dark:border-green-600',
        bg: 'bg-green-50 dark:bg-green-950',
        header: 'bg-green-100 dark:bg-green-900',
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
                        {t('kitchen.table')} {order.table.number}
                        {order.table.name ? ` (${order.table.name})` : ''}
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
                            <span className="font-medium">{item.food_item.name}</span>
                        </div>
                        <span className="font-bold text-xl">x{item.quantity}</span>
                    </div>
                ))}
                {order.items.some(i => i.notes) && (
                    <div className="mt-2 pt-2 border-t border-current/10">
                        {order.items.filter(i => i.notes).map((item) => (
                            <p key={item.id} className="text-sm opacity-70">
                                {item.food_item.name}: {item.notes}
                            </p>
                        ))}
                    </div>
                )}
            </div>

            {/* Action */}
            <div className="px-4 pb-4">
                {order.status === 'pending' && (
                    <Button
                        className="w-full h-12 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => onStatusChange(order.id, 'in_kitchen')}
                    >
                        {t('kitchen.startPreparing')}
                    </Button>
                )}
                {order.status === 'in_kitchen' && (
                    <Button
                        className="w-full h-12 text-lg font-bold bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => onStatusChange(order.id, 'ready')}
                    >
                        {t('kitchen.markReady')}
                    </Button>
                )}
                {order.status === 'ready' && (
                    <Button
                        className="w-full h-12 text-lg font-bold bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => onStatusChange(order.id, 'served')}
                    >
                        {t('kitchen.markServed')}
                    </Button>
                )}
            </div>
        </div>
    );
}
