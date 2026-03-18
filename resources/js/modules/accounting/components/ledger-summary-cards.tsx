import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

interface Props {
    totalIncome: number;
    totalOutflow: number;
    balance: number;
}

export function LedgerSummaryCards({ totalIncome, totalOutflow, balance }: Props) {
    const { t } = useTranslation();
    const isProfit = balance >= 0;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-emerald-600">{t('accounting.totalIncome')}</p>
                            <p className="mt-1 text-2xl font-bold text-emerald-700">{formatPrice(totalIncome)}</p>
                        </div>
                        <div className="rounded-full bg-emerald-100 p-2.5">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-600">{t('accounting.totalOutflow')}</p>
                            <p className="mt-1 text-2xl font-bold text-red-700">{formatPrice(totalOutflow)}</p>
                        </div>
                        <div className="rounded-full bg-red-100 p-2.5">
                            <TrendingDown className="h-5 w-5 text-red-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className={isProfit ? 'border-blue-200 bg-blue-50' : 'border-orange-200 bg-orange-50'}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm ${isProfit ? 'text-blue-600' : 'text-orange-600'}`}>
                                {t('accounting.currentBalance')}
                            </p>
                            <p className={`mt-1 text-2xl font-bold ${isProfit ? 'text-blue-700' : 'text-orange-700'}`}>
                                {formatPrice(Math.abs(balance))}
                            </p>
                            <p className={`text-xs ${isProfit ? 'text-blue-500' : 'text-orange-500'}`}>
                                {isProfit ? t('accounting.profit') : t('accounting.loss')}
                            </p>
                        </div>
                        <div className={`rounded-full p-2.5 ${isProfit ? 'bg-blue-100' : 'bg-orange-100'}`}>
                            <Wallet className={`h-5 w-5 ${isProfit ? 'text-blue-600' : 'text-orange-600'}`} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
