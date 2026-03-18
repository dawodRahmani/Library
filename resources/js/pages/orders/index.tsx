import { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Order, OrderStatus } from '@/data/mock/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { OrderFilters } from '@/modules/orders/components/order-filters';
import { OrdersTable } from '@/modules/orders/components/orders-table';
import { Pagination } from '@/components/ui/pagination';
import { ShamsiDateInput } from '@/components/ui/shamsi-date-input';
import { useDebounce } from '@/hooks/use-debounce';
import { useOrderEvents } from '@/hooks/use-order-events';

interface PaginatedOrders {
    data: Order[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Filters {
    status?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
}

interface Props extends Record<string, unknown> {
    orders: PaginatedOrders;
    filters: Filters;
}

export default function OrdersPage() {
    const { t } = useTranslation();
    const { orders, filters } = usePage<Props>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState<OrderStatus | 'all'>((filters.status as OrderStatus) ?? 'all');
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');

    const debouncedSearch = useDebounce(search, 400);

    // Auto-refresh orders every 5s with notifications
    useOrderEvents({ reloadProps: ['orders'], interval: 5000, showNotifications: true });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('orders.title'), href: '/orders' },
    ];

    // Navigate with updated filters whenever any filter changes
    useEffect(() => {
        const params: Record<string, string> = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (status !== 'all') params.status = status;
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;

        router.get('/orders', params, { preserveState: true, replace: true });
    }, [debouncedSearch, status, dateFrom, dateTo]);

    function handlePageChange(page: number) {
        const params: Record<string, string | number> = { page };
        if (search) params.search = search;
        if (status !== 'all') params.status = status;
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;
        router.get('/orders', params, { preserveState: true });
    }

    function clearDates() {
        setDateFrom('');
        setDateTo('');
    }

    const hasDateFilter = dateFrom || dateTo;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('orders.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('orders.title')}</h1>
                    <Button asChild>
                        <Link href="/orders/create">
                            <Plus className="me-2 size-4" />
                            {t('orders.newOrder')}
                        </Link>
                    </Button>
                </div>

                {/* Filters row */}
                <div className="flex flex-wrap gap-3 items-center">
                    {/* Search */}
                    <div className="relative w-56">
                        <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                        <Input
                            placeholder={t('orders.searchOrders')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="ps-9"
                        />
                    </div>

                    {/* Date from */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">{t('orders.dateFrom')}</span>
                        <ShamsiDateInput
                            value={dateFrom}
                            onChange={setDateFrom}
                            placeholder={t('orders.selectDate')}
                            className="w-44"
                        />
                    </div>

                    {/* Date to */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">{t('orders.dateTo')}</span>
                        <ShamsiDateInput
                            value={dateTo}
                            onChange={setDateTo}
                            placeholder={t('orders.selectDate')}
                            className="w-44"
                        />
                    </div>

                    {/* Clear dates */}
                    {hasDateFilter && (
                        <Button variant="ghost" size="sm" onClick={clearDates}>
                            <X className="size-4" />
                        </Button>
                    )}

                    {/* Status filter */}
                    <OrderFilters activeFilter={status} onFilterChange={setStatus} />
                </div>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <OrdersTable orders={orders.data} />
                    </CardContent>
                </Card>

                {/* Pagination */}
                <Pagination
                    currentPage={orders.current_page}
                    totalPages={orders.last_page}
                    onPageChange={handlePageChange}
                    totalItems={orders.total}
                    perPage={orders.per_page}
                />
            </div>
        </AppLayout>
    );
}
