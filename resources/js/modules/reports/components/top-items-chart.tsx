import { useTranslation } from 'react-i18next';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TopSellingItem } from '../types';

interface TopItemsChartProps {
    data: TopSellingItem[];
}

export function TopItemsChart({ data }: TopItemsChartProps) {
    const { t } = useTranslation();

    const chartData = data.slice(0, 8).map((item) => ({
        name: item.name,
        [t('reports.quantitySold')]: item.quantity,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('reports.topSellingItems')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                            <XAxis
                                type="number"
                                tick={{ fill: 'currentColor', fontSize: 12 }}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                tick={{ fill: 'currentColor', fontSize: 13 }}
                                width={75}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    direction: 'rtl',
                                }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Bar
                                dataKey={t('reports.quantitySold')}
                                fill="#3b82f6"
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
