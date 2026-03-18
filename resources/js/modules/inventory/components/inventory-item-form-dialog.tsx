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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { inventoryCategories } from '../data/mock-inventory';
import type { InventoryItem, InventoryItemFormData, InventoryUnit } from '../types';

interface InventoryItemFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: InventoryItemFormData) => void;
    item?: InventoryItem | null;
}

const units: InventoryUnit[] = ['kg', 'liter', 'piece', 'box', 'bag'];

const defaultForm: InventoryItemFormData = {
    name: '',
    unit: '',
    cost_per_unit: '',
    current_stock: '',
    min_stock_level: '',
    category: '',
};

export function InventoryItemFormDialog({ open, onClose, onSubmit, item }: InventoryItemFormDialogProps) {
    const { t } = useTranslation();
    const [form, setForm] = useState<InventoryItemFormData>(defaultForm);

    useEffect(() => {
        if (item) {
            setForm({
                name: item.name,
                unit: item.unit,
                cost_per_unit: item.cost_per_unit,
                current_stock: item.current_stock,
                min_stock_level: item.min_stock_level,
                category: item.category,
            });
        } else {
            setForm(defaultForm);
        }
    }, [item, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {item ? t('inventory.editItem') : t('inventory.addItem')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="inv-name">{t('inventory.itemName')}</Label>
                        <Input
                            id="inv-name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t('inventory.unit')}</Label>
                            <Select
                                value={form.unit}
                                onValueChange={(v) => setForm({ ...form, unit: v as InventoryUnit })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('inventory.unit')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map((u) => (
                                        <SelectItem key={u} value={u}>
                                            {t(`inventory.units.${u}`)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>{t('inventory.category')}</Label>
                            <Select
                                value={form.category}
                                onValueChange={(v) => setForm({ ...form, category: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('inventory.category')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {inventoryCategories.map((c) => (
                                        <SelectItem key={c.value} value={c.value}>
                                            {t(`inventory.categories.${c.value}`)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="inv-cost">{t('inventory.costPerUnit')}</Label>
                        <Input
                            id="inv-cost"
                            type="number"
                            min={0}
                            value={form.cost_per_unit}
                            onChange={(e) => setForm({ ...form, cost_per_unit: Number(e.target.value) || '' })}
                            dir="ltr"
                            className="text-left"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="inv-stock">{t('inventory.currentStock')}</Label>
                            <Input
                                id="inv-stock"
                                type="number"
                                min={0}
                                value={form.current_stock}
                                onChange={(e) => setForm({ ...form, current_stock: Number(e.target.value) || '' })}
                                dir="ltr"
                                className="text-left"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="inv-min">{t('inventory.minStockLevel')}</Label>
                            <Input
                                id="inv-min"
                                type="number"
                                min={0}
                                value={form.min_stock_level}
                                onChange={(e) => setForm({ ...form, min_stock_level: Number(e.target.value) || '' })}
                                dir="ltr"
                                className="text-left"
                                required
                            />
                        </div>
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
