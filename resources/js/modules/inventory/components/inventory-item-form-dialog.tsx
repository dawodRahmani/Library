import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import type { InventoryItem, InventoryItemFormData, InventoryCategoryItem, InventoryUnitItem } from '../types';

interface InventoryItemFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: InventoryItemFormData) => void;
    item?: InventoryItem | null;
    categories: InventoryCategoryItem[];
    units: InventoryUnitItem[];
}

const defaultForm: InventoryItemFormData = {
    name: '',
    inventory_unit_id: '',
    cost_per_unit: '',
    current_stock: '',
    min_stock_level: '',
    inventory_category_id: '',
};

export function InventoryItemFormDialog({ open, onClose, onSubmit, item, categories, units }: InventoryItemFormDialogProps) {
    const { t } = useTranslation();
    const isEditing = !!item;
    const [form, setForm] = useState<InventoryItemFormData>(defaultForm);

    // New category inline
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [savingCategory, setSavingCategory] = useState(false);

    // New unit inline
    const [showNewUnit, setShowNewUnit] = useState(false);
    const [newUnitName, setNewUnitName] = useState('');
    const [savingUnit, setSavingUnit] = useState(false);

    useEffect(() => {
        if (item) {
            setForm({
                name: item.name,
                inventory_unit_id: item.inventory_unit_id,
                cost_per_unit: item.cost_per_unit,
                current_stock: item.current_stock,
                min_stock_level: item.min_stock_level,
                inventory_category_id: item.inventory_category_id,
            });
        } else {
            setForm(defaultForm);
        }
        setShowNewCategory(false);
        setNewCategoryName('');
        setShowNewUnit(false);
        setNewUnitName('');
    }, [item, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        setSavingCategory(true);
        router.post('/inventory/categories', { name: newCategoryName.trim() }, {
            preserveScroll: true,
            onSuccess: () => { setNewCategoryName(''); setShowNewCategory(false); setSavingCategory(false); },
            onError: () => setSavingCategory(false),
        });
    };

    const handleAddUnit = () => {
        if (!newUnitName.trim()) return;
        setSavingUnit(true);
        router.post('/inventory/units', { name: newUnitName.trim() }, {
            preserveScroll: true,
            onSuccess: () => { setNewUnitName(''); setShowNewUnit(false); setSavingUnit(false); },
            onError: () => setSavingUnit(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        {isEditing ? t('inventory.editItem') : t('inventory.addItem')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? t('inventory.editItem') : t('inventory.addItem')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="inv-name" className="font-medium">{t('inventory.itemName')}</Label>
                        <Input
                            id="inv-name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            className="h-10"
                            placeholder={t('inventory.itemName')}
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label className="font-medium">{t('inventory.category')}</Label>
                        {!showNewCategory ? (
                            <div className="flex gap-2">
                                <Select
                                    value={form.inventory_category_id ? String(form.inventory_category_id) : ''}
                                    onValueChange={(v) => setForm({ ...form, inventory_category_id: Number(v) })}
                                >
                                    <SelectTrigger className="h-10 flex-1">
                                        <SelectValue placeholder={t('inventory.selectCategory')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    className="h-10 w-10 shrink-0"
                                    onClick={() => setShowNewCategory(true)}
                                    title={t('inventory.addCategory')}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Input
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder={t('inventory.newCategoryName')}
                                    className="h-10 flex-1"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); }
                                        if (e.key === 'Escape') setShowNewCategory(false);
                                    }}
                                />
                                <Button type="button" size="sm" className="h-10" onClick={handleAddCategory} disabled={savingCategory || !newCategoryName.trim()}>
                                    {savingCategory ? '...' : t('common.save')}
                                </Button>
                                <Button type="button" size="sm" variant="ghost" className="h-10" onClick={() => setShowNewCategory(false)}>
                                    {t('common.cancel')}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Unit */}
                    <div className="space-y-2">
                        <Label className="font-medium">{t('inventory.unit')}</Label>
                        {!showNewUnit ? (
                            <div className="flex gap-2">
                                <Select
                                    value={form.inventory_unit_id ? String(form.inventory_unit_id) : ''}
                                    onValueChange={(v) => setForm({ ...form, inventory_unit_id: Number(v) })}
                                >
                                    <SelectTrigger className="h-10 flex-1">
                                        <SelectValue placeholder={t('inventory.selectUnit')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)}>
                                                {u.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    className="h-10 w-10 shrink-0"
                                    onClick={() => setShowNewUnit(true)}
                                    title={t('inventory.addUnit')}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Input
                                    value={newUnitName}
                                    onChange={(e) => setNewUnitName(e.target.value)}
                                    placeholder={t('inventory.newUnitName')}
                                    className="h-10 flex-1"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') { e.preventDefault(); handleAddUnit(); }
                                        if (e.key === 'Escape') setShowNewUnit(false);
                                    }}
                                />
                                <Button type="button" size="sm" className="h-10" onClick={handleAddUnit} disabled={savingUnit || !newUnitName.trim()}>
                                    {savingUnit ? '...' : t('common.save')}
                                </Button>
                                <Button type="button" size="sm" variant="ghost" className="h-10" onClick={() => setShowNewUnit(false)}>
                                    {t('common.cancel')}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Cost per unit */}
                    <div className="space-y-2">
                        <Label htmlFor="inv-cost" className="font-medium">{t('inventory.costPerUnit')}</Label>
                        <Input
                            id="inv-cost"
                            type="number"
                            min={0}
                            value={form.cost_per_unit}
                            onChange={(e) => setForm({ ...form, cost_per_unit: Number(e.target.value) || '' })}
                            dir="ltr"
                            className="h-10 text-left"
                            placeholder="0"
                            required
                        />
                    </div>

                    {/* Stock row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="inv-stock" className="font-medium">{t('inventory.currentStock')}</Label>
                            <Input
                                id="inv-stock"
                                type="number"
                                min={0}
                                value={form.current_stock}
                                onChange={(e) => setForm({ ...form, current_stock: Number(e.target.value) || '' })}
                                dir="ltr"
                                className="h-10 text-left"
                                placeholder="0"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="inv-min" className="font-medium">{t('inventory.minStockLevel')}</Label>
                            <Input
                                id="inv-min"
                                type="number"
                                min={0}
                                value={form.min_stock_level}
                                onChange={(e) => setForm({ ...form, min_stock_level: Number(e.target.value) || '' })}
                                dir="ltr"
                                className="h-10 text-left"
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                            disabled={!form.inventory_category_id || !form.inventory_unit_id}
                        >
                            {t('common.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
