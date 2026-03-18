import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { RoleData } from '../types';
import { formatShamsiDate } from '@/lib/date';

interface RoleTableProps {
    roles: RoleData[];
    onEdit: (role: RoleData) => void;
    onDelete: (role: RoleData) => void;
    onAssignPermissions: (role: RoleData) => void;
}

export function RoleTable({ roles, onEdit, onDelete, onAssignPermissions }: RoleTableProps) {
    const { t } = useTranslation();

    if (roles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Shield className="size-12 mb-3 opacity-30" />
                <p className="text-lg font-medium">{t('roles.noRoles')}</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-semibold">{t('roles.roleName')}</TableHead>
                        <TableHead className="font-semibold">{t('roles.permissionCount')}</TableHead>
                        <TableHead className="font-semibold">{t('roles.usersCount')}</TableHead>
                        <TableHead className="font-semibold">{t('roles.createdAt')}</TableHead>
                        <TableHead className="font-semibold text-center">{t('users.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map((role) => (
                        <TableRow key={role.id} className="group">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-emerald-500 text-white shadow-sm">
                                        <Shield className="size-4" />
                                    </div>
                                    <span className="font-medium">{t(`users.${role.name}`, role.name)}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700 cursor-pointer hover:bg-purple-100"
                                    onClick={() => onAssignPermissions(role)}
                                >
                                    {role.permissions.length} {t('roles.permissions')}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">
                                    {role.users_count}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground" dir="ltr">
                                    {formatShamsiDate(role.created_at)}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onAssignPermissions(role)}
                                        className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                        title={t('roles.assignPermissions')}
                                    >
                                        <Shield className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(role)}
                                        className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                    >
                                        <Edit className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(role)}
                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
