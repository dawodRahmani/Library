import { useTranslation } from 'react-i18next';
import { Eye, Plus, Settings, Users } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { RestaurantTable } from '@/types/models';

interface TableCardProps {
    table: RestaurantTable;
    onNewOrder: (tableId: number) => void;
    onViewOrder: (orderId: number) => void;
    onEdit: (table: RestaurantTable) => void;
}

export function TableCard({ table, onNewOrder, onViewOrder, onEdit }: TableCardProps) {
    const { t } = useTranslation();
    const isAvailable = table.status === 'available';

    return (
        <Card
            className={cn(
                'relative transition-shadow hover:shadow-md',
                isAvailable ? 'border-emerald-200 dark:border-emerald-800' : 'border-red-200 dark:border-red-800',
            )}
        >
            <CardHeader className="flex-row items-center justify-between pb-0">
                <CardTitle className="text-base">
                    {table.name || `${t('tables.table')} ${table.number}`}
                </CardTitle>
                <button
                    onClick={() => onEdit(table)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Settings className="size-4" />
                </button>
            </CardHeader>

            <CardContent className="space-y-3">
                <Badge
                    className={cn(
                        isAvailable
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
                        'border-transparent',
                    )}
                >
                    {isAvailable ? t('tables.available') : t('tables.occupied')}
                </Badge>

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="size-3.5" />
                    <span>
                        {t('tables.capacity')}: {table.capacity}
                    </span>
                </div>

                {!isAvailable && table.active_order_id && (
                    <div className="text-sm text-muted-foreground">
                        {t('tables.orderNumber')}: #{table.active_order_id}
                    </div>
                )}
            </CardContent>

            <CardFooter>
                {isAvailable ? (
                    <Button
                        onClick={() => onNewOrder(table.id)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        size="sm"
                    >
                        <Plus className="size-4 me-1.5" />
                        {t('tables.newOrder')}
                    </Button>
                ) : (
                    <Button
                        onClick={() => table.active_order_id && onViewOrder(table.active_order_id)}
                        variant="outline"
                        className="w-full"
                        size="sm"
                    >
                        <Eye className="size-4 me-1.5" />
                        {t('tables.viewOrder')}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
