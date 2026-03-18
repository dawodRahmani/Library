import { useState, useMemo } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Plus, Users as UsersIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';
import { UserTable } from '@/modules/users/components/user-table';
import { UserFormDialog } from '@/modules/users/components/user-form-dialog';
import { UserDeleteDialog } from '@/modules/users/components/user-delete-dialog';
import { UserFilters } from '@/modules/users/components/user-filters';
import type { UserData, Role, UserFormData } from '@/modules/users/types';

interface Props extends Record<string, unknown> {
    users: UserData[];
    roles: Role[];
}

export default function UsersIndex() {
    const { t } = useTranslation();
    const { users, roles } = usePage<Props>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.users'), href: '/users' },
    ];

    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserData | null>(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                !search ||
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase());
            const matchesRole =
                roleFilter === 'all' ||
                user.roles.some((r) => r.name === roleFilter);
            return matchesSearch && matchesRole;
        });
    }, [users, search, roleFilter]);

    const handleEdit = (user: UserData) => {
        setEditingUser(user);
        setFormOpen(true);
    };

    const handleDelete = (user: UserData) => {
        setDeletingUser(user);
        setDeleteOpen(true);
    };

    const handleFormSubmit = (data: UserFormData) => {
        setProcessing(true);
        if (editingUser) {
            router.put(`/users/${editingUser.id}`, { ...data }, {
                onSuccess: () => { setFormOpen(false); setEditingUser(null); setErrors({}); },
                onError: (errs) => setErrors(errs),
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post('/users', { ...data }, {
                onSuccess: () => { setFormOpen(false); setErrors({}); },
                onError: (errs) => setErrors(errs),
                onFinish: () => setProcessing(false),
            });
        }
    };

    const handleDeleteConfirm = () => {
        if (!deletingUser) return;
        router.delete(`/users/${deletingUser.id}`, {
            onSuccess: () => { setDeleteOpen(false); setDeletingUser(null); },
        });
    };

    const handleAddNew = () => {
        setEditingUser(null);
        setErrors({});
        setFormOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('users.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-purple-600 text-white shadow-md">
                            <UsersIcon className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{t('users.title')}</h1>
                            <p className="text-sm text-muted-foreground">
                                {t('common.showing')} {filteredUsers.length} {t('common.of')} {users.length} {t('common.results')}
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={handleAddNew}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
                    >
                        <Plus className="size-4 me-2" />
                        {t('users.addUser')}
                    </Button>
                </div>

                {/* Filters */}
                <UserFilters
                    search={search}
                    onSearchChange={setSearch}
                    roleFilter={roleFilter}
                    onRoleFilterChange={setRoleFilter}
                    roles={roles}
                />

                {/* Table */}
                <UserTable
                    users={filteredUsers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* Form Dialog */}
            <UserFormDialog
                open={formOpen}
                onClose={() => { setFormOpen(false); setEditingUser(null); setErrors({}); }}
                onSubmit={handleFormSubmit}
                user={editingUser}
                roles={roles}
                processing={processing}
                errors={errors}
            />

            {/* Delete Dialog */}
            <UserDeleteDialog
                open={deleteOpen}
                onClose={() => { setDeleteOpen(false); setDeletingUser(null); }}
                onConfirm={handleDeleteConfirm}
                user={deletingUser}
            />
        </AppLayout>
    );
}
