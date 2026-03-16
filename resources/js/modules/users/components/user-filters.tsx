import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Role } from '../types';

interface UserFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    roleFilter: string;
    onRoleFilterChange: (value: string) => void;
    roles: Role[];
}

export function UserFilters({
    search,
    onSearchChange,
    roleFilter,
    onRoleFilterChange,
    roles,
}: UserFiltersProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    placeholder={t('users.searchPlaceholder')}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="ps-10 h-10 bg-card"
                />
            </div>

            {/* Role filter */}
            <Select value={roleFilter} onValueChange={onRoleFilterChange}>
                <SelectTrigger className="h-10 w-full sm:w-[180px] bg-card">
                    <SelectValue placeholder={t('users.allRoles')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{t('users.allRoles')}</SelectItem>
                    {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                            {t(`users.${role.name}`, role.name)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
