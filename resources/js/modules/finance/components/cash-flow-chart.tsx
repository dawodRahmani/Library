import { useTranslation } from 'react-i18next';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DailyCashFlow } from '../data/mock-finance';

interface CashFlowChartProps {
    data: DailyCashFlow[];
}

export function CashFlowChart({ data }: CashFlowChartProps) {
    const { t } = useTranslation();

    const chartData = data.map((d) => ({
        date: d.date.split('-').slice(1).join('/'),
        [t('finance.inflow')]: d.inflow,
        [t('finance.outflow')]: d.outflow,
    }));

    return (
        <Card className="col-span-full lg:col-span-2">
            <CardHeader>
                <CardTitle>{t('finance.cashFlow')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="date"
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
                            <Area
                                type="monotone"
                                dataKey={t('finance.inflow')}
                                stroke="#22c55e"
                                strokeWidth={2}
                                fill="url(#inflowGrad)"
                            />
                            <Area
                                type="monotone"
                                dataKey={t('finance.outflow')}
                                stroke="#ef4444"
                                strokeWidth={2}
                                fill="url(#outflowGrad)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
