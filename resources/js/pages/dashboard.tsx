import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { DashboardStats } from '@/modules/dashboard/components/dashboard-stats';
import { RecentOrders } from '@/modules/dashboard/components/recent-orders';
import { TableStatusGrid } from '@/modules/dashboard/components/table-status-grid';
import { useOrderEvents } from '@/hooks/use-order-events';

export default function Dashboard() {
    const { t } = useTranslation();

    // Auto-refresh dashboard every 5s
    useOrderEvents({ interval: 5000, showNotifications: true });

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

                {/* Footer */}
                <footer className="mt-auto border-t pt-4 pb-2 text-center space-y-0.5">
                    <p className="text-xs text-muted-foreground/60">
                        Developed by <span className="font-medium">Hadaf e Bartar ICT</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground/40">
                        Kota-e-Sangi, 1st Street (Babrak Street), House 32 &middot; 0789409014 | 070 880 5207
                    </p>
                </footer>
            </div>
        </AppLayout>
    );
}
