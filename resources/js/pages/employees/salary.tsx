import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Plus, Wallet, ArrowRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';
import { SalaryTable } from '@/modules/salaries/components/salary-table';
import { SalaryFormDialog } from '@/modules/salaries/components/salary-form-dialog';
import { SalaryDeleteDialog } from '@/modules/salaries/components/salary-delete-dialog';
import { SalaryPayslip } from '@/modules/salaries/components/salary-payslip';
import { router, usePage } from '@inertiajs/react';
import type { Salary, SalaryFormData } from '@/modules/salaries/types';

interface PageEmployee {
    id: number;
    name: string;
    role: string;
    phone: string;
    hire_date: string | null;
    is_active: boolean;
    base_salary: number;
}

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

interface Props extends Record<string, unknown> {
    employee: PageEmployee;
    salaries: Salary[];
}

export default function SalaryPage() {
    const { t } = useTranslation();
    const { employee, salaries } = usePage<Props>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.employees'), href: '/employees' },
        { title: employee.name, href: `/employees/${employee.id}/salary` },
    ];

    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [payslipOpen, setPayslipOpen] = useState(false);
    const [editingSalary, setEditingSalary] = useState<Salary | null>(null);
    const [deletingSalary, setDeletingSalary] = useState<Salary | null>(null);
    const [payslipSalary, setPayslipSalary] = useState<Salary | null>(null);

    const totalPaid = useMemo(() => {
        return salaries.reduce((sum, s) => sum + s.amount, 0);
    }, [salaries]);

    const handleEdit = (salary: Salary) => {
        setEditingSalary(salary);
        setFormOpen(true);
    };

    const handleDelete = (salary: Salary) => {
        setDeletingSalary(salary);
        setDeleteOpen(true);
    };

    const handleFormSubmit = (data: SalaryFormData) => {
        if (editingSalary) {
            router.patch(`/salaries/${editingSalary.id}`, { ...data }, {
                onSuccess: () => { setFormOpen(false); setEditingSalary(null); },
            });
        } else {
            router.post('/salaries', { ...data, employee_id: employee.id }, {
                onSuccess: () => setFormOpen(false),
            });
        }
    };

    const handleDeleteConfirm = () => {
        if (!deletingSalary) return;
        router.delete(`/salaries/${deletingSalary.id}`, {
            onSuccess: () => { setDeleteOpen(false); setDeletingSalary(null); },
        });
    };

    const handleAddNew = () => {
        setEditingSalary(null);
        setFormOpen(true);
    };

    const handlePayslip = (salary: Salary) => {
        setPayslipSalary(salary);
        setPayslipOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('salaries.title')} — ${employee.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-purple-600 text-white shadow-md">
                            <Wallet className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{t('salaries.salaryHistory')}</h1>
                            <p className="text-sm text-muted-foreground">{employee.name}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Back button */}
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/employees">
                                <ArrowRight className="size-4 me-2" />
                                {t('salaries.backToEmployees')}
                            </Link>
                        </Button>

                        {/* Total badge */}
                        <div className="rounded-xl border bg-card px-4 py-2 shadow-sm">
                            <p className="text-xs text-muted-foreground">{t('salaries.totalPaid')}</p>
                            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(totalPaid)}</p>
                        </div>

                        <Button
                            onClick={handleAddNew}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
                        >
                            <Plus className="size-4 me-2" />
                            {t('salaries.addSalary')}
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <SalaryTable
                    salaries={salaries}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPayslip={handlePayslip}
                />

                {salaries.length > 0 && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                        {t('common.showing')} {salaries.length} {t('common.results')}
                    </div>
                )}
            </div>

            <SalaryFormDialog
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setEditingSalary(null);
                }}
                onSubmit={handleFormSubmit}
                salary={editingSalary}
                employeeId={employee.id}
                employeeName={employee.name}
                baseSalary={employee.base_salary}
            />

            <SalaryPayslip
                open={payslipOpen}
                onClose={() => setPayslipOpen(false)}
                salary={payslipSalary}
                employeeName={employee.name}
                employeeRole={employee.role}
            />

            <SalaryDeleteDialog
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setDeletingSalary(null);
                }}
                onConfirm={handleDeleteConfirm}
                salary={deletingSalary}
            />
        </AppLayout>
    );
}
