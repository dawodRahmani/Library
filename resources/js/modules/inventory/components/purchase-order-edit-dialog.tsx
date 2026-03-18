import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ShamsiDateInput } from '@/components/ui/shamsi-date-input';
import type { PurchaseOrder, PurchaseOrderStatus } from '../types';

interface PurchaseOrderEditDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (id: number, data: { status: PurchaseOrderStatus; expected_delivery: string; notes: string }) => void;
    order: PurchaseOrder | null;
}

export function PurchaseOrderEditDialog({ open, onClose, onSubmit, order }: PurchaseOrderEditDialogProps) {
    const { t } = useTranslation();

    const [status, setStatus] = useState<PurchaseOrderStatus>('draft');
    const [expectedDelivery, setExpectedDelivery] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (open && order) {
            setStatus(order.status);
            setExpectedDelivery(order.expected_delivery ?? '');
            setNotes(order.notes || '');
        }
    }, [open, order]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!order) return;
        onSubmit(order.id, { status, expected_delivery: expectedDelivery, notes });
    };

    const statusOptions: { value: PurchaseOrderStatus; label: string }[] = [
        { value: 'draft', label: t('inventory.poStatus.draft') },
        { value: 'ordered', label: t('inventory.poStatus.ordered') },
        { value: 'cancelled', label: t('inventory.poStatus.cancelled') },
    ];

    if (!order) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{order.po_number}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Status */}
                    <div className="space-y-2">
                        <Label>{t('inventory.status')}</Label>
                        <Select value={status} onValueChange={(v) => setStatus(v as PurchaseOrderStatus)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Expected Delivery */}
                    <div className="space-y-2">
                        <Label>{t('inventory.expectedDelivery')}</Label>
                        <ShamsiDateInput
                            value={expectedDelivery}
                            onChange={setExpectedDelivery}
                            className="w-full h-10"
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label>{t('inventory.notes')}</Label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Order items summary (read-only) */}
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{t('inventory.orderItems')}</Label>
                        <div className="rounded-lg border bg-muted/30 p-3 space-y-1 text-sm">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span>{item.inventory_item_name}</span>
                                    <span className="text-muted-foreground">
                                        {item.quantity} {t(`inventory.units.${item.unit}`)} × {item.unit_cost.toLocaleString()} ؋
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit">
                            {t('common.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
