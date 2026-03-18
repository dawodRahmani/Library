import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { TableFloor } from '@/data/mock/types';

const COLORS = ['emerald', 'blue', 'amber', 'purple', 'red', 'gray'] as const;

const colorDot: Record<string, string> = {
    emerald: 'bg-emerald-500',
    blue:    'bg-blue-500',
    amber:   'bg-amber-500',
    purple:  'bg-purple-500',
    red:     'bg-red-500',
    gray:    'bg-gray-400',
};

interface FloorFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    floor?: TableFloor;
}

export function FloorFormDialog({ open, onOpenChange, floor }: FloorFormDialogProps) {
    const { t } = useTranslation();
    const isEditing = !!floor;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState<string>('emerald');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (open) {
            setName(floor?.name ?? '');
            setDescription(floor?.description ?? '');
            setColor(floor?.color ?? 'emerald');
            setErrors({});
        }
    }, [open, floor]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const data = { name, description: description || null, color };

        if (isEditing) {
            router.patch(`/floors/${floor.id}`, data, {
                onSuccess: () => onOpenChange(false),
                onError: (errs) => setErrors(errs),
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post('/floors', data, {
                onSuccess: () => onOpenChange(false),
                onError: (errs) => setErrors(errs),
                onFinish: () => setProcessing(false),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? t('tables.editFloor') : t('tables.addFloor')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="floor-name">{t('tables.floorName')}</Label>
                        <Input
                            id="floor-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder={t('tables.floorNamePlaceholder')}
                            className="h-10"
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="floor-desc">{t('tables.floorDescription')}</Label>
                        <Input
                            id="floor-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('tables.floorDescriptionPlaceholder')}
                            className="h-10"
                        />
                    </div>

                    {/* Color picker */}
                    <div className="space-y-2">
                        <Label>{t('tables.floorColor')}</Label>
                        <div className="flex gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={cn(
                                        'size-8 rounded-full transition-all border-2',
                                        colorDot[c],
                                        color === c
                                            ? 'border-foreground scale-110 shadow-md'
                                            : 'border-transparent opacity-60 hover:opacity-100',
                                    )}
                                    title={c}
                                />
                            ))}
                        </div>
                        {errors.color && <p className="text-xs text-red-500">{errors.color}</p>}
                    </div>

                    <DialogFooter className="gap-2 pt-2">
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
                            {t('common.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
