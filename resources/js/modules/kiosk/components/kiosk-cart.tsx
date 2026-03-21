import { useTranslation } from 'react-i18next';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FoodItem } from '@/types/models';

function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }

export interface CartItem {
    item: FoodItem;
    quantity: number;
}

interface KioskCartProps {
    items: CartItem[];
    onIncrease: (itemId: number) => void;
    onDecrease: (itemId: number) => void;
    onRemove: (itemId: number) => void;
    onSubmit: () => void;
    selectedTable: number | null;
}

export function KioskCart({ items, onIncrease, onDecrease, onRemove, onSubmit, selectedTable }: KioskCartProps) {
    const { t } = useTranslation();

    const totalAmount = items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
    const totalItems = items.reduce((sum, ci) => sum + ci.quantity, 0);

    return (
        <div className="flex flex-col h-full bg-card border-s">
            {/* Cart header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b">
                <ShoppingCart className="size-6 text-primary" />
                <div>
                    <h2 className="text-lg font-bold">{t('kiosk.cart')}</h2>
                    <p className="text-xs text-muted-foreground">
                        {totalItems} {t('kiosk.itemCount')}
                    </p>
                </div>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <ShoppingCart className="size-16 mb-3 opacity-20" />
                        <p className="text-lg font-medium">{t('kiosk.emptyCart')}</p>
                        <p className="text-sm mt-1">{t('kiosk.emptyCartHint')}</p>
                    </div>
                ) : (
                    items.map((ci) => (
                        <div key={ci.item.id} className="flex items-center gap-3 rounded-xl border p-3">
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{ci.item.name}</p>
                                <p className="text-sm text-primary font-bold">
                                    {formatPrice(ci.item.price * ci.quantity)}
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="size-9 p-0 rounded-full"
                                    onClick={() => onDecrease(ci.item.id)}
                                >
                                    <Minus className="size-4" />
                                </Button>
                                <span className="w-8 text-center font-bold text-lg">{ci.quantity}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="size-9 p-0 rounded-full"
                                    onClick={() => onIncrease(ci.item.id)}
                                >
                                    <Plus className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="size-9 p-0 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                    onClick={() => onRemove(ci.item.id)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Cart footer */}
            {items.length > 0 && (
                <div className="border-t px-5 py-4 space-y-3">
                    {/* Total */}
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">{t('kiosk.totalAmount')}</span>
                        <span className="text-2xl font-black text-primary">{formatPrice(totalAmount)}</span>
                    </div>

                    {/* Table indicator */}
                    {selectedTable && (
                        <div className="text-center text-sm text-muted-foreground">
                            {t('kiosk.table')} {selectedTable}
                        </div>
                    )}

                    {/* Submit button */}
                    <Button
                        className="w-full h-14 text-xl font-bold rounded-xl shadow-lg"
                        disabled={!selectedTable}
                        onClick={onSubmit}
                    >
                        {!selectedTable ? t('kiosk.noTableSelected') : t('kiosk.confirmOrder')}
                    </Button>
                </div>
            )}
        </div>
    );
}
