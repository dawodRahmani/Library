import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, X, Merge } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Order, OrderStatus } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { OrderFilters } from '@/modules/orders/components/order-filters';
import { OrdersTable } from '@/modules/orders/components/orders-table';
import { Pagination } from '@/components/ui/pagination';
import { ShamsiDateInput } from '@/components/ui/shamsi-date-input';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';
import { useOrderEvents } from '@/hooks/use-order-events';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

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

    // Merge mode state
    const [mergeMode, setMergeMode] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
    const [showMergeDialog, setShowMergeDialog] = useState(false);
    const [targetOrderId, setTargetOrderId] = useState<string>('');
    const [merging, setMerging] = useState(false);

    const debouncedSearch = useDebounce(search, 400);

    useOrderEvents({ reloadProps: ['orders'], showNotifications: true, enabled: !mergeMode });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('orders.title'), href: '/orders' },
    ];

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

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

    function toggleMergeMode() {
        setMergeMode(!mergeMode);
        setSelectedOrders([]);
    }

    function handleToggleSelect(id: number) {
        setSelectedOrders((prev) =>
            prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
        );
    }

    function openMergeDialog() {
        if (selectedOrders.length < 2) return;
        setTargetOrderId(String(selectedOrders[0]));
        setShowMergeDialog(true);
    }

    function handleMerge() {
        if (!targetOrderId || selectedOrders.length < 2) return;

        const targetId = Number(targetOrderId);
        const sourceIds = selectedOrders.filter((id) => id !== targetId);

        setMerging(true);
        router.post('/orders/merge', {
            target_order_id: targetId,
            source_order_ids: sourceIds,
        }, {
            onSuccess: () => {
                toast.success(t('orders.mergeOrders'), { description: t('orders.mergeSuccess') });
            },
            onError: (errors) => {
                const msg = Object.values(errors).flat().join(', ');
                toast.error(msg || 'Merge failed');
            },
            onFinish: () => {
                setMerging(false);
                setShowMergeDialog(false);
                setMergeMode(false);
                setSelectedOrders([]);
            },
        });
    }

    const selectedOrderObjects = orders.data.filter((o) => selectedOrders.includes(o.id));
    const hasDateFilter = dateFrom || dateTo;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('orders.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('orders.title')}</h1>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={mergeMode ? 'destructive' : 'outline'}
                            onClick={toggleMergeMode}
                        >
                            <Merge className="me-2 size-4" />
                            {mergeMode ? t('orders.cancel') : t('orders.mergeOrders')}
                        </Button>
                        {!mergeMode && (
                            <Button asChild>
                                <Link href="/orders/create">
                                    <Plus className="me-2 size-4" />
                                    {t('orders.newOrder')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Merge action bar */}
                {mergeMode && (
                    <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
                        <span className="text-sm font-medium">
                            {t('orders.mergeSelectHint')} ({selectedOrders.length} {t('orders.selected')})
                        </span>
                        <div className="flex-1" />
                        <Button
                            disabled={selectedOrders.length < 2}
                            onClick={openMergeDialog}
                        >
                            <Merge className="me-2 size-4" />
                            {t('orders.mergeSelected')}
                        </Button>
                    </div>
                )}

                {/* Filters row */}
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative w-56">
                        <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                        <Input
                            placeholder={t('orders.searchOrders')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="ps-9"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">{t('orders.dateFrom')}</span>
                        <ShamsiDateInput
                            value={dateFrom}
                            onChange={setDateFrom}
                            placeholder={t('orders.selectDate')}
                            className="w-44"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">{t('orders.dateTo')}</span>
                        <ShamsiDateInput
                            value={dateTo}
                            onChange={setDateTo}
                            placeholder={t('orders.selectDate')}
                            className="w-44"
                        />
                    </div>

                    {hasDateFilter && (
                        <Button variant="ghost" size="sm" onClick={clearDates}>
                            <X className="size-4" />
                        </Button>
                    )}

                    <OrderFilters activeFilter={status} onFilterChange={setStatus} />
                </div>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <OrdersTable
                            orders={orders.data}
                            mergeMode={mergeMode}
                            selectedOrders={selectedOrders}
                            onToggleSelect={handleToggleSelect}
                        />
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

            {/* Merge confirmation dialog */}
            <Dialog open={showMergeDialog} onOpenChange={setShowMergeDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('orders.mergeOrders')}</DialogTitle>
                        <DialogDescription>{t('orders.mergeDescription')}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>{t('orders.mergeTarget')}</Label>
                            <select
                                value={targetOrderId}
                                onChange={(e) => setTargetOrderId(e.target.value)}
                                className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs"
                            >
                                {selectedOrderObjects.map((order) => (
                                    <option key={order.id} value={String(order.id)}>
                                        {order.order_number} — {order.total_amount.toLocaleString()} ؋
                                        {order.table ? ` (${order.table.name || `${t('orders.table')} ${order.table.number}`})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="rounded-lg border p-3 space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">{t('orders.mergeSourceOrders')}</p>
                            {selectedOrderObjects
                                .filter((o) => String(o.id) !== targetOrderId)
                                .map((order) => (
                                    <div key={order.id} className="flex items-center justify-between text-sm">
                                        <span>{order.order_number}</span>
                                        <span className="text-muted-foreground">{order.total_amount.toLocaleString()} ؋</span>
                                    </div>
                                ))}
                        </div>

                        <p className="text-xs text-muted-foreground">{t('orders.mergeWarning')}</p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowMergeDialog(false)}>
                            {t('orders.cancel')}
                        </Button>
                        <Button onClick={handleMerge} disabled={merging}>
                            <Merge className="me-2 size-4" />
                            {merging ? t('orders.merging') : t('orders.confirmMerge')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
