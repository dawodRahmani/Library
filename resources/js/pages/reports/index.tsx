import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ReportSummaryCards } from '@/modules/reports/components/report-summary-cards';
import { ReportFilters, type FilterPeriod } from '@/modules/reports/components/report-filters';
import { DailySalesChart } from '@/modules/reports/components/daily-sales-chart';
import { TopItemsChart } from '@/modules/reports/components/top-items-chart';
import { ReportTable } from '@/modules/reports/components/report-table';
import { ExportButtons } from '@/modules/reports/components/export-buttons';
import {
    mockDailySales,
    mockTopSellingItems,
    getTotalRevenue,
    getTotalExpenses,
    getTotalProfit,
} from '@/modules/reports/data/mock-reports';

export default function ReportsPage() {
    const { t } = useTranslation();
    const [activeFilter, setActiveFilter] = useState<FilterPeriod>('month');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.reports'), href: '/reports' },
    ];

    // Filter data based on selected period
    const filteredData = useMemo(() => {
        const allData = mockDailySales;
        switch (activeFilter) {
            case 'today':
                return allData.slice(-1);
            case 'week':
                return allData.slice(-7);
            case 'month':
                return allData;
            case 'custom':
                return allData;
            default:
                return allData;
        }
    }, [activeFilter]);

    const revenue = getTotalRevenue(filteredData);
    const expenses = getTotalExpenses(filteredData);
    const profit = getTotalProfit(filteredData);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('reports.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('reports.title')}</h1>
                    <ExportButtons />
                </div>

                {/* Filters */}
                <ReportFilters
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />

                {/* Summary Cards */}
                <ReportSummaryCards
                    revenue={revenue}
                    expenses={expenses}
                    profit={profit}
                />

                {/* Charts */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <DailySalesChart data={filteredData} />
                    <TopItemsChart data={mockTopSellingItems} />
                </div>

                {/* Details Table */}
                <ReportTable data={filteredData} />
            </div>
        </AppLayout>
    );
}
