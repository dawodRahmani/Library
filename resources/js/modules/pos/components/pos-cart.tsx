import { useTranslation } from 'react-i18next';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PosCartItem } from '../types';

function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }

interface PosCartProps {
    items: PosCartItem[];
    onUpdateQuantity: (foodItemId: number, qty: number) => void;
    onRemoveItem: (foodItemId: number) => void;
}

export function PosCart({ items, onUpdateQuantity, onRemoveItem }: PosCartProps) {
    const { t } = useTranslation();

    if (items.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
                <ShoppingCart className="size-12 mb-3 opacity-30" />
                <p className="font-medium">{t('pos.emptyCart')}</p>
                <p className="text-sm">{t('pos.addItems')}</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-1">
                {items.map((item, idx) => (
                    <div
                        key={item.food_item.id}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors"
                    >
                        {/* Index */}
                        <span className="text-xs text-muted-foreground w-5 text-center">{idx + 1}</span>

                        {/* Name + price */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.food_item.name}</p>
                            <p className="text-xs text-muted-foreground">{formatPrice(item.food_item.price)}</p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="size-7 p-0"
                                onClick={() => onUpdateQuantity(item.food_item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                            >
                                <Minus className="size-3" />
                            </Button>
                            <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                className="size-7 p-0"
                                onClick={() => onUpdateQuantity(item.food_item.id, item.quantity + 1)}
                            >
                                <Plus className="size-3" />
                            </Button>
                        </div>

                        {/* Line total */}
                        <span className="text-sm font-semibold w-20 text-start">
                            {formatPrice(item.food_item.price * item.quantity)}
                        </span>

                        {/* Remove */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="size-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => onRemoveItem(item.food_item.id)}
                        >
                            <Trash2 className="size-3.5" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
