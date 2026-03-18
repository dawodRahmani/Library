import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { inventoryCategories } from '../data/mock-inventory';

interface InventoryItemFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    categoryFilter: string;
    onCategoryFilterChange: (value: string) => void;
}

export function InventoryItemFilters({
    search,
    onSearchChange,
    categoryFilter,
    onCategoryFilterChange,
}: InventoryItemFiltersProps) {
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
                    variant={categoryFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onCategoryFilterChange('all')}
                    className={categoryFilter === 'all' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                >
                    {t('inventory.allCategories')}
                </Button>
                {inventoryCategories.map((cat) => (
                    <Button
                        key={cat.value}
                        variant={categoryFilter === cat.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onCategoryFilterChange(cat.value)}
                        className={categoryFilter === cat.value ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                    >
                        {t(`inventory.categories.${cat.value}`)}
                    </Button>
                ))}
            </div>
        </div>
    );
}
