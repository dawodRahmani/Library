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

interface Role { id: number; name: string; }

interface EmployeeFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    roleFilter: string;
    onRoleFilterChange: (value: string) => void;
    roles: Role[];
}

export function EmployeeFilters({
    search,
    onSearchChange,
    roleFilter,
    onRoleFilterChange,
    roles,
}: EmployeeFiltersProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    placeholder={t('employees.searchPlaceholder')}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="ps-10 h-10 bg-card"
                />
            </div>

            <Select value={roleFilter} onValueChange={onRoleFilterChange}>
                <SelectTrigger className="h-10 w-full sm:w-[180px] bg-card">
                    <SelectValue placeholder={t('employees.allRoles')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{t('employees.allRoles')}</SelectItem>
                    {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                            {role.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
