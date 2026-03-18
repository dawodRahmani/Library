import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { ShamsiDateInput } from '@/components/ui/shamsi-date-input';
import type { PurchaseOrderFormData } from '../types';

interface SupplierOption {
    id: number;
    name: string;
}

interface ItemOption {
    id: number;
    name: string;
    unit: string;
    cost_per_unit: number;
}

interface PurchaseOrderFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: PurchaseOrderFormData) => void;
    suppliers: SupplierOption[];
    inventoryItems: ItemOption[];
}

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

const emptyRow = { inventory_item_id: '' as const, quantity: '' as const, unit_cost: '' as const };

export function PurchaseOrderFormDialog({
    open,
    onClose,
    onSubmit,
    suppliers,
    inventoryItems,
}: PurchaseOrderFormDialogProps) {
    const { t } = useTranslation();

    const todayIso = new Date().toISOString().slice(0, 10);

    const [form, setForm] = useState<PurchaseOrderFormData>({
        supplier_id: '',
        order_date: todayIso,
        expected_delivery: '',
        notes: '',
        items: [{ ...emptyRow }],
    });

    useEffect(() => {
        if (open) {
            setForm({
                supplier_id: '',
                order_date: new Date().toISOString().slice(0, 10),
                expected_delivery: '',
                notes: '',
                items: [{ ...emptyRow }],
            });
        }
    }, [open]);

    const updateItem = (index: number, field: string, value: string | number) => {
        setForm((prev) => ({
            ...prev,
            items: prev.items.map((item, i) =>
                i === index ? { ...item, [field]: value } : item,
            ),
        }));
    };

    const addRow = () => {
        setForm((prev) => ({
            ...prev,
            items: [...prev.items, { ...emptyRow }],
        }));
    };

    const removeRow = (index: number) => {
        if (form.items.length <= 1) return;
        setForm((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    // Auto-fill unit cost when item is selected
    const handleItemSelect = (index: number, itemId: string) => {
        const invItem = inventoryItems.find((i) => i.id === Number(itemId));
        updateItem(index, 'inventory_item_id', Number(itemId));
        if (invItem) {
            updateItem(index, 'unit_cost', invItem.cost_per_unit);
        }
    };

    const totalAmount = form.items.reduce((sum, item) => {
        const qty = Number(item.quantity) || 0;
        const cost = Number(item.unit_cost) || 0;
        return sum + qty * cost;
    }, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('inventory.newPurchaseOrder')}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Supplier + Order Date + Expected Delivery */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>{t('inventory.supplier')}</Label>
                            <SearchableSelect
                                options={suppliers.map((s) => ({
                                    value: String(s.id),
                                    label: s.name,
                                }))}
                                value={form.supplier_id ? String(form.supplier_id) : ''}
                                onValueChange={(v) => setForm({ ...form, supplier_id: Number(v) })}
                                placeholder={t('inventory.supplier')}
                                searchPlaceholder={t('common.search')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('inventory.orderDate')}</Label>
                            <ShamsiDateInput
                                value={form.order_date}
                                onChange={(v) => setForm({ ...form, order_date: v })}
                                className="w-full h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('inventory.expectedDelivery')}</Label>
                            <ShamsiDateInput
                                value={form.expected_delivery}
                                onChange={(v) => setForm({ ...form, expected_delivery: v })}
                                className="w-full h-10"
                            />
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">{t('inventory.orderItems')}</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addRow}>
                                <Plus className="size-4 me-1" />
                                {t('common.add')}
                            </Button>
                        </div>

                        {form.items.map((item, index) => (
                            <div key={index} className="flex items-end gap-2 rounded-lg border p-3">
                                {/* Item selector */}
                                <div className="flex-1 space-y-1">
                                    <Label className="text-xs">{t('inventory.selectItem')}</Label>
                                    <SearchableSelect
                                        options={inventoryItems.map((i) => ({
                                            value: String(i.id),
                                            label: `${i.name} (${t(`inventory.units.${i.unit}`)})`,
                                        }))}
                                        value={item.inventory_item_id ? String(item.inventory_item_id) : ''}
                                        onValueChange={(v) => handleItemSelect(index, v)}
                                        placeholder={t('inventory.selectItem')}
                                        searchPlaceholder={t('common.search')}
                                    />
                                </div>

                                {/* Quantity */}
                                <div className="w-24 space-y-1">
                                    <Label className="text-xs">{t('inventory.quantity')}</Label>
                                    <Input
                                        type="number"
                                        min={0.1}
                                        step={0.1}
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value) || '')}
                                        dir="ltr"
                                        className="text-left h-10"
                                        required
                                    />
                                </div>

                                {/* Unit Cost */}
                                <div className="w-28 space-y-1">
                                    <Label className="text-xs">{t('inventory.costPerUnit')}</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={item.unit_cost}
                                        onChange={(e) => updateItem(index, 'unit_cost', Number(e.target.value) || '')}
                                        dir="ltr"
                                        className="text-left h-10"
                                        required
                                    />
                                </div>

                                {/* Remove */}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0 h-10 w-10 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                    onClick={() => removeRow(index)}
                                    disabled={form.items.length <= 1}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        ))}

                        {/* Total */}
                        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2">
                            <span className="font-semibold">{t('inventory.totalAmount')}</span>
                            <span className="text-lg font-bold text-primary">{formatPrice(totalAmount)}</span>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label>{t('inventory.notes')}</Label>
                        <Textarea
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            rows={2}
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={!form.supplier_id || form.items.every((i) => !i.inventory_item_id)}>
                            {t('common.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
