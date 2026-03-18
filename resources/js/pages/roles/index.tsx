import { useState, useMemo } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
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

interface Props extends Record<string, unknown> {
    roles: RoleData[];
    allPermissions: Permission[];
}

export default function RolesIndex() {
    const { t } = useTranslation();
    const { roles, allPermissions } = usePage<Props>().props;

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
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const filteredRoles = useMemo(() => {
        if (!search) return roles;
        return roles.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));
    }, [roles, search]);

    const handleFormSubmit = (data: { name: string }) => {
        setProcessing(true);
        if (editingRole) {
            router.put(`/roles/${editingRole.id}`, { ...data }, {
                onSuccess: () => { setFormOpen(false); setEditingRole(null); setErrors({}); },
                onError: (errs) => setErrors(errs),
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post('/roles', { ...data }, {
                onSuccess: () => { setFormOpen(false); setErrors({}); },
                onError: (errs) => setErrors(errs),
                onFinish: () => setProcessing(false),
            });
        }
    };

    const handleDeleteConfirm = () => {
        if (!deletingRole) return;
        router.delete(`/roles/${deletingRole.id}`, {
            onSuccess: () => { setDeleteOpen(false); setDeletingRole(null); },
            onFinish: () => setProcessing(false),
        });
    };

    const handleAssignPermissions = (permissionIds: number[]) => {
        if (!assigningRole) return;
        setProcessing(true);
        router.patch(`/roles/${assigningRole.id}/permissions`, { permissions: permissionIds }, {
            onSuccess: () => { setAssignOpen(false); setAssigningRole(null); },
            onFinish: () => setProcessing(false),
        });
    };

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
                onClose={() => { setFormOpen(false); setEditingRole(null); setErrors({}); }}
                onSubmit={handleFormSubmit}
                role={editingRole}
                processing={processing}
                errors={errors}
            />

            {/* Delete Dialog */}
            <UserDeleteDialog
                open={deleteOpen}
                onClose={() => { setDeleteOpen(false); setDeletingRole(null); }}
                onConfirm={handleDeleteConfirm}
                user={deletingRole ? {
                    ...deletingRole,
                    email: '',
                    email_verified_at: null,
                    is_active: true,
                    roles: [],
                    name: t(`users.${deletingRole.name}`, deletingRole.name),
                } : null}
            />

            {/* Assign Permissions Dialog */}
            <AssignPermissionsDialog
                open={assignOpen}
                onClose={() => { setAssignOpen(false); setAssigningRole(null); }}
                onSubmit={handleAssignPermissions}
                role={assigningRole}
                allPermissions={allPermissions}
                processing={processing}
            />
        </AppLayout>
    );
}
