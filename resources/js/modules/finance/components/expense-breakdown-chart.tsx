import { useTranslation } from 'react-i18next';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ExpenseCategoryBreakdown } from '../types';

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

interface ExpenseBreakdownChartProps {
    data: ExpenseCategoryBreakdown[];
}

export function ExpenseBreakdownChart({ data }: ExpenseBreakdownChartProps) {
    const { t } = useTranslation();

    const chartData = data.map((d) => ({
        name: d.categoryLabel,
        value: d.amount,
        color: d.color,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('finance.expenseBreakdown')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => formatPrice(Number(value))}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    direction: 'rtl',
                                }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend
                                formatter={(value) => <span className="text-sm">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
