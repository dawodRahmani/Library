import { useTranslation } from 'react-i18next';
import { TrendingUp, Receipt, Users, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { LedgerEntryType } from '@/data/mock-accounting';

const config: Record<LedgerEntryType, { labelKey: string; className: string; Icon: React.ElementType }> = {
    income:             { labelKey: 'accounting.income',           className: 'bg-emerald-100 text-emerald-700 border-emerald-200', Icon: TrendingUp },
    expense:            { labelKey: 'accounting.expense',          className: 'bg-red-100 text-red-700 border-red-200',             Icon: Receipt },
    salary:             { labelKey: 'accounting.salary',           className: 'bg-orange-100 text-orange-700 border-orange-200',    Icon: Users },
    inventory_purchase: { labelKey: 'accounting.inventoryPurchase',className: 'bg-blue-100 text-blue-700 border-blue-200',          Icon: Package },
};

export function LedgerEntryBadge({ type }: { type: LedgerEntryType }) {
    const { t } = useTranslation();
    const { labelKey, className, Icon } = config[type];
    return (
        <Badge variant="outline" className={`inline-flex items-center gap-1 ${className}`}>
            <Icon className="h-3 w-3" />
            {t(labelKey)}
        </Badge>
    );
}
