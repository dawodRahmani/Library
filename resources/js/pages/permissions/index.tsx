import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { KeyRound, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
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
import type { PermissionData } from '@/modules/permissions/types';

const permissionGroups = [
    'users', 'orders', 'menu', 'tables', 'kitchen',
    'inventory', 'expenses', 'employees', 'salaries',
    'reports', 'finance', 'settings',
];

interface Props extends Record<string, unknown> {
    permissions: PermissionData[];
}

export default function PermissionsIndex() {
    const { t } = useTranslation();
    const { permissions } = usePage<Props>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.permissions'), href: '/permissions' },
    ];

    const [search, setSearch] = useState('');
    const [groupFilter, setGroupFilter] = useState('all');

    const filteredPermissions = useMemo(() => {
        return permissions.filter((p) => {
            const matchesSearch =
                !search || p.name.toLowerCase().includes(search.toLowerCase());
            const matchesGroup = groupFilter === 'all' || p.group === groupFilter;
            return matchesSearch && matchesGroup;
        });
    }, [permissions, search, groupFilter]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('permissions.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
                        <KeyRound className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">{t('permissions.title')}</h1>
                        <p className="text-sm text-muted-foreground">
                            {filteredPermissions.length} {t('common.of')} {permissions.length} {t('common.results')}
                        </p>
                    </div>
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

                {/* Table (read-only) */}
                <PermissionTable permissions={filteredPermissions} />
            </div>
        </AppLayout>
    );
}
