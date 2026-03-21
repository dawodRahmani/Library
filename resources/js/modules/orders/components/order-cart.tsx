import { useTranslation } from 'react-i18next';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { FoodItem } from '@/types/models';

function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }

interface CartItem {
    food_item: FoodItem;
    quantity: number;
    notes?: string;
}

interface OrderCartProps {
    cartItems: CartItem[];
    onUpdateQuantity: (foodItemId: number, qty: number) => void;
    onRemoveItem: (foodItemId: number) => void;
    onUpdateNotes: (foodItemId: number, notes: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
    selectedTable: number | null;
    orderType?: 'dine_in' | 'takeaway' | 'delivery';
}

export function OrderCart({
    cartItems,
    onUpdateQuantity,
    onRemoveItem,
    onUpdateNotes,
    onSubmit,
    onCancel,
    selectedTable,
    orderType = 'dine_in',
}: OrderCartProps) {
    const { t } = useTranslation();

    const total = cartItems.reduce(
        (sum, item) => sum + item.food_item.price * item.quantity,
        0,
    );

    return (
        <Card className="flex max-h-[calc(100vh-10rem)] flex-col">
            <CardHeader>
                <CardTitle>{t('orders.cart')}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
                {cartItems.length === 0 ? (
                    <div className="text-muted-foreground py-8 text-center text-sm">
                        {t('orders.emptyCart')}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {cartItems.map((item) => (
                            <div key={item.food_item.id} className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-medium">{item.food_item.name}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive size-8 p-0"
                                        onClick={() => onRemoveItem(item.food_item.id)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="size-7 p-0"
                                            onClick={() =>
                                                onUpdateQuantity(
                                                    item.food_item.id,
                                                    item.quantity - 1,
                                                )
                                            }
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="size-3" />
                                        </Button>
                                        <span className="w-8 text-center text-sm">
                                            {item.quantity}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="size-7 p-0"
                                            onClick={() =>
                                                onUpdateQuantity(
                                                    item.food_item.id,
                                                    item.quantity + 1,
                                                )
                                            }
                                        >
                                            <Plus className="size-3" />
                                        </Button>
                                    </div>
                                    <div className="text-muted-foreground flex gap-2 text-sm">
                                        <span>{formatPrice(item.food_item.price)}</span>
                                        <span>x</span>
                                        <span className="font-medium text-foreground">
                                            {formatPrice(item.food_item.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                                <Input
                                    placeholder={t('orders.itemNotes')}
                                    value={item.notes || ''}
                                    onChange={(e) =>
                                        onUpdateNotes(item.food_item.id, e.target.value)
                                    }
                                    className="text-sm"
                                />
                                <Separator />
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t pt-4">
                <div className="flex w-full items-center justify-between text-lg font-bold">
                    <span>{t('orders.total')}</span>
                    <span>{formatPrice(total)}</span>
                </div>
                <div className="flex w-full gap-2">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onCancel}
                    >
                        {t('orders.cancel')}
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={onSubmit}
                        disabled={cartItems.length === 0 || (orderType === 'dine_in' && selectedTable === null)}
                    >
                        {t('orders.submitOrder')}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
