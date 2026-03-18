import { useTranslation } from 'react-i18next';
import { KeyRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { PermissionData } from '../types';

interface PermissionTableProps {
    permissions: PermissionData[];
}

export function PermissionTable({ permissions }: PermissionTableProps) {
    const { t } = useTranslation();

    if (permissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <KeyRound className="size-12 mb-3 opacity-30" />
                <p className="text-lg font-medium">{t('permissions.noPermissions')}</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-semibold">{t('permissions.permissionName')}</TableHead>
                        <TableHead className="font-semibold">{t('permissions.group')}</TableHead>
                        <TableHead className="font-semibold">{t('permissions.assignedToRoles')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {permissions.map((perm) => (
                        <TableRow key={perm.id} className="group">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
                                        <KeyRound className="size-3.5" />
                                    </div>
                                    <span className="font-medium text-sm">{perm.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="bg-muted/50 text-xs">
                                    {t(`permissions.groups.${perm.group}`, perm.group)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {perm.roles.map((role) => (
                                        <Badge
                                            key={role.id}
                                            variant="outline"
                                            className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700"
                                        >
                                            {t(`users.${role.name}`, role.name)}
                                        </Badge>
                                    ))}
                                    {perm.roles.length === 0 && (
                                        <span className="text-xs text-muted-foreground">—</span>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
