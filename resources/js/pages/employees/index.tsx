import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Plus, Users as UsersIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';
import { EmployeeTable } from '@/modules/employees/components/employee-table';
import { EmployeeFormDialog } from '@/modules/employees/components/employee-form-dialog';
import { EmployeeDeleteDialog } from '@/modules/employees/components/employee-delete-dialog';
import { EmployeeFilters } from '@/modules/employees/components/employee-filters';
import { mockEmployees } from '@/data/mock';
import type { Employee, EmployeeFormData } from '@/modules/employees/types';

export default function EmployeesIndex() {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.employees'), href: '/employees' },
    ];

    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

    const filteredEmployees = useMemo(() => {
        return mockEmployees.filter((emp) => {
            const matchesSearch =
                !search ||
                emp.name.toLowerCase().includes(search.toLowerCase()) ||
                emp.phone.includes(search);
            const matchesRole =
                roleFilter === 'all' || emp.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [search, roleFilter]);

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setFormOpen(true);
    };

    const handleDelete = (employee: Employee) => {
        setDeletingEmployee(employee);
        setDeleteOpen(true);
    };

    const handleFormSubmit = (_data: EmployeeFormData) => {
        setFormOpen(false);
        setEditingEmployee(null);
    };

    const handleDeleteConfirm = () => {
        setDeleteOpen(false);
        setDeletingEmployee(null);
    };

    const handleAddNew = () => {
        setEditingEmployee(null);
        setFormOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('employees.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-purple-600 text-white shadow-md">
                            <UsersIcon className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{t('employees.title')}</h1>
                            <p className="text-sm text-muted-foreground">
                                {t('common.showing')} {filteredEmployees.length} {t('common.of')} {mockEmployees.length} {t('common.results')}
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={handleAddNew}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
                    >
                        <Plus className="size-4 me-2" />
                        {t('employees.addEmployee')}
                    </Button>
                </div>

                {/* Filters */}
                <EmployeeFilters
                    search={search}
                    onSearchChange={setSearch}
                    roleFilter={roleFilter}
                    onRoleFilterChange={setRoleFilter}
                />

                {/* Table */}
                <EmployeeTable
                    employees={filteredEmployees}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {filteredEmployees.length > 0 && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                        {t('common.showing')} {filteredEmployees.length} {t('common.of')} {mockEmployees.length} {t('common.results')}
                    </div>
                )}
            </div>

            <EmployeeFormDialog
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setEditingEmployee(null);
                }}
                onSubmit={handleFormSubmit}
                employee={editingEmployee}
            />

            <EmployeeDeleteDialog
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setDeletingEmployee(null);
                }}
                onConfirm={handleDeleteConfirm}
                employee={deletingEmployee}
            />
        </AppLayout>
    );
}
