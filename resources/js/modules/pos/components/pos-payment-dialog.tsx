import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Banknote, CreditCard, CheckCircle2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }
import type { PaymentMethod } from '../types';

interface PosPaymentDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (method: PaymentMethod) => void;
    total: number;
}

export function PosPaymentDialog({ open, onClose, onConfirm, total }: PosPaymentDialogProps) {
    const { t } = useTranslation();
    const [method, setMethod] = useState<PaymentMethod>('cash');
    const [amountReceived, setAmountReceived] = useState<string>('');

    const received = Number(amountReceived) || 0;
    const change = received - total;

    const quickAmounts = [
        total,
        Math.ceil(total / 100) * 100,
        Math.ceil(total / 500) * 500,
        Math.ceil(total / 1000) * 1000,
    ].filter((v, i, a) => a.indexOf(v) === i && v >= total);

    const handleConfirm = () => {
        onConfirm(method);
        setAmountReceived('');
    };

    const canPay = method === 'card' || received >= total;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">{t('pos.payNow')}</DialogTitle>
                </DialogHeader>

                {/* Total */}
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-4 text-center">
                    <p className="text-sm text-muted-foreground">{t('pos.total')}</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatPrice(total)}
                    </p>
                </div>

                {/* Payment Method */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setMethod('cash')}
                        className={cn(
                            'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                            method === 'cash'
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                : 'border-border hover:border-muted-foreground/30',
                        )}
                    >
                        <Banknote className={cn('size-8', method === 'cash' ? 'text-emerald-600' : 'text-muted-foreground')} />
                        <span className={cn('font-medium', method === 'cash' ? 'text-emerald-600' : 'text-muted-foreground')}>
                            {t('pos.cash')}
                        </span>
                    </button>
                    <button
                        onClick={() => setMethod('card')}
                        className={cn(
                            'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                            method === 'card'
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-border hover:border-muted-foreground/30',
                        )}
                    >
                        <CreditCard className={cn('size-8', method === 'card' ? 'text-purple-600' : 'text-muted-foreground')} />
                        <span className={cn('font-medium', method === 'card' ? 'text-purple-600' : 'text-muted-foreground')}>
                            {t('pos.card')}
                        </span>
                    </button>
                </div>

                {/* Cash amount input */}
                {method === 'cash' && (
                    <>
                        <div className="space-y-2">
                            <Label>{t('pos.amountReceived')}</Label>
                            <Input
                                type="number"
                                min={0}
                                value={amountReceived}
                                onChange={(e) => setAmountReceived(e.target.value)}
                                dir="ltr"
                                className="h-12 text-left text-lg font-bold"
                                autoFocus
                            />
                        </div>

                        {/* Quick amount buttons */}
                        <div className="flex flex-wrap gap-2">
                            {quickAmounts.map((amt) => (
                                <Button
                                    key={amt}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAmountReceived(String(amt))}
                                    className="text-xs"
                                >
                                    {formatPrice(amt)}
                                </Button>
                            ))}
                        </div>

                        {received > 0 && (
                            <>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{t('pos.change')}</span>
                                    <span className={cn('text-xl font-bold', change >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                                        {formatPrice(Math.max(change, 0))}
                                    </span>
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* Pay button */}
                <Button
                    onClick={handleConfirm}
                    disabled={!canPay}
                    className="h-12 text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                >
                    <CheckCircle2 className="size-5 me-2" />
                    {t('pos.pay')} — {formatPrice(total)}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
