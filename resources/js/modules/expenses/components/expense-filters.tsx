import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { ExpenseCategory } from '../types';

interface ExpenseFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    categoryFilter: string;
    onCategoryFilterChange: (value: string) => void;
}

const categories: ExpenseCategory[] = ['groceries', 'rent', 'electricity', 'gas', 'supplies', 'other'];

export function ExpenseFilters({
    search,
    onSearchChange,
    categoryFilter,
    onCategoryFilterChange,
}: ExpenseFiltersProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    placeholder={t('expenses.searchPlaceholder')}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="ps-10 h-10 bg-card"
                />
            </div>

            <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
                <SelectTrigger className="h-10 w-full sm:w-[180px] bg-card">
                    <SelectValue placeholder={t('expenses.allCategories')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{t('expenses.allCategories')}</SelectItem>
                    {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                            {t(`expenses.categories.${cat}`)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
