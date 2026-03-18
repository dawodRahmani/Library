import { useTranslation } from 'react-i18next';
import { Pause, Play, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { HeldOrder } from '../types';

function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }

interface PosHeldOrdersProps {
    open: boolean;
    onClose: () => void;
    heldOrders: HeldOrder[];
    onResume: (order: HeldOrder) => void;
    onDelete: (orderId: number) => void;
}

export function PosHeldOrders({ open, onClose, heldOrders, onResume, onDelete }: PosHeldOrdersProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pause className="size-5" />
                        {t('pos.heldOrders')}
                    </DialogTitle>
                </DialogHeader>

                {heldOrders.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                        <Pause className="size-10 mx-auto mb-2 opacity-30" />
                        <p>{t('pos.noHeldOrders')}</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                        {heldOrders.map((order) => {
                            const total = order.items.reduce(
                                (sum, item) => sum + item.food_item.price * item.quantity,
                                0,
                            );
                            return (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{order.label}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {order.items.length} {t('orders.itemCount')} — {formatPrice(total)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            size="sm"
                                            onClick={() => onResume(order)}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        >
                                            <Play className="size-3 me-1" />
                                            {t('pos.resumeOrder')}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => onDelete(order.id)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
