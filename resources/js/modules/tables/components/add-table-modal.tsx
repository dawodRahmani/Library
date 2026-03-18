import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { RestaurantTable, TableFloor } from '@/data/mock/types';

interface AddTableModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    table?: RestaurantTable;
    floors: TableFloor[];
}

export function AddTableModal({ open, onOpenChange, table, floors }: AddTableModalProps) {
    const { t } = useTranslation();
    const isEditing = !!table;

    const [floorId, setFloorId] = useState('');
    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (open) {
            if (table) {
                setFloorId(String(table.floor_id));
                setNumber(String(table.number));
                setName(table.name || '');
                setCapacity(String(table.capacity));
            } else {
                setFloorId(floors[0] ? String(floors[0].id) : '');
                setNumber('');
                setName('');
                setCapacity('');
            }
            setErrors({});
        }
    }, [open, table, floors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const data = {
            floor_id: Number(floorId),
            number: Number(number),
            name: name || null,
            capacity: Number(capacity),
        };

        if (isEditing) {
            router.patch(`/tables/${table.id}`, data, {
                onSuccess: () => onOpenChange(false),
                onError: (errs) => setErrors(errs),
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post('/tables', data, {
                onSuccess: () => onOpenChange(false),
                onError: (errs) => setErrors(errs),
                onFinish: () => setProcessing(false),
            });
        }
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
                    {/* Floor */}
                    <div className="space-y-2">
                        <Label>{t('tables.floor')}</Label>
                        <Select value={floorId} onValueChange={setFloorId} required>
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder={t('tables.selectFloor')} />
                            </SelectTrigger>
                            <SelectContent>
                                {floors.map((f) => (
                                    <SelectItem key={f.id} value={String(f.id)}>
                                        {f.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.floor_id && (
                            <p className="text-xs text-red-500">{errors.floor_id}</p>
                        )}
                    </div>

                    {/* Table Number */}
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
                        {errors.number && (
                            <p className="text-xs text-red-500">{errors.number}</p>
                        )}
                    </div>

                    {/* Table Name (optional) */}
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

                    {/* Capacity */}
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
                        {errors.capacity && (
                            <p className="text-xs text-red-500">{errors.capacity}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {processing && <Spinner className="me-2" />}
                            {isEditing ? t('common.save') : t('tables.addTable')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
