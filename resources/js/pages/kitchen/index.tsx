import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { KitchenHeader } from '@/modules/kitchen/components/kitchen-header';
import { KitchenColumn } from '@/modules/kitchen/components/kitchen-column';
import { mockOrders } from '@/data/mock';
import type { Order, OrderStatus } from '@/data/mock/types';

export default function KitchenPage() {
    const { t } = useTranslation();

    // Local state from mock data — filter only active kitchen orders
    const [orders, setOrders] = useState<Order[]>(() =>
        mockOrders.filter(o => ['pending', 'in_kitchen', 'ready'].includes(o.status))
    );

    // Auto-refresh timer (re-render every 30s to update elapsed time)
    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 30000);
        return () => clearInterval(interval);
    }, []);

    const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
        setOrders(prev =>
            prev.map(o => {
                if (o.id !== orderId) return o;
                // If served, remove from board
                if (newStatus === 'served') {
                    return { ...o, status: newStatus };
                }
                return { ...o, status: newStatus };
            }).filter(o => o.status !== 'served')
        );
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
                        colorClass="bg-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100"
                        countBgClass="bg-yellow-400 text-yellow-900 dark:bg-yellow-700 dark:text-yellow-100"
                        onStatusChange={handleStatusChange}
                    />

                    {/* Preparing Column */}
                    <KitchenColumn
                        title={t('kitchen.preparing')}
                        orders={inKitchenOrders}
                        emptyMessage={t('kitchen.noPreparingOrders')}
                        colorClass="bg-orange-200 text-orange-900 dark:bg-orange-900 dark:text-orange-100"
                        countBgClass="bg-orange-400 text-orange-900 dark:bg-orange-700 dark:text-orange-100"
                        onStatusChange={handleStatusChange}
                    />

                    {/* Ready Column */}
                    <KitchenColumn
                        title={t('kitchen.ready')}
                        orders={readyOrders}
                        emptyMessage={t('kitchen.noReadyOrders')}
                        colorClass="bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-100"
                        countBgClass="bg-green-400 text-green-900 dark:bg-green-700 dark:text-green-100"
                        onStatusChange={handleStatusChange}
                    />
                </div>
            </div>
        </>
    );
}
