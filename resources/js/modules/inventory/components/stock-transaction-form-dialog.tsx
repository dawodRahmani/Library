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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import type { StockTransactionFormData, TransactionType } from '../types';

interface ItemOption {
    id: number;
    name: string;
    unit: string;
}

interface StockTransactionFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: StockTransactionFormData) => void;
    items?: ItemOption[];
}

const transactionTypes: TransactionType[] = ['stock_in', 'stock_out', 'waste', 'adjustment'];
const typeLabelKeys: Record<TransactionType, string> = {
    stock_in: 'stockIn',
    stock_out: 'stockOut',
    waste: 'waste',
    adjustment: 'adjustment',
};

const defaultForm: StockTransactionFormData = {
    inventory_item_id: '',
    type: '',
    quantity: '',
    cost_per_unit: '',
    notes: '',
};

export function StockTransactionFormDialog({ open, onClose, onSubmit, items = [] }: StockTransactionFormDialogProps) {
    const { t } = useTranslation();
    const [form, setForm] = useState<StockTransactionFormData>(defaultForm);

    useEffect(() => {
        if (open) setForm(defaultForm);
    }, [open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    const activeItems = items;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('inventory.addTransaction')}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>{t('inventory.selectItem')}</Label>
                        <SearchableSelect
                            options={activeItems.map((item) => ({
                                value: String(item.id),
                                label: `${item.name} (${t(`inventory.units.${item.unit}`)})`,
                            }))}
                            value={form.inventory_item_id ? String(form.inventory_item_id) : ''}
                            onValueChange={(v) => setForm({ ...form, inventory_item_id: Number(v) })}
                            placeholder={t('inventory.selectItem')}
                            searchPlaceholder={t('common.search')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>{t('inventory.selectType')}</Label>
                        <Select
                            value={form.type}
                            onValueChange={(v) => setForm({ ...form, type: v as TransactionType })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('inventory.selectType')} />
                            </SelectTrigger>
                            <SelectContent>
                                {transactionTypes.map((tt) => (
                                    <SelectItem key={tt} value={tt}>
                                        {t(`inventory.${typeLabelKeys[tt]}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="tx-qty">{t('inventory.quantity')}</Label>
                            <Input
                                id="tx-qty"
                                type="number"
                                min={0}
                                step={0.1}
                                value={form.quantity}
                                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) || '' })}
                                dir="ltr"
                                className="text-left"
                                required
                            />
                        </div>

                        {form.type === 'stock_in' && (
                            <div className="space-y-2">
                                <Label htmlFor="tx-cost">{t('inventory.costPerUnit')}</Label>
                                <Input
                                    id="tx-cost"
                                    type="number"
                                    min={0}
                                    value={form.cost_per_unit}
                                    onChange={(e) => setForm({ ...form, cost_per_unit: Number(e.target.value) || '' })}
                                    dir="ltr"
                                    className="text-left"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tx-notes">{t('inventory.notes')}</Label>
                        <Textarea
                            id="tx-notes"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            rows={2}
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {t('common.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
