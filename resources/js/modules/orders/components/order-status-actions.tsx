import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { OrderStatus } from '@/data/mock/types';

interface OrderStatusActionsProps {
    status: OrderStatus;
    onStatusChange: (newStatus: OrderStatus) => void;
}

export function OrderStatusActions({ status, onStatusChange }: OrderStatusActionsProps) {
    const { t } = useTranslation();

    if (status === 'paid' || status === 'cancelled') {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {status === 'pending' && (
                <Button onClick={() => onStatusChange('in_kitchen')}>
                    {t('orders.sendToKitchen')}
                </Button>
            )}
            {status === 'in_kitchen' && (
                <Button onClick={() => onStatusChange('ready')}>
                    {t('orders.markReady')}
                </Button>
            )}
            {status === 'ready' && (
                <Button onClick={() => onStatusChange('served')}>
                    {t('orders.markServed')}
                </Button>
            )}
            {status === 'served' && (
                <Button onClick={() => onStatusChange('paid')}>
                    {t('orders.markPaid')}
                </Button>
            )}
            {(status === 'pending' || status === 'in_kitchen') && (
                <Button
                    variant="destructive"
                    onClick={() => onStatusChange('cancelled')}
                >
                    {t('orders.cancelOrder')}
                </Button>
            )}
        </div>
    );
}
