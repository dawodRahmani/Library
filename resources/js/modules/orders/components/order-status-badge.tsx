import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types/models';

const statusConfig: Record<OrderStatus, { className: string; translationKey: string }> = {
    pending: {
        className: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        translationKey: 'orders.statusPending',
    },
    in_kitchen: {
        className: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700',
        translationKey: 'orders.statusInKitchen',
    },
    ready: {
        className: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700',
        translationKey: 'orders.statusReady',
    },
    served: {
        className: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/50 dark:text-sky-300 dark:border-sky-700',
        translationKey: 'orders.statusServed',
    },
    paid: {
        className: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/50 dark:text-violet-300 dark:border-violet-700',
        translationKey: 'orders.statusPaid',
    },
    cancelled: {
        className: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-700',
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
