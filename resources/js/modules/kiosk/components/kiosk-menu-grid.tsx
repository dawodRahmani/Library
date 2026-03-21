import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FoodImage } from '@/components/food-image';
import { cn } from '@/lib/utils';

function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }
import type { FoodItem } from '@/types/models';

interface KioskMenuGridProps {
    items: FoodItem[];
    onAddItem: (item: FoodItem) => void;
}

export function KioskMenuGrid({ items, onAddItem }: KioskMenuGridProps) {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            {items.map((item) => (
                <Card
                    key={item.id}
                    className={cn(
                        'overflow-hidden transition-all cursor-pointer group',
                        item.is_available
                            ? 'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                            : 'opacity-50 cursor-not-allowed',
                    )}
                    onClick={() => item.is_available && onAddItem(item)}
                >
                    {/* Food image */}
                    <div className="relative">
                        <FoodImage src={item.image} alt={item.name} size="lg" />
                        {!item.is_available && (
                            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                                <Badge variant="secondary" className="text-sm">
                                    {t('kiosk.unavailable')}
                                </Badge>
                            </div>
                        )}
                        {item.is_available && (
                            <div className="absolute bottom-2 end-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    size="sm"
                                    className="rounded-full size-10 p-0 shadow-lg"
                                >
                                    <Plus className="size-5" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.category.name}</p>
                        <p className="text-xl font-bold text-primary mt-2">{formatPrice(item.price)}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
