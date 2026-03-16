import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type FilterPeriod = 'today' | 'week' | 'month' | 'custom';

interface ReportFiltersProps {
    activeFilter: FilterPeriod;
    onFilterChange: (filter: FilterPeriod) => void;
}

export function ReportFilters({ activeFilter, onFilterChange }: ReportFiltersProps) {
    const { t } = useTranslation();

    const filters: { key: FilterPeriod; label: string }[] = [
        { key: 'today', label: t('reports.filterToday') },
        { key: 'week', label: t('reports.filterThisWeek') },
        { key: 'month', label: t('reports.filterThisMonth') },
        { key: 'custom', label: t('reports.filterCustom') },
    ];

    return (
        <div className="flex items-center gap-2">
            {filters.map((filter) => (
                <Button
                    key={filter.key}
                    variant={activeFilter === filter.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFilterChange(filter.key)}
                    className={cn(
                        activeFilter === filter.key && 'shadow-sm',
                    )}
                >
                    {filter.label}
                </Button>
            ))}
        </div>
    );
}
