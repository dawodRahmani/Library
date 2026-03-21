import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Plus, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SupplierTable } from '@/modules/inventory/components/supplier-table';
import { SupplierFormDialog } from '@/modules/inventory/components/supplier-form-dialog';
import type { Supplier, SupplierFormData, InventoryCategoryItem } from '@/modules/inventory/types';

interface Props extends Record<string, unknown> {
    suppliers: Supplier[];
    categories: InventoryCategoryItem[];
}

export default function SuppliersPage() {
    const { t } = useTranslation();
    const { suppliers, categories } = usePage<Props>().props;
    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

    const filtered = suppliers.filter(
        (s) =>
            s.name.includes(search) ||
            s.contact_name.includes(search) ||
            s.phone.includes(search),
    );

    function handleSave(data: SupplierFormData) {
        if (editingSupplier) {
            router.patch(`/inventory/suppliers/${editingSupplier.id}`, { ...data }, {
                onSuccess: () => { setDialogOpen(false); setEditingSupplier(null); },
            });
        } else {
            router.post('/inventory/suppliers', { ...data }, {
                onSuccess: () => setDialogOpen(false),
            });
        }
    }

    function handleDelete(id: number) {
        router.delete(`/inventory/suppliers/${id}`);
    }

    const breadcrumbs = [
        { title: t('sidebar.inventory'), href: '/inventory' },
        { title: t('inventory.suppliers'), href: '/inventory/suppliers' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('inventory.suppliers')} />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{t('inventory.suppliers')}</h1>
                        <p className="text-sm text-muted-foreground">{t('inventory.suppliersDesc')}</p>
                    </div>
                    <Button onClick={() => { setEditingSupplier(null); setDialogOpen(true); }} className="gap-2">
                        <Plus className="h-4 w-4" />
                        {t('inventory.addSupplier')}
                    </Button>
                </div>

                <div className="relative max-w-sm">
                    <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        className="ps-9"
                        placeholder={t('inventory.searchSuppliers')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <SupplierTable
                    suppliers={filtered}
                    onEdit={(supplier) => { setEditingSupplier(supplier); setDialogOpen(true); }}
                    onDelete={handleDelete}
                />
            </div>

            <SupplierFormDialog
                open={dialogOpen}
                onOpenChange={(o: boolean) => {
                    setDialogOpen(o);
                    if (!o) setEditingSupplier(null);
                }}
                supplier={editingSupplier}
                onSave={handleSave}
                categories={categories}
            />
        </AppLayout>
    );
}
