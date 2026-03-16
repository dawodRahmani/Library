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
import type { DailySalesData } from '../data/mock-reports';

interface DailySalesChartProps {
    data: DailySalesData[];
}

export function DailySalesChart({ data }: DailySalesChartProps) {
    const { t } = useTranslation();

    const chartData = data.map((d) => ({
        date: d.date.split('-').slice(1).join('/'),
        [t('reports.revenue')]: d.revenue,
        [t('reports.expenses')]: d.expenses,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('reports.dailySales')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="date"
                                className="text-xs"
                                tick={{ fill: 'currentColor', fontSize: 12 }}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fill: 'currentColor', fontSize: 12 }}
                                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                            />
                            <Tooltip
                                formatter={(value: number) => `${value.toLocaleString()} ؋`}
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
                                dataKey={t('reports.revenue')}
                                fill="#22c55e"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey={t('reports.expenses')}
                                fill="#ef4444"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
