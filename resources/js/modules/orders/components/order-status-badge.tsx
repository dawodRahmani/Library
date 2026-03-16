import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/data/mock/types';

const statusConfig: Record<OrderStatus, { className: string; translationKey: string }> = {
    pending: {
        className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
        translationKey: 'orders.statusPending',
    },
    in_kitchen: {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700',
        translationKey: 'orders.statusInKitchen',
    },
    ready: {
        className: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700',
        translationKey: 'orders.statusReady',
    },
    served: {
        className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700',
        translationKey: 'orders.statusServed',
    },
    paid: {
        className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700',
        translationKey: 'orders.statusPaid',
    },
    cancelled: {
        className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700',
        translationKey: 'orders.statusCancelled',
    },
};

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const { t } = useTranslation();
    const config = statusConfig[status];

    return (
        <Badge variant="outline" className={cn(config.className)}>
            {t(config.translationKey)}
        </Badge>
    );
}
