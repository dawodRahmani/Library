import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { FoodImage } from '@/components/food-image';
import type { FoodItem, Category } from '@/types/models';

function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }

interface PosMenuGridProps {
    items: FoodItem[];
    categories: Category[];
    onAddItem: (item: FoodItem) => void;
}

export function PosMenuGrid({ items, categories, onAddItem }: PosMenuGridProps) {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState<number | null>(null);

    const availableItems = items.filter((item) => item.is_available);
    const filteredItems = activeCategory
        ? availableItems.filter((item) => item.category_id === activeCategory)
        : availableItems;

    return (
        <div className="flex h-full flex-col gap-3">
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={cn(
                        'shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium transition-all',
                        activeCategory === null
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                            : 'bg-card border border-border hover:bg-muted',
                    )}
                >
                    {t('orders.allCategories')}
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                            'shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium transition-all',
                            activeCategory === cat.id
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                                : 'bg-card border border-border hover:bg-muted',
                        )}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Food items grid — large touch-friendly cards */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {filteredItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onAddItem(item)}
                            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-primary/30 active:scale-[0.97]"
                        >
                            <FoodImage src={item.image} alt={item.name} size="md" />
                            <div className="px-3 pb-3 text-center">
                                <span className="text-sm font-semibold leading-tight">{item.name}</span>
                                <p className="text-sm font-bold text-primary mt-1">
                                    {formatPrice(item.price)}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
                {filteredItems.length === 0 && (
                    <div className="flex items-center justify-center py-16 text-muted-foreground">
                        {t('orders.noItemsAvailable')}
                    </div>
                )}
            </div>
        </div>
    );
}
