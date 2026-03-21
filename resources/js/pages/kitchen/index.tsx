import { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { KitchenHeader } from '@/modules/kitchen/components/kitchen-header';
import { KitchenColumn } from '@/modules/kitchen/components/kitchen-column';
import { useOrderEvents } from '@/hooks/use-order-events';
import type { Order, OrderStatus } from '@/types/models';

interface Props extends Record<string, unknown> { orders: Order[] }

export default function KitchenPage() {
    const { t } = useTranslation();
    const { orders: initialOrders } = usePage<Props>().props;

    const [orders, setOrders] = useState<Order[]>(initialOrders);

    // Sync with server props when they change (from polling)
    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    // Auto-refresh every 5s with sound notification
    useOrderEvents({ reloadProps: ['orders'], showNotifications: true });

    // Re-render every 30s to update elapsed time display
    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 30000);
        return () => clearInterval(interval);
    }, []);

    const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
        // Optimistically update UI
        setOrders(prev =>
            prev.map(o => o.id !== orderId ? o : { ...o, status: newStatus })
                .filter(o => o.status !== 'served')
        );
        // Persist to backend
        router.patch(`/orders/${orderId}/status`, { status: newStatus }, { preserveState: true });
    };

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const inKitchenOrders = orders.filter(o => o.status === 'in_kitchen');
    const readyOrders = orders.filter(o => o.status === 'ready');

    return (
        <>
            <Head title={t('kitchen.title')} />
            <div className="flex flex-col h-screen bg-background">
                <KitchenHeader activeCount={orders.length} />

                <div className="flex-1 grid grid-cols-3 gap-4 p-4 min-h-0">
                    {/* New Orders Column */}
                    <KitchenColumn
                        title={t('kitchen.newOrders')}
                        orders={pendingOrders}
                        emptyMessage={t('kitchen.noNewOrders')}
                        colorClass="bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                        countBgClass="bg-slate-400 text-slate-900 dark:bg-slate-600 dark:text-slate-100"
                        onStatusChange={handleStatusChange}
                    />

                    {/* Preparing Column */}
                    <KitchenColumn
                        title={t('kitchen.preparing')}
                        orders={inKitchenOrders}
                        emptyMessage={t('kitchen.noPreparingOrders')}
                        colorClass="bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100"
                        countBgClass="bg-amber-400 text-amber-900 dark:bg-amber-700 dark:text-amber-100"
                        onStatusChange={handleStatusChange}
                    />

                    {/* Ready Column */}
                    <KitchenColumn
                        title={t('kitchen.ready')}
                        orders={readyOrders}
                        emptyMessage={t('kitchen.noReadyOrders')}
                        colorClass="bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100"
                        countBgClass="bg-emerald-400 text-emerald-900 dark:bg-emerald-700 dark:text-emerald-100"
                        onStatusChange={handleStatusChange}
                    />
                </div>
            </div>
        </>
    );
}
