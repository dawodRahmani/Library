import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Users, Wallet } from 'lucide-react';
import { Link } from '@inertiajs/react';
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
import type { Employee } from '../types';

interface EmployeeTableProps {
    employees: Employee[];
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
}

const roleColors: Record<string, string> = {
    manager: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
    waiter: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    chef: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
    cashier: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
};

export function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
    const { t } = useTranslation();

    if (employees.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Users className="size-12 mb-3 opacity-30" />
                <p className="text-lg font-medium">{t('employees.noEmployees')}</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-semibold">{t('employees.name')}</TableHead>
                        <TableHead className="font-semibold">{t('employees.role')}</TableHead>
                        <TableHead className="font-semibold">{t('employees.phone')}</TableHead>
                        <TableHead className="font-semibold">{t('employees.hireDate')}</TableHead>
                        <TableHead className="font-semibold">{t('employees.status')}</TableHead>
                        <TableHead className="font-semibold text-center">{t('common.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.map((employee) => (
                        <TableRow key={employee.id} className="group">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-purple-600 text-white text-sm font-bold shadow-sm">
                                        {employee.name.charAt(0)}
                                    </div>
                                    <span className="font-medium">{employee.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={`text-xs font-medium ${roleColors[employee.role] || ''}`}
                                >
                                    {t(`employees.roles.${employee.role}`)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className="text-muted-foreground" dir="ltr">
                                    {employee.phone}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">{employee.hire_date}</span>
                            </TableCell>
                            <TableCell>
                                {employee.is_active ? (
                                    <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700">
                                        {t('employees.active')}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-red-600 border-red-200 dark:text-red-400 dark:border-red-700">
                                        {t('employees.inactive')}
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        asChild
                                        className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                    >
                                        <Link href={`/employees/${employee.id}/salary`}>
                                            <Wallet className="size-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(employee)}
                                        className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                    >
                                        <Edit className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(employee)}
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
