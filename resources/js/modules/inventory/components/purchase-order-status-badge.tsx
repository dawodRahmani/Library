import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import type { PurchaseOrderStatus } from '../types';

const statusConfig: Record<PurchaseOrderStatus, { label: string; className: string }> = {
    draft:     { label: 'inventory.poStatus.draft',     className: 'bg-gray-100 text-gray-700 border-gray-200' },
    ordered:   { label: 'inventory.poStatus.ordered',   className: 'bg-blue-100 text-blue-700 border-blue-200' },
    arrived:   { label: 'inventory.poStatus.arrived',   className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    cancelled: { label: 'inventory.poStatus.cancelled', className: 'bg-red-100 text-red-700 border-red-200' },
};

export function PurchaseOrderStatusBadge({ status }: { status: PurchaseOrderStatus }) {
    const { t } = useTranslation();
    const config = statusConfig[status];
    return (
        <Badge variant="outline" className={config.className}>
            {t(config.label)}
        </Badge>
    );
}
