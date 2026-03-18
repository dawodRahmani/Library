import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { LedgerEntryType } from '@/data/mock-accounting';

type Filter = LedgerEntryType | 'all';

const FILTERS: Filter[] = ['all', 'income', 'expense', 'salary', 'inventory_purchase'];

interface Props {
    activeFilter: Filter;
    onFilterChange: (filter: Filter) => void;
    search: string;
    onSearchChange: (val: string) => void;
}

export function LedgerFilters({ activeFilter, onFilterChange, search, onSearchChange }: Props) {
    const { t } = useTranslation();

    const filterLabels: Record<Filter, string> = {
        all:                t('common.all'),
        income:             t('accounting.income'),
        expense:            t('accounting.expense'),
        salary:             t('accounting.salary'),
        inventory_purchase: t('accounting.inventoryPurchase'),
    };

    const filterColors: Record<Filter, string> = {
        all:                'border-gray-300 bg-white text-gray-700',
        income:             'border-emerald-300 bg-emerald-50 text-emerald-700',
        expense:            'border-red-300 bg-red-50 text-red-700',
        salary:             'border-orange-300 bg-orange-50 text-orange-700',
        inventory_purchase: 'border-blue-300 bg-blue-50 text-blue-700',
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1" style={{ minWidth: '200px' }}>
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    className="ps-9"
                    placeholder={t('accounting.searchPlaceholder')}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                    <Button
                        key={f}
                        size="sm"
                        variant="outline"
                        className={`${filterColors[f]} ${activeFilter === f ? 'ring-2 ring-offset-1' : ''}`}
                        onClick={() => onFilterChange(f)}
                    >
                        {filterLabels[f]}
                    </Button>
                ))}
            </div>
        </div>
    );
}
