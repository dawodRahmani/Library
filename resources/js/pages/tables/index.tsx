import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Plus, UtensilsCrossed } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';
import type { RestaurantTable } from '@/data/mock/types';
import { mockTables } from '@/data/mock';
import { TableGrid } from '@/modules/tables/components/table-grid';
import { TableSummary } from '@/modules/tables/components/table-summary';
import { AddTableModal } from '@/modules/tables/components/add-table-modal';

export default function TablesPage() {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('tables.title'), href: '/tables' },
    ];

    const [modalOpen, setModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState<RestaurantTable | undefined>(undefined);

    const handleNewOrder = (tableId: number) => {
        router.visit('/orders/create?table=' + tableId);
    };

    const handleViewOrder = (orderId: number) => {
        router.visit('/orders/' + orderId);
    };

    const handleEdit = (table: RestaurantTable) => {
        setEditingTable(table);
        setModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingTable(undefined);
        setModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('tables.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-purple-600 text-white shadow-md">
                            <UtensilsCrossed className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{t('tables.title')}</h1>
                            <TableSummary tables={mockTables} />
                        </div>
                    </div>

                    <Button
                        onClick={handleAddNew}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
                    >
                        <Plus className="size-4 me-2" />
                        {t('tables.addTable')}
                    </Button>
                </div>

                {/* Grid */}
                <TableGrid
                    tables={mockTables}
                    onNewOrder={handleNewOrder}
                    onViewOrder={handleViewOrder}
                    onEdit={handleEdit}
                />
            </div>

            {/* Add/Edit Modal */}
            <AddTableModal
                open={modalOpen}
                onOpenChange={(open) => {
                    setModalOpen(open);
                    if (!open) setEditingTable(undefined);
                }}
                table={editingTable}
            />
        </AppLayout>
    );
}
