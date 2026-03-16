import { useTranslation } from 'react-i18next';
import { Edit, Trash2, ShieldCheck } from 'lucide-react';
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
import type { UserData } from '../types';

interface UserTableProps {
    users: UserData[];
    onEdit: (user: UserData) => void;
    onDelete: (user: UserData) => void;
}

const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
    manager: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700',
    waiter: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    chef: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
    cashier: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
};

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
    const { t } = useTranslation();

    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <ShieldCheck className="size-12 mb-3 opacity-30" />
                <p className="text-lg font-medium">{t('users.noUsers')}</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-semibold">{t('users.name')}</TableHead>
                        <TableHead className="font-semibold">{t('users.email')}</TableHead>
                        <TableHead className="font-semibold">{t('users.role')}</TableHead>
                        <TableHead className="font-semibold">{t('users.status')}</TableHead>
                        <TableHead className="font-semibold">{t('users.createdAt')}</TableHead>
                        <TableHead className="font-semibold text-center">{t('users.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="group">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-purple-600 text-white text-sm font-bold shadow-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium">{user.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-muted-foreground" dir="ltr">
                                    {user.email}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {user.roles.map((role) => (
                                        <Badge
                                            key={role.id}
                                            variant="outline"
                                            className={`text-xs font-medium ${roleColors[role.name] || 'bg-gray-100 text-gray-700'}`}
                                        >
                                            {t(`users.${role.name}`, role.name)}
                                        </Badge>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell>
                                {user.is_active ? (
                                    <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700">
                                        {t('users.active')}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-red-600 border-red-200 dark:text-red-400 dark:border-red-700">
                                        {t('users.inactive')}
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground" dir="ltr">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(user)}
                                        className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                    >
                                        <Edit className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(user)}
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
