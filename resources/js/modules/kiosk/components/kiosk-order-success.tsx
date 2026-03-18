import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KioskOrderSuccessProps {
    tableNumber: number | null;
    onNewOrder: () => void;
}

export function KioskOrderSuccess({ tableNumber, onNewOrder }: KioskOrderSuccessProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
            <div className="flex size-28 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <CheckCircle2 className="size-16 text-emerald-500" />
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black">{t('kiosk.orderSubmitted')}</h2>
                <p className="text-lg text-muted-foreground">{t('kiosk.orderSubmittedHint')}</p>
                {tableNumber && (
                    <p className="text-xl font-bold text-primary">
                        {t('kiosk.table')} {tableNumber}
                    </p>
                )}
            </div>
            <Button
                size="lg"
                className="h-16 px-12 text-xl font-bold rounded-xl mt-4"
                onClick={onNewOrder}
            >
                {t('kiosk.newOrder')}
            </Button>
        </div>
    );
}
