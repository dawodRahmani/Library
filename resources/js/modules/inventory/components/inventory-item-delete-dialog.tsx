import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { InventoryItem } from '../types';

interface InventoryItemDeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    item: InventoryItem | null;
}

export function InventoryItemDeleteDialog({ open, onClose, onConfirm, item }: InventoryItemDeleteDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{t('inventory.deleteItem')}</DialogTitle>
                    <DialogDescription>{t('inventory.deleteConfirm')}</DialogDescription>
                </DialogHeader>

                {item && (
                    <p className="text-sm font-medium text-foreground">
                        {item.name} — {item.current_stock} {t(`inventory.units.${item.unit}`)}
                    </p>
                )}

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>
                        {t('common.cancel')}
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        {t('common.delete')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
