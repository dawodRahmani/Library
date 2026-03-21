import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { RestaurantTable } from '@/types/models';

interface KioskTableSelectProps {
    open: boolean;
    onClose: () => void;
    tables: RestaurantTable[];
    selectedTable: number | null;
    onSelect: (tableNumber: number) => void;
}

export function KioskTableSelect({ open, onClose, tables, selectedTable, onSelect }: KioskTableSelectProps) {
    const { t } = useTranslation();

    const availableTables = tables.filter((t) => t.status === 'available');

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">{t('kiosk.selectTable')}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-4 gap-3 mt-4">
                    {availableTables.map((table) => (
                        <Button
                            key={table.id}
                            variant={selectedTable === table.number ? 'default' : 'outline'}
                            className={cn(
                                'h-20 flex-col gap-1 text-lg font-bold rounded-xl',
                                selectedTable === table.number && 'shadow-lg',
                            )}
                            onClick={() => {
                                onSelect(table.number);
                                onClose();
                            }}
                        >
                            <span className="text-2xl">{table.number}</span>
                            {table.name && (
                                <span className="text-xs font-normal opacity-70">{table.name}</span>
                            )}
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
