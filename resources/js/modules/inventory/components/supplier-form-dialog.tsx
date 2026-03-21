import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Supplier, SupplierFormData, InventoryCategoryItem } from '../types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    supplier?: Supplier | null;
    onSave: (data: SupplierFormData) => void;
    categories: InventoryCategoryItem[];
}

const empty: SupplierFormData = {
    name: '',
    contact_name: '',
    phone: '',
    address: '',
    category: '',
    notes: '',
};

export function SupplierFormDialog({ open, onOpenChange, supplier, onSave, categories }: Props) {
    const { t } = useTranslation();
    const [form, setForm] = useState<SupplierFormData>(empty);

    useEffect(() => {
        if (supplier) {
            setForm({
                name: supplier.name,
                contact_name: supplier.contact_name,
                phone: supplier.phone,
                address: supplier.address ?? '',
                category: supplier.category,
                notes: supplier.notes ?? '',
            });
        } else {
            setForm(empty);
        }
    }, [supplier, open]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSave(form);
        onOpenChange(false);
    }

    const isEdit = !!supplier;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? t('inventory.editSupplier') : t('inventory.addSupplier')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="sup-name">{t('inventory.supplierName')} *</Label>
                        <Input
                            id="sup-name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="sup-contact">{t('inventory.contactName')}</Label>
                        <Input
                            id="sup-contact"
                            value={form.contact_name}
                            onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="sup-phone">{t('inventory.phone')} *</Label>
                        <Input
                            id="sup-phone"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="sup-category">{t('inventory.category')} *</Label>
                        <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                            <SelectTrigger id="sup-category">
                                <SelectValue placeholder={t('inventory.selectCategory')} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.slug}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="sup-address">{t('inventory.address')}</Label>
                        <Input
                            id="sup-address"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="sup-notes">{t('inventory.notes')}</Label>
                        <Textarea
                            id="sup-notes"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            rows={2}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit">{t('common.save')}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
