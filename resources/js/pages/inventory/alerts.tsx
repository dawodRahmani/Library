import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { InventoryAlertsList } from '@/modules/inventory/components/inventory-alerts-list';
import type { InventoryAlert } from '@/modules/inventory/types';

interface Props extends Record<string, unknown> {
    alerts: InventoryAlert[];
}

export default function AlertsPage() {
    const { t } = useTranslation();
    const { alerts } = usePage<Props>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.inventory'), href: '/inventory' },
        { title: t('inventory.alerts'), href: '/inventory/alerts' },
    ];

    const criticalAlerts = alerts.filter((a) => a.severity === 'critical');
    const warningAlerts = alerts.filter((a) => a.severity === 'warning');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('inventory.alerts')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-red-600 text-white shadow-md">
                        <AlertTriangle className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">{t('inventory.alerts')}</h1>
                        <p className="text-sm text-muted-foreground">
                            {alerts.length} {t('inventory.lowStockItems')}
                        </p>
                    </div>
                </div>

                {criticalAlerts.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-red-600 dark:text-red-400">
                            <AlertTriangle className="size-4" />
                            {t('inventory.criticalStock')} ({criticalAlerts.length})
                        </h2>
                        <InventoryAlertsList alerts={criticalAlerts} />
                    </div>
                )}

                {warningAlerts.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="size-4" />
                            {t('inventory.lowStock')} ({warningAlerts.length})
                        </h2>
                        <InventoryAlertsList alerts={warningAlerts} />
                    </div>
                )}

                {alerts.length === 0 && <InventoryAlertsList alerts={[]} />}
            </div>
        </AppLayout>
    );
}
