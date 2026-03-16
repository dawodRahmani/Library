import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
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

// Demo data — will be replaced by backend props
const demoRoles: Role[] = [
    { id: 1, name: 'admin' },
    { id: 2, name: 'manager' },
    { id: 3, name: 'waiter' },
    { id: 4, name: 'chef' },
    { id: 5, name: 'cashier' },
];

const demoUsers: UserData[] = [
    {
        id: 1,
        name: 'احمد رحمانی',
        email: 'ahmad@restaurant.com',
        email_verified_at: '2026-01-01',
        is_active: true,
        roles: [{ id: 1, name: 'admin' }],
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
    },
    {
        id: 2,
        name: 'محمد علی',
        email: 'mali@restaurant.com',
        email_verified_at: '2026-01-15',
        is_active: true,
        roles: [{ id: 2, name: 'manager' }],
        created_at: '2026-01-15T00:00:00Z',
        updated_at: '2026-01-15T00:00:00Z',
    },
    {
        id: 3,
        name: 'فرهاد حسینی',
        email: 'farhad@restaurant.com',
        email_verified_at: '2026-02-01',
        is_active: true,
        roles: [{ id: 3, name: 'waiter' }],
        created_at: '2026-02-01T00:00:00Z',
        updated_at: '2026-02-01T00:00:00Z',
    },
    {
        id: 4,
        name: 'کریم احمدی',
        email: 'karim@restaurant.com',
        email_verified_at: '2026-02-10',
        is_active: true,
        roles: [{ id: 4, name: 'chef' }],
        created_at: '2026-02-10T00:00:00Z',
        updated_at: '2026-02-10T00:00:00Z',
    },
    {
        id: 5,
        name: 'نادیا صمدی',
        email: 'nadia@restaurant.com',
        email_verified_at: null,
        is_active: false,
        roles: [{ id: 5, name: 'cashier' }],
        created_at: '2026-03-01T00:00:00Z',
        updated_at: '2026-03-01T00:00:00Z',
    },
];

export default function UsersIndex() {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.users'), href: '/users' },
    ];

    // State
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserData | null>(null);

    // Filter users
    const filteredUsers = useMemo(() => {
        return demoUsers.filter((user) => {
            const matchesSearch =
                !search ||
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase());
            const matchesRole =
                roleFilter === 'all' ||
                user.roles.some((r) => r.name === roleFilter);
            return matchesSearch && matchesRole;
        });
    }, [search, roleFilter]);

    const handleEdit = (user: UserData) => {
        setEditingUser(user);
        setFormOpen(true);
    };

    const handleDelete = (user: UserData) => {
        setDeletingUser(user);
        setDeleteOpen(true);
    };

    const handleFormSubmit = (_data: UserFormData) => {
        // TODO: Inertia.post/put to backend
        setFormOpen(false);
        setEditingUser(null);
    };

    const handleDeleteConfirm = () => {
        // TODO: Inertia.delete to backend
        setDeleteOpen(false);
        setDeletingUser(null);
    };

    const handleAddNew = () => {
        setEditingUser(null);
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
                                {t('common.showing')} {filteredUsers.length} {t('common.of')} {demoUsers.length} {t('common.results')}
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
                    roles={demoRoles}
                />

                {/* Table */}
                <UserTable
                    users={filteredUsers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* Pagination placeholder */}
                {filteredUsers.length > 0 && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                        {t('common.showing')} {filteredUsers.length} {t('common.of')} {demoUsers.length} {t('common.results')}
                    </div>
                )}
            </div>

            {/* Form Dialog */}
            <UserFormDialog
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setEditingUser(null);
                }}
                onSubmit={handleFormSubmit}
                user={editingUser}
                roles={demoRoles}
            />

            {/* Delete Dialog */}
            <UserDeleteDialog
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setDeletingUser(null);
                }}
                onConfirm={handleDeleteConfirm}
                user={deletingUser}
            />
        </AppLayout>
    );
}
