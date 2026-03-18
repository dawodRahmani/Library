import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FoodImage } from '@/components/food-image';
import type { FoodItem, Category } from '@/data/mock/types';

function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }

interface FoodSelectorProps {
    items: FoodItem[];
    categories: Category[];
    onAddItem: (item: FoodItem) => void;
}

export function FoodSelector({ items, categories, onAddItem }: FoodSelectorProps) {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState<number | null>(null);

    const availableItems = items.filter((item) => item.is_available);

    const filteredItems = activeCategory
        ? availableItems.filter((item) => item.category_id === activeCategory)
        : availableItems;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
                <Badge
                    variant={activeCategory === null ? 'default' : 'outline'}
                    className="cursor-pointer select-none px-3 py-1 text-sm transition-colors"
                    onClick={() => setActiveCategory(null)}
                >
                    {t('orders.allCategories')}
                </Badge>
                {categories.map((category) => (
                    <Badge
                        key={category.id}
                        variant={activeCategory === category.id ? 'default' : 'outline'}
                        className={cn(
                            'cursor-pointer select-none px-3 py-1 text-sm transition-colors',
                            activeCategory !== category.id &&
                                'hover:bg-accent hover:text-accent-foreground',
                        )}
                        onClick={() => setActiveCategory(category.id)}
                    >
                        {category.name}
                    </Badge>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {filteredItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-md gap-0 py-0">
                        <FoodImage src={item.image} alt={item.name} size="md" />
                        <CardContent className="flex flex-col gap-2 p-3">
                            <div className="flex items-start justify-between gap-2">
                                <span className="font-medium text-sm">{item.name}</span>
                                <Badge variant="secondary" className="shrink-0 text-xs">
                                    {item.category.name}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-bold">
                                    {formatPrice(item.price)}
                                </span>
                                <Button size="sm" onClick={() => onAddItem(item)}>
                                    <Plus className="me-1 size-3" />
                                    {t('orders.add')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {filteredItems.length === 0 && (
                    <div className="text-muted-foreground col-span-full py-8 text-center">
                        {t('orders.noItemsAvailable')}
                    </div>
                )}
            </div>
        </div>
    );
}
