import { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Plus, UtensilsCrossed, Pencil, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';
import type { RestaurantTable, TableFloor } from '@/data/mock/types';
import { TableGrid } from '@/modules/tables/components/table-grid';
import { TableSummary } from '@/modules/tables/components/table-summary';
import { AddTableModal } from '@/modules/tables/components/add-table-modal';
import { FloorFormDialog } from '@/modules/tables/components/floor-form-dialog';
import { useOrderEvents } from '@/hooks/use-order-events';

interface Props extends Record<string, unknown> {
    tables: RestaurantTable[];
    floors: TableFloor[];
}

export default function TablesPage() {
    const { t } = useTranslation();
    const { tables: initialTables, floors } = usePage<Props>().props;

    const [tables, setTables] = useState<RestaurantTable[]>(initialTables);

    // Sync tables when Inertia refreshes props
    useEffect(() => {
        setTables(initialTables);
    }, [initialTables]);

    // Auto-refresh tables every 5s with notifications
    useOrderEvents({ reloadProps: ['tables'], interval: 5000, showNotifications: true });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('tables.title'), href: '/tables' },
    ];

    const [modalOpen, setModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState<RestaurantTable | undefined>(undefined);
    const [activeFloorId, setActiveFloorId] = useState<number | null>(null);

    const [floorDialogOpen, setFloorDialogOpen] = useState(false);
    const [editingFloor, setEditingFloor] = useState<TableFloor | undefined>(undefined);

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

    const handleEditFloor = (floor: TableFloor) => {
        setEditingFloor(floor);
        setFloorDialogOpen(true);
    };

    const handleDeleteFloor = (floor: TableFloor) => {
        if (!confirm(t('tables.deleteFloorConfirm', { name: floor.name }))) return;
        router.delete(`/floors/${floor.id}`);
    };

    const handleAddNew = () => {
        setEditingTable(undefined);
        setModalOpen(true);
    };

    const filteredTables =
        activeFloorId === null
            ? tables
            : tables.filter((t) => t.floor_id === activeFloorId);

    const floorColors: Record<string, string> = {
        emerald: 'border-emerald-300 bg-emerald-50 text-emerald-700',
        blue:    'border-blue-300 bg-blue-50 text-blue-700',
        amber:   'border-amber-300 bg-amber-50 text-amber-700',
        purple:  'border-purple-300 bg-purple-50 text-purple-700',
        red:     'border-red-300 bg-red-50 text-red-700',
        gray:    'border-gray-300 bg-gray-50 text-gray-700',
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
                            <TableSummary tables={filteredTables} />
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

                {/* Floor Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* All floors tab */}
                    <button
                        onClick={() => setActiveFloorId(null)}
                        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                            activeFloorId === null
                                ? 'border-gray-400 bg-gray-700 text-white shadow-sm'
                                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {t('tables.allFloors')}
                        <span className="ms-1.5 rounded-full bg-white/20 px-1.5 text-xs">
                            {tables.length}
                        </span>
                    </button>

                    {/* Per-floor tabs with edit/delete */}
                    {floors.map((floor) => (
                        <div key={floor.id} className="group relative flex items-center">
                            <button
                                onClick={() => setActiveFloorId(floor.id)}
                                className={`rounded-full border pe-8 ps-4 py-1.5 text-sm font-medium transition-all ${
                                    activeFloorId === floor.id
                                        ? `${floorColors[floor.color] ?? floorColors.gray} shadow-sm ring-1 ring-current/30`
                                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {floor.name}
                                <span className="ms-1.5 rounded-full bg-current/10 px-1.5 text-xs">
                                    {tables.filter((tb) => tb.floor_id === floor.id).length}
                                </span>
                            </button>

                            {/* Edit / Delete icons — visible on hover */}
                            <div className="absolute end-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEditFloor(floor)}
                                    className="flex size-5 items-center justify-center rounded-full bg-white/80 text-gray-500 hover:text-emerald-600 shadow-sm"
                                    title={t('tables.editFloor')}
                                >
                                    <Pencil className="size-2.5" />
                                </button>
                                <button
                                    onClick={() => handleDeleteFloor(floor)}
                                    className="flex size-5 items-center justify-center rounded-full bg-white/80 text-gray-500 hover:text-red-600 shadow-sm"
                                    title={t('tables.deleteFloor')}
                                >
                                    <Trash2 className="size-2.5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add floor button */}
                    <button
                        onClick={() => { setEditingFloor(undefined); setFloorDialogOpen(true); }}
                        className="flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-400 hover:border-emerald-400 hover:text-emerald-600 transition-all"
                    >
                        <Plus className="size-3.5" />
                        {t('tables.addFloor')}
                    </button>
                </div>

                {/* Grid */}
                <TableGrid
                    tables={filteredTables}
                    onNewOrder={handleNewOrder}
                    onViewOrder={handleViewOrder}
                    onEdit={handleEdit}
                />
            </div>

            {/* Add/Edit Table Modal */}
            <AddTableModal
                open={modalOpen}
                onOpenChange={(open) => {
                    setModalOpen(open);
                    if (!open) setEditingTable(undefined);
                }}
                table={editingTable}
                floors={floors}
            />

            {/* Add/Edit Floor Dialog */}
            <FloorFormDialog
                open={floorDialogOpen}
                onOpenChange={(open) => {
                    setFloorDialogOpen(open);
                    if (!open) setEditingFloor(undefined);
                }}
                floor={editingFloor}
            />
        </AppLayout>
    );
}
