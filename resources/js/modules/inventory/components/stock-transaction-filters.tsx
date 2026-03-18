import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { TransactionType } from '../types';

interface StockTransactionFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    typeFilter: string;
    onTypeFilterChange: (value: string) => void;
}

const transactionTypes: { value: TransactionType; labelKey: string }[] = [
    { value: 'stock_in', labelKey: 'stockIn' },
    { value: 'stock_out', labelKey: 'stockOut' },
    { value: 'waste', labelKey: 'waste' },
    { value: 'adjustment', labelKey: 'adjustment' },
];

export function StockTransactionFilters({
    search,
    onSearchChange,
    typeFilter,
    onTypeFilterChange,
}: StockTransactionFiltersProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    placeholder={t('inventory.searchPlaceholder')}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="ps-10 h-10"
                />
            </div>
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={typeFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onTypeFilterChange('all')}
                    className={typeFilter === 'all' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                >
                    {t('inventory.allTypes')}
                </Button>
                {transactionTypes.map((tt) => (
                    <Button
                        key={tt.value}
                        variant={typeFilter === tt.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onTypeFilterChange(tt.value)}
                        className={typeFilter === tt.value ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                    >
                        {t(`inventory.${tt.labelKey}`)}
                    </Button>
                ))}
            </div>
        </div>
    );
}
