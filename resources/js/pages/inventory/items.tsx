import { useState, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Plus, Package } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';
import { InventoryItemTable } from '@/modules/inventory/components/inventory-item-table';
import { InventoryItemFilters } from '@/modules/inventory/components/inventory-item-filters';
import { InventoryItemFormDialog } from '@/modules/inventory/components/inventory-item-form-dialog';
import { InventoryItemDeleteDialog } from '@/modules/inventory/components/inventory-item-delete-dialog';
import type { InventoryItem, InventoryItemFormData, InventoryCategoryItem, InventoryUnitItem } from '@/modules/inventory/types';

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

interface Props extends Record<string, unknown> {
    items: InventoryItem[];
    categories: InventoryCategoryItem[];
    units: InventoryUnitItem[];
}

export default function InventoryItemsPage() {
    const { t } = useTranslation();
    const { items, categories, units } = usePage<Props>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.inventory'), href: '/inventory' },
        { title: t('inventory.items'), href: '/inventory/items' },
    ];

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch =
                !search || item.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory =
                categoryFilter === 'all' || String(item.inventory_category_id) === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [items, search, categoryFilter]);

    const totalValue = useMemo(() => {
        return filteredItems.reduce((sum, i) => sum + i.current_stock * i.cost_per_unit, 0);
    }, [filteredItems]);

    const handleFormSubmit = (data: InventoryItemFormData) => {
        if (editingItem) {
            router.patch(`/inventory/items/${editingItem.id}`, { ...data }, {
                onSuccess: () => { setFormOpen(false); setEditingItem(null); },
            });
        } else {
            router.post('/inventory/items', { ...data }, {
                onSuccess: () => setFormOpen(false),
            });
        }
    };

    const handleDeleteConfirm = () => {
        if (!deletingItem) return;
        router.delete(`/inventory/items/${deletingItem.id}`, {
            onSuccess: () => { setDeleteOpen(false); setDeletingItem(null); },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('inventory.items')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-purple-600 text-white shadow-md">
                            <Package className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{t('inventory.items')}</h1>
                            <p className="text-sm text-muted-foreground">
                                {t('common.showing')} {filteredItems.length} {t('common.of')} {items.length} {t('common.results')}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="rounded-xl border bg-card px-4 py-2 shadow-sm">
                            <p className="text-xs text-muted-foreground">{t('inventory.totalValue')}</p>
                            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{formatPrice(totalValue)}</p>
                        </div>
                        <Button
                            onClick={() => { setEditingItem(null); setFormOpen(true); }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
                        >
                            <Plus className="size-4 me-2" />
                            {t('inventory.addItem')}
                        </Button>
                    </div>
                </div>

                <InventoryItemFilters
                    search={search}
                    onSearchChange={setSearch}
                    categoryFilter={categoryFilter}
                    onCategoryFilterChange={setCategoryFilter}
                    categories={categories}
                />

                <InventoryItemTable
                    items={filteredItems}
                    onEdit={(item) => { setEditingItem(item); setFormOpen(true); }}
                    onDelete={(item) => { setDeletingItem(item); setDeleteOpen(true); }}
                />

                {filteredItems.length > 0 && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                        {t('common.showing')} {filteredItems.length} {t('common.of')} {items.length} {t('common.results')}
                    </div>
                )}
            </div>

            <InventoryItemFormDialog
                open={formOpen}
                onClose={() => { setFormOpen(false); setEditingItem(null); }}
                onSubmit={handleFormSubmit}
                item={editingItem}
                categories={categories}
                units={units}
            />

            <InventoryItemDeleteDialog
                open={deleteOpen}
                onClose={() => { setDeleteOpen(false); setDeletingItem(null); }}
                onConfirm={handleDeleteConfirm}
                item={deletingItem}
            />
        </AppLayout>
    );
}
