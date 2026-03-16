import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Plus, Shield, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BreadcrumbItem } from '@/types';
import { RoleTable } from '@/modules/roles/components/role-table';
import { RoleFormDialog } from '@/modules/roles/components/role-form-dialog';
import { AssignPermissionsDialog } from '@/modules/roles/components/assign-permissions-dialog';
import { UserDeleteDialog } from '@/modules/users/components/user-delete-dialog';
import type { RoleData, Permission } from '@/modules/roles/types';

// Demo permissions
const demoPermissions: Permission[] = [
    { id: 1, name: 'users.view', group: 'users' },
    { id: 2, name: 'users.create', group: 'users' },
    { id: 3, name: 'users.edit', group: 'users' },
    { id: 4, name: 'users.delete', group: 'users' },
    { id: 5, name: 'orders.view', group: 'orders' },
    { id: 6, name: 'orders.create', group: 'orders' },
    { id: 7, name: 'orders.edit', group: 'orders' },
    { id: 8, name: 'orders.delete', group: 'orders' },
    { id: 9, name: 'menu.view', group: 'menu' },
    { id: 10, name: 'menu.create', group: 'menu' },
    { id: 11, name: 'menu.edit', group: 'menu' },
    { id: 12, name: 'menu.delete', group: 'menu' },
    { id: 13, name: 'tables.view', group: 'tables' },
    { id: 14, name: 'tables.create', group: 'tables' },
    { id: 15, name: 'tables.edit', group: 'tables' },
    { id: 16, name: 'tables.delete', group: 'tables' },
    { id: 17, name: 'expenses.view', group: 'expenses' },
    { id: 18, name: 'expenses.create', group: 'expenses' },
    { id: 19, name: 'expenses.edit', group: 'expenses' },
    { id: 20, name: 'expenses.delete', group: 'expenses' },
    { id: 21, name: 'employees.view', group: 'employees' },
    { id: 22, name: 'employees.create', group: 'employees' },
    { id: 23, name: 'employees.edit', group: 'employees' },
    { id: 24, name: 'employees.delete', group: 'employees' },
    { id: 25, name: 'salaries.view', group: 'salaries' },
    { id: 26, name: 'salaries.create', group: 'salaries' },
    { id: 27, name: 'reports.view', group: 'reports' },
    { id: 28, name: 'settings.view', group: 'settings' },
    { id: 29, name: 'settings.edit', group: 'settings' },
];

// Demo roles
const demoRoles: RoleData[] = [
    {
        id: 1,
        name: 'admin',
        permissions: demoPermissions,
        users_count: 1,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
    },
    {
        id: 2,
        name: 'manager',
        permissions: demoPermissions.filter((p) => !p.name.includes('delete') && p.group !== 'settings'),
        users_count: 1,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
    },
    {
        id: 3,
        name: 'waiter',
        permissions: demoPermissions.filter((p) =>
            ['orders', 'tables', 'menu'].includes(p.group) && ['view', 'create'].some((a) => p.name.includes(a)),
        ),
        users_count: 2,
        created_at: '2026-01-15T00:00:00Z',
        updated_at: '2026-01-15T00:00:00Z',
    },
    {
        id: 4,
        name: 'chef',
        permissions: demoPermissions.filter((p) => p.group === 'orders' && p.name.includes('view')),
        users_count: 1,
        created_at: '2026-02-01T00:00:00Z',
        updated_at: '2026-02-01T00:00:00Z',
    },
    {
        id: 5,
        name: 'cashier',
        permissions: demoPermissions.filter((p) =>
            ['orders', 'expenses', 'reports'].includes(p.group),
        ),
        users_count: 1,
        created_at: '2026-02-15T00:00:00Z',
        updated_at: '2026-02-15T00:00:00Z',
    },
];

export default function RolesIndex() {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.roles'), href: '/roles' },
    ];

    const [search, setSearch] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleData | null>(null);
    const [deletingRole, setDeletingRole] = useState<RoleData | null>(null);
    const [assigningRole, setAssigningRole] = useState<RoleData | null>(null);

    const filteredRoles = useMemo(() => {
        if (!search) return demoRoles;
        return demoRoles.filter((r) =>
            r.name.toLowerCase().includes(search.toLowerCase()),
        );
    }, [search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('roles.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 text-white shadow-md">
                            <Shield className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{t('roles.title')}</h1>
                            <p className="text-sm text-muted-foreground">
                                {filteredRoles.length} {t('common.results')}
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => { setEditingRole(null); setFormOpen(true); }}
                        className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20"
                    >
                        <Plus className="size-4 me-2" />
                        {t('roles.addRole')}
                    </Button>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder={t('roles.searchPlaceholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="ps-10 h-10 bg-card"
                    />
                </div>

                {/* Table */}
                <RoleTable
                    roles={filteredRoles}
                    onEdit={(role) => { setEditingRole(role); setFormOpen(true); }}
                    onDelete={(role) => { setDeletingRole(role); setDeleteOpen(true); }}
                    onAssignPermissions={(role) => { setAssigningRole(role); setAssignOpen(true); }}
                />
            </div>

            {/* Form Dialog */}
            <RoleFormDialog
                open={formOpen}
                onClose={() => { setFormOpen(false); setEditingRole(null); }}
                onSubmit={() => { setFormOpen(false); setEditingRole(null); }}
                role={editingRole}
            />

            {/* Delete Dialog - reusing user delete dialog structure */}
            <UserDeleteDialog
                open={deleteOpen}
                onClose={() => { setDeleteOpen(false); setDeletingRole(null); }}
                onConfirm={() => { setDeleteOpen(false); setDeletingRole(null); }}
                user={deletingRole ? { ...deletingRole, email: '', email_verified_at: null, is_active: true, roles: [], name: t(`users.${deletingRole.name}`, deletingRole.name) } : null}
            />

            {/* Assign Permissions Dialog */}
            <AssignPermissionsDialog
                open={assignOpen}
                onClose={() => { setAssignOpen(false); setAssigningRole(null); }}
                onSubmit={() => { setAssignOpen(false); setAssigningRole(null); }}
                role={assigningRole}
                allPermissions={demoPermissions}
            />
        </AppLayout>
    );
}
