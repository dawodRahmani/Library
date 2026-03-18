import { useTranslation } from 'react-i18next';
import { AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { InventoryAlert } from '../types';

interface InventoryAlertsListProps {
    alerts: InventoryAlert[];
}

export function InventoryAlertsList({ alerts }: InventoryAlertsListProps) {
    const { t } = useTranslation();

    if (alerts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <CheckCircle2 className="size-12 mb-3 text-emerald-400 opacity-50" />
                <p className="text-lg font-medium">{t('inventory.noAlerts')}</p>
            </div>
        );
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {alerts.map((alert) => {
                const isCritical = alert.severity === 'critical';
                return (
                    <Card
                        key={alert.id}
                        className={`border-2 ${
                            isCritical
                                ? 'border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10'
                                : 'border-amber-300 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10'
                        }`}
                    >
                        <CardContent className="flex items-start gap-3 p-4">
                            <div
                                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                                    isCritical
                                        ? 'bg-red-100 dark:bg-red-900/30'
                                        : 'bg-amber-100 dark:bg-amber-900/30'
                                }`}
                            >
                                {isCritical ? (
                                    <AlertOctagon className="size-5 text-red-600 dark:text-red-400" />
                                ) : (
                                    <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-semibold truncate">{alert.item_name}</h3>
                                    <Badge
                                        variant="outline"
                                        className={`shrink-0 text-xs ${
                                            isCritical
                                                ? 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
                                                : 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700'
                                        }`}
                                    >
                                        {isCritical ? t('inventory.criticalStock') : t('inventory.lowStock')}
                                    </Badge>
                                </div>

                                <div className="mt-2 flex items-center gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">{t('inventory.currentStock')}: </span>
                                        <span className={`font-bold ${isCritical ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                            {alert.current_stock} {t(`inventory.units.${alert.unit}`)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">{t('inventory.minStockLevel')}: </span>
                                        <span className="font-medium">{alert.min_stock_level}</span>
                                    </div>
                                </div>

                                <div className="mt-1 text-sm">
                                    <span className="text-muted-foreground">{t('inventory.shortage')}: </span>
                                    <span className="font-bold text-red-600 dark:text-red-400">
                                        {alert.shortage} {t(`inventory.units.${alert.unit}`)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
