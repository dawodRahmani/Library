import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RestaurantTable } from '@/data/mock/types';

interface AddTableModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    table?: RestaurantTable;
}

export function AddTableModal({ open, onOpenChange, table }: AddTableModalProps) {
    const { t } = useTranslation();
    const isEditing = !!table;

    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');

    useEffect(() => {
        if (open) {
            if (table) {
                setNumber(String(table.number));
                setName(table.name || '');
                setCapacity(String(table.capacity));
            } else {
                setNumber('');
                setName('');
                setCapacity('');
            }
        }
    }, [open, table]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Send to backend via Inertia
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? t('tables.editTable') : t('tables.addTable')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? t('tables.editTableDesc') : t('tables.addTableDesc')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="table-number">{t('tables.tableNumber')}</Label>
                        <Input
                            id="table-number"
                            type="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            required
                            min={1}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="table-name">{t('tables.tableName')}</Label>
                        <Input
                            id="table-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('tables.tableNamePlaceholder')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="table-capacity">{t('tables.capacityLabel')}</Label>
                        <Input
                            id="table-capacity"
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            required
                            min={1}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            {isEditing ? t('common.save') : t('tables.addTable')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
