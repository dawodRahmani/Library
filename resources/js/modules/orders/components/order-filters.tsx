import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types/models';

type FilterValue = OrderStatus | 'all';

interface OrderFiltersProps {
    activeFilter: FilterValue;
    onFilterChange: (filter: FilterValue) => void;
}

const filters: { value: FilterValue; translationKey: string }[] = [
    { value: 'all', translationKey: 'orders.filterAll' },
    { value: 'pending', translationKey: 'orders.statusPending' },
    { value: 'in_kitchen', translationKey: 'orders.statusInKitchen' },
    { value: 'ready', translationKey: 'orders.statusReady' },
    { value: 'served', translationKey: 'orders.statusServed' },
    { value: 'paid', translationKey: 'orders.statusPaid' },
    { value: 'cancelled', translationKey: 'orders.statusCancelled' },
];

export function OrderFilters({ activeFilter, onFilterChange }: OrderFiltersProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
                <Badge
                    key={filter.value}
                    variant={activeFilter === filter.value ? 'default' : 'outline'}
                    className={cn(
                        'cursor-pointer select-none px-3 py-1 text-sm transition-colors',
                        activeFilter === filter.value
                            ? ''
                            : 'hover:bg-accent hover:text-accent-foreground',
                    )}
                    onClick={() => onFilterChange(filter.value)}
                >
                    {t(filter.translationKey)}
                </Badge>
            ))}
        </div>
    );
}
