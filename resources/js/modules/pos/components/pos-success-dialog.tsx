import { useTranslation } from 'react-i18next';
import { CheckCircle2, Printer, Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }

interface PosSuccessDialogProps {
    open: boolean;
    total: number;
    onNewSale: () => void;
    onPrint: () => void;
}

export function PosSuccessDialog({ open, total, onNewSale, onPrint }: PosSuccessDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={() => onNewSale()}>
            <DialogContent className="sm:max-w-sm text-center">
                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <CheckCircle2 className="size-10 text-emerald-600 dark:text-emerald-400" />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                            {t('pos.paymentSuccess')}
                        </h2>
                        <p className="text-2xl font-bold mt-2">{formatPrice(total)}</p>
                    </div>

                    <div className="flex w-full gap-3 mt-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={onPrint}
                        >
                            <Printer className="size-4 me-2" />
                            {t('orders.printBill')}
                        </Button>
                        <Button
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={onNewSale}
                        >
                            <Plus className="size-4 me-2" />
                            {t('pos.newSale')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
