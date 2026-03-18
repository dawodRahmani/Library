import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}
import type { DailySalesData } from '../data/mock-reports';

interface ReportTableProps {
    data: DailySalesData[];
}

export function ReportTable({ data }: ReportTableProps) {
    const { t } = useTranslation();

    const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
    const totalExpenses = data.reduce((s, d) => s + d.expenses, 0);
    const totalProfit = data.reduce((s, d) => s + d.profit, 0);
    const totalOrders = data.reduce((s, d) => s + d.orders, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('reports.salesDetails')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-muted-foreground">
                                <th className="py-3 px-4 text-start font-medium">{t('reports.date')}</th>
                                <th className="py-3 px-4 text-start font-medium">{t('reports.ordersCount')}</th>
                                <th className="py-3 px-4 text-start font-medium">{t('reports.revenue')}</th>
                                <th className="py-3 px-4 text-start font-medium">{t('reports.expenses')}</th>
                                <th className="py-3 px-4 text-start font-medium">{t('reports.profit')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row) => (
                                <tr key={row.date} className="border-b hover:bg-muted/50 transition-colors">
                                    <td className="py-3 px-4 font-medium">{row.date}</td>
                                    <td className="py-3 px-4">{row.orders}</td>
                                    <td className="py-3 px-4 text-green-600 dark:text-green-400">
                                        {formatPrice(row.revenue)}
                                    </td>
                                    <td className="py-3 px-4 text-red-600 dark:text-red-400">
                                        {formatPrice(row.expenses)}
                                    </td>
                                    <td className={cn(
                                        'py-3 px-4 font-medium',
                                        row.profit >= 0
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-red-600 dark:text-red-400',
                                    )}>
                                        {formatPrice(row.profit)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 font-bold">
                                <td className="py-3 px-4">{t('reports.totalRevenue')}</td>
                                <td className="py-3 px-4">{totalOrders}</td>
                                <td className="py-3 px-4 text-green-600 dark:text-green-400">
                                    {formatPrice(totalRevenue)}
                                </td>
                                <td className="py-3 px-4 text-red-600 dark:text-red-400">
                                    {formatPrice(totalExpenses)}
                                </td>
                                <td className={cn(
                                    'py-3 px-4',
                                    totalProfit >= 0
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-red-600 dark:text-red-400',
                                )}>
                                    {formatPrice(totalProfit)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
