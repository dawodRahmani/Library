import { useTranslation } from 'react-i18next';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MonthlyFinance } from '../types';

interface MonthlyComparisonProps {
    data: MonthlyFinance[];
}

export function MonthlyComparison({ data }: MonthlyComparisonProps) {
    const { t } = useTranslation();

    const chartData = data.map((d) => ({
        month: d.monthLabel,
        [t('finance.income')]: d.income,
        [t('finance.expenses')]: d.expenses + d.salaries,
        [t('finance.netProfit')]: d.netProfit,
    }));

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>{t('finance.monthlyComparison')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="month"
                                tick={{ fill: 'currentColor', fontSize: 12 }}
                            />
                            <YAxis
                                tick={{ fill: 'currentColor', fontSize: 12 }}
                                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                            />
                            <Tooltip
                                formatter={(value) => `${Number(value).toLocaleString()} ؋`}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    direction: 'rtl',
                                }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend />
                            <Bar
                                dataKey={t('finance.income')}
                                fill="#22c55e"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey={t('finance.expenses')}
                                fill="#ef4444"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey={t('finance.netProfit')}
                                fill="#6366f1"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
