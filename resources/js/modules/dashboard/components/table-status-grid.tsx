import { useTranslation } from 'react-i18next';
import { usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TableStatus {
    id: number;
    number: number;
    name: string | null;
    status: 'available' | 'occupied';
    floor_id: number;
    floor_name: string;
    active_order_id: number | null;
}

export function TableStatusGrid() {
    const { t } = useTranslation();
    const { tableStatuses } = usePage<{ tableStatuses: TableStatus[] }>().props;

    const availableCount = tableStatuses.filter(t => t.status === 'available').length;
    const occupiedCount = tableStatuses.filter(t => t.status === 'occupied').length;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{t('dashboard.tableStatus')}</CardTitle>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            {t('dashboard.available')}: {availableCount}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                            {t('dashboard.occupied')}: {occupiedCount}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {tableStatuses.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                        {t('common.noData')}
                    </div>
                ) : (
                    <div className="grid grid-cols-5 gap-2">
                        {tableStatuses.map((table) => (
                            <div
                                key={table.id}
                                className={cn(
                                    'flex flex-col items-center justify-center rounded-lg border p-3 cursor-pointer transition-colors',
                                    table.status === 'available'
                                        ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:hover:bg-emerald-900'
                                        : 'border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950 dark:hover:bg-amber-900',
                                )}
                                onClick={() => {
                                    if (table.status === 'occupied' && table.active_order_id) {
                                        router.visit(`/orders/${table.active_order_id}`);
                                    } else {
                                        router.visit(`/orders/create?table=${table.id}`);
                                    }
                                }}
                            >
                                <span className="text-lg font-bold">{table.number}</span>
                                {table.name && (
                                    <span className="text-xs text-muted-foreground">{table.name}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
