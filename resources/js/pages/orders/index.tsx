import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Plus, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { OrderStatus } from '@/data/mock/types';
import { mockOrders } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { OrderFilters } from '@/modules/orders/components/order-filters';
import { OrdersTable } from '@/modules/orders/components/orders-table';

export default function OrdersPage() {
    const { t } = useTranslation();
    const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');
    const [search, setSearch] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('orders.title'), href: '/orders' },
    ];

    const filteredOrders = useMemo(() => {
        let orders = mockOrders;

        if (activeFilter !== 'all') {
            orders = orders.filter((o) => o.status === activeFilter);
        }

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            orders = orders.filter(
                (o) =>
                    o.order_number.toLowerCase().includes(q) ||
                    o.table.number.toString().includes(q) ||
                    (o.table.name && o.table.name.toLowerCase().includes(q)) ||
                    (o.created_by_name && o.created_by_name.toLowerCase().includes(q)),
            );
        }

        return orders;
    }, [activeFilter, search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('orders.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('orders.title')}</h1>
                    <Button asChild>
                        <Link href="/orders/create">
                            <Plus className="me-2 size-4" />
                            {t('orders.newOrder')}
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative max-w-sm flex-1">
                        <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                        <Input
                            placeholder={t('orders.search')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="ps-9"
                        />
                    </div>
                    <OrderFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
                </div>

                <Card>
                    <CardContent className="p-0">
                        <OrdersTable orders={filteredOrders} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
