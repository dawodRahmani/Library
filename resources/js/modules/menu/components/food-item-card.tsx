import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FoodImage } from '@/components/food-image';
import type { FoodItem } from '@/types/models';

function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }
import { Pencil, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FoodItemCardProps {
    item: FoodItem;
    onEdit: (item: FoodItem) => void;
    onToggleAvailability: (id: number) => void;
}

export function FoodItemCard({ item, onEdit, onToggleAvailability }: FoodItemCardProps) {
    const { t } = useTranslation();

    return (
        <Card className="gap-0 py-0 overflow-hidden">
            <FoodImage src={item.image} alt={item.name} size="md" />
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                        <p className="text-muted-foreground text-xs mt-1">{item.category.name}</p>
                    </div>
                    <Badge
                        className={cn(
                            item.is_available
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                            'border-transparent',
                        )}
                    >
                        {item.is_available ? t('menu.available') : t('menu.unavailable')}
                    </Badge>
                </div>

                <p className="text-lg font-bold mt-3">{formatPrice(item.price)}</p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <button
                        type="button"
                        onClick={() => onToggleAvailability(item.id)}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {item.is_available ? (
                            <ToggleRight className="size-5 text-green-600" />
                        ) : (
                            <ToggleLeft className="size-5 text-muted-foreground" />
                        )}
                        <span className="text-xs">{t('menu.toggleAvailability')}</span>
                    </button>

                    <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                        <Pencil className="size-4" />
                        {t('common.edit')}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
