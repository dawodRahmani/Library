import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Package, ArrowUpCircle, ArrowDownCircle, AlertTriangle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';
import { InventoryStats } from '@/modules/inventory/components/inventory-stats';
import { InventoryAlertsList } from '@/modules/inventory/components/inventory-alerts-list';
import { StockTransactionTable } from '@/modules/inventory/components/stock-transaction-table';
import type { InventoryAlert, StockTransaction } from '@/modules/inventory/types';

interface InventoryStatsData {
    totalItems: number;
    totalValue: number;
    totalPurchases: number;
    totalWasteLoss: number;
    lowStockCount: number;
    criticalCount: number;
}

interface Props extends Record<string, unknown> {
    alerts: InventoryAlert[];
    recentTransactions: StockTransaction[];
    stats: InventoryStatsData;
}

export default function InventoryDashboard() {
    const { t } = useTranslation();
    const { alerts, recentTransactions, stats } = usePage<Props>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.inventory'), href: '/inventory' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('inventory.dashboard')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-purple-600 text-white shadow-md">
                            <Package className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{t('inventory.dashboard')}</h1>
                            <p className="text-sm text-muted-foreground">{t('inventory.title')}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/inventory/items">
                                <Package className="size-4 me-2" />
                                {t('inventory.items')}
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/inventory/transactions">
                                <ArrowUpCircle className="size-4 me-2" />
                                {t('inventory.transactions')}
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/inventory/alerts">
                                <AlertTriangle className="size-4 me-2" />
                                {t('inventory.alerts')}
                                {alerts.length > 0 && (
                                    <span className="ms-1.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                        {alerts.length}
                                    </span>
                                )}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <InventoryStats stats={stats} />

                {/* Alerts Section */}
                {alerts.length > 0 && (
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <AlertTriangle className="size-4 text-amber-500" />
                                {t('inventory.alerts')}
                                <span className="flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                    {alerts.length}
                                </span>
                            </CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/inventory/alerts">{t('common.all')}</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <InventoryAlertsList alerts={alerts} />
                        </CardContent>
                    </Card>
                )}

                {/* Recent Transactions */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <ArrowDownCircle className="size-4 text-emerald-500" />
                            {t('inventory.recentTransactions')}
                        </CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/inventory/transactions">{t('common.all')}</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <StockTransactionTable transactions={recentTransactions} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
