import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { PurchaseOrderTable } from '@/modules/inventory/components/purchase-order-table';
import { PurchaseOrderFormDialog } from '@/modules/inventory/components/purchase-order-form-dialog';
import { PurchaseOrderEditDialog } from '@/modules/inventory/components/purchase-order-edit-dialog';
import type { PurchaseOrder, PurchaseOrderStatus, PurchaseOrderFormData } from '@/modules/inventory/types';

type FilterStatus = PurchaseOrderStatus | 'all';

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

interface SupplierOption { id: number; name: string }
interface ItemOption { id: number; name: string; unit: string; cost_per_unit: number }

interface Props extends Record<string, unknown> {
    orders: PurchaseOrder[];
    suppliers: SupplierOption[];
    items: ItemOption[];
}

export default function PurchaseOrdersPage() {
    const { t } = useTranslation();
    const { orders, suppliers, items } = usePage<Props>().props;
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [formOpen, setFormOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);

    const filtered = filterStatus === 'all' ? orders : orders.filter((o) => o.status === filterStatus);

    const stats = {
        ordered:      orders.filter((o) => o.status === 'ordered').length,
        draft:        orders.filter((o) => o.status === 'draft').length,
        arrived:      orders.filter((o) => o.status === 'arrived').length,
        totalPending: orders
            .filter((o) => o.status === 'ordered' || o.status === 'draft')
            .reduce((s, o) => s + o.total_amount, 0),
    };

    function handleMarkArrived(id: number) {
        router.patch(`/inventory/purchase-orders/${id}/arrive`);
    }

    function handleFormSubmit(data: PurchaseOrderFormData) {
        router.post('/inventory/purchase-orders', data as unknown as Record<string, unknown>, {
            onSuccess: () => setFormOpen(false),
        });
    }

    function handleEdit(order: PurchaseOrder) {
        setEditingOrder(order);
        setEditOpen(true);
    }

    function handleEditSubmit(id: number, data: { status: PurchaseOrderStatus; expected_delivery: string; notes: string }) {
        router.patch(`/inventory/purchase-orders/${id}`, data, {
            onSuccess: () => setEditOpen(false),
        });
    }

    const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
        { value: 'all',       label: t('common.all') },
        { value: 'draft',     label: t('inventory.poStatus.draft') },
        { value: 'ordered',   label: t('inventory.poStatus.ordered') },
        { value: 'arrived',   label: t('inventory.poStatus.arrived') },
        { value: 'cancelled', label: t('inventory.poStatus.cancelled') },
    ];

    const breadcrumbs = [
        { title: t('sidebar.inventory'), href: '/inventory' },
        { title: t('inventory.purchaseOrders'), href: '/inventory/purchase-orders' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('inventory.purchaseOrders')} />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{t('inventory.purchaseOrders')}</h1>
                        <p className="text-sm text-muted-foreground">{t('inventory.purchaseOrdersDesc')}</p>
                    </div>
                    <Button onClick={() => setFormOpen(true)}>
                        <Plus className="size-4 me-2" />
                        {t('inventory.newPurchaseOrder')}
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg border bg-blue-50 p-3 text-center dark:bg-blue-900/20">
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.ordered}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">{t('inventory.poStatus.ordered')}</p>
                    </div>
                    <div className="rounded-lg border bg-gray-50 p-3 text-center dark:bg-gray-800">
                        <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.draft}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{t('inventory.poStatus.draft')}</p>
                    </div>
                    <div className="rounded-lg border bg-emerald-50 p-3 text-center dark:bg-emerald-900/20">
                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.arrived}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">{t('inventory.poStatus.arrived')}</p>
                    </div>
                    <div className="rounded-lg border bg-orange-50 p-3 text-center dark:bg-orange-900/20">
                        <p className="text-lg font-bold text-orange-700 dark:text-orange-300">{formatPrice(stats.totalPending)}</p>
                        <p className="text-xs text-orange-600 dark:text-orange-400">{t('inventory.pendingOrderValue')}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {FILTER_OPTIONS.map((opt) => (
                        <Button
                            key={opt.value}
                            size="sm"
                            variant={filterStatus === opt.value ? 'default' : 'outline'}
                            onClick={() => setFilterStatus(opt.value)}
                        >
                            {opt.label}
                            {opt.value !== 'all' && (
                                <span className="ms-1.5 rounded-full bg-white/20 px-1.5 text-xs">
                                    {orders.filter((o) => o.status === opt.value).length}
                                </span>
                            )}
                        </Button>
                    ))}
                </div>

                <PurchaseOrderTable
                    orders={filtered}
                    onMarkArrived={handleMarkArrived}
                    onEdit={handleEdit}
                />
            </div>

            <PurchaseOrderFormDialog
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
                suppliers={suppliers}
                inventoryItems={items}
            />

            <PurchaseOrderEditDialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onSubmit={handleEditSubmit}
                order={editingOrder}
            />
        </AppLayout>
    );
}
