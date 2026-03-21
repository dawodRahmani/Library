import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { KitchenOrderCard } from './kitchen-order-card';
import type { Order, OrderStatus } from '@/types/models';

interface KitchenColumnProps {
    title: string;
    orders: Order[];
    emptyMessage: string;
    colorClass: string;
    countBgClass: string;
    onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
}

export function KitchenColumn({
    title,
    orders,
    emptyMessage,
    colorClass,
    countBgClass,
    onStatusChange,
}: KitchenColumnProps) {
    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Column Header */}
            <div className={cn('flex items-center justify-between rounded-t-xl px-4 py-3', colorClass)}>
                <h2 className="text-xl font-bold">{title}</h2>
                <span className={cn('flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold', countBgClass)}>
                    {orders.length}
                </span>
            </div>

            {/* Column Body */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-muted/30 rounded-b-xl">
                {orders.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground text-lg">
                        {emptyMessage}
                    </div>
                ) : (
                    orders.map((order) => (
                        <KitchenOrderCard
                            key={order.id}
                            order={order}
                            onStatusChange={onStatusChange}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
