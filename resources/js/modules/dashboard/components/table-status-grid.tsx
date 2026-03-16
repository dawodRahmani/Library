import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockTables } from '@/data/mock';
import { cn } from '@/lib/utils';

export function TableStatusGrid() {
    const { t } = useTranslation();

    const availableCount = mockTables.filter(t => t.status === 'available').length;
    const occupiedCount = mockTables.filter(t => t.status === 'occupied').length;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{t('dashboard.tableStatus')}</CardTitle>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                            {t('dashboard.available')}: {availableCount}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                            {t('dashboard.occupied')}: {occupiedCount}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {mockTables.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                        {t('common.noData')}
                    </div>
                ) : (
                    <div className="grid grid-cols-5 gap-2">
                        {mockTables.map((table) => (
                            <div
                                key={table.id}
                                className={cn(
                                    'flex flex-col items-center justify-center rounded-lg border p-3 cursor-pointer transition-colors',
                                    table.status === 'available'
                                        ? 'border-green-200 bg-green-50 hover:bg-green-100 dark:border-green-900 dark:bg-green-950 dark:hover:bg-green-900'
                                        : 'border-red-200 bg-red-50 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:hover:bg-red-900',
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
