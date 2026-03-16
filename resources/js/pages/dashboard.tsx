import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { DashboardStats } from '@/modules/dashboard/components/dashboard-stats';
import { RecentOrders } from '@/modules/dashboard/components/recent-orders';
import { TableStatusGrid } from '@/modules/dashboard/components/table-status-grid';

export default function Dashboard() {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('sidebar.dashboard'),
            href: dashboard(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <DashboardStats />

                <div className="grid gap-4 md:grid-cols-2">
                    <RecentOrders />
                    <TableStatusGrid />
                </div>
            </div>
        </AppLayout>
    );
}
