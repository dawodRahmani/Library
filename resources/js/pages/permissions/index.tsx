import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Plus, KeyRound, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';
import { PermissionTable } from '@/modules/permissions/components/permission-table';
import { PermissionFormDialog } from '@/modules/permissions/components/permission-form-dialog';
import { UserDeleteDialog } from '@/modules/users/components/user-delete-dialog';
import type { PermissionData, PermissionFormData } from '@/modules/permissions/types';

const permissionGroups = ['users', 'orders', 'menu', 'tables', 'expenses', 'employees', 'salaries', 'reports', 'settings'];

// Demo data
const demoPermissions: PermissionData[] = [
    { id: 1, name: 'users.view', group: 'users', roles: [{ id: 1, name: 'admin' }, { id: 2, name: 'manager' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 2, name: 'users.create', group: 'users', roles: [{ id: 1, name: 'admin' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 3, name: 'users.edit', group: 'users', roles: [{ id: 1, name: 'admin' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 4, name: 'users.delete', group: 'users', roles: [{ id: 1, name: 'admin' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 5, name: 'orders.view', group: 'orders', roles: [{ id: 1, name: 'admin' }, { id: 2, name: 'manager' }, { id: 3, name: 'waiter' }, { id: 4, name: 'chef' }, { id: 5, name: 'cashier' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 6, name: 'orders.create', group: 'orders', roles: [{ id: 1, name: 'admin' }, { id: 2, name: 'manager' }, { id: 3, name: 'waiter' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 7, name: 'orders.edit', group: 'orders', roles: [{ id: 1, name: 'admin' }, { id: 2, name: 'manager' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 8, name: 'orders.delete', group: 'orders', roles: [{ id: 1, name: 'admin' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 9, name: 'menu.view', group: 'menu', roles: [{ id: 1, name: 'admin' }, { id: 2, name: 'manager' }, { id: 3, name: 'waiter' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 10, name: 'menu.create', group: 'menu', roles: [{ id: 1, name: 'admin' }, { id: 2, name: 'manager' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 11, name: 'menu.edit', group: 'menu', roles: [{ id: 1, name: 'admin' }, { id: 2, name: 'manager' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 12, name: 'menu.delete', group: 'menu', roles: [{ id: 1, name: 'admin' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 13, name: 'tables.view', group: 'tables', roles: [{ id: 1, name: 'admin' }, { id: 2, name: 'manager' }, { id: 3, name: 'waiter' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 14, name: 'tables.create', group: 'tables', roles: [{ id: 1, name: 'admin' }, { id: 2, name: 'manager' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 15, name: 'expenses.view', group: 'expenses', roles: [{ id: 1, name: 'admin' }, { id: 2, name: 'manager' }, { id: 5, name: 'cashier' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 16, name: 'expenses.create', group: 'expenses', roles: [{ id: 1, name: 'admin' }, { id: 2, name: 'manager' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 17, name: 'reports.view', group: 'reports', roles: [{ id: 1, name: 'admin' }, { id: 2, name: 'manager' }, { id: 5, name: 'cashier' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 18, name: 'settings.view', group: 'settings', roles: [{ id: 1, name: 'admin' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    { id: 19, name: 'settings.edit', group: 'settings', roles: [{ id: 1, name: 'admin' }], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
];

export default function PermissionsIndex() {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.permissions'), href: '/permissions' },
    ];

    const [search, setSearch] = useState('');
    const [groupFilter, setGroupFilter] = useState('all');
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingPerm, setEditingPerm] = useState<PermissionData | null>(null);
    const [deletingPerm, setDeletingPerm] = useState<PermissionData | null>(null);

    const filteredPermissions = useMemo(() => {
        return demoPermissions.filter((p) => {
            const matchesSearch =
                !search || p.name.toLowerCase().includes(search.toLowerCase());
            const matchesGroup = groupFilter === 'all' || p.group === groupFilter;
            return matchesSearch && matchesGroup;
        });
    }, [search, groupFilter]);

    const handleFormSubmit = (_data: PermissionFormData) => {
        // TODO: backend
        setFormOpen(false);
        setEditingPerm(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('permissions.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
                            <KeyRound className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{t('permissions.title')}</h1>
                            <p className="text-sm text-muted-foreground">
                                {filteredPermissions.length} {t('common.of')} {demoPermissions.length} {t('common.results')}
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => { setEditingPerm(null); setFormOpen(true); }}
                        className="bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/20"
                    >
                        <Plus className="size-4 me-2" />
                        {t('permissions.addPermission')}
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder={t('permissions.searchPlaceholder')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="ps-10 h-10 bg-card"
                            dir="ltr"
                        />
                    </div>
                    <Select value={groupFilter} onValueChange={setGroupFilter}>
                        <SelectTrigger className="h-10 w-full sm:w-[180px] bg-card">
                            <SelectValue placeholder={t('permissions.allGroups')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('permissions.allGroups')}</SelectItem>
                            {permissionGroups.map((g) => (
                                <SelectItem key={g} value={g}>
                                    {t(`permissions.groups.${g}`, g)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <PermissionTable
                    permissions={filteredPermissions}
                    onEdit={(p) => { setEditingPerm(p); setFormOpen(true); }}
                    onDelete={(p) => { setDeletingPerm(p); setDeleteOpen(true); }}
                />
            </div>

            {/* Form Dialog */}
            <PermissionFormDialog
                open={formOpen}
                onClose={() => { setFormOpen(false); setEditingPerm(null); }}
                onSubmit={handleFormSubmit}
                permission={editingPerm}
                groups={permissionGroups}
            />

            {/* Delete Dialog */}
            <UserDeleteDialog
                open={deleteOpen}
                onClose={() => { setDeleteOpen(false); setDeletingPerm(null); }}
                onConfirm={() => { setDeleteOpen(false); setDeletingPerm(null); }}
                user={deletingPerm ? { ...deletingPerm, email: '', email_verified_at: null, is_active: true, roles: [], name: deletingPerm.name } : null}
            />
        </AppLayout>
    );
}
