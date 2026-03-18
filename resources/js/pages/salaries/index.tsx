import { useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Wallet } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';
import { SalaryOverviewSummary } from '@/modules/salaries/components/salary-overview-summary';
import { SalaryOverviewTable } from '@/modules/salaries/components/salary-overview-table';
import { currentShamsiMonth, formatShamsiMonthLabel } from '@/lib/date';
import type { Salary } from '@/modules/salaries/types';

interface PageEmployee {
    id: number;
    name: string;
    role: string;
    is_active: boolean;
    base_salary: number;
}

interface Props extends Record<string, unknown> {
    employees: PageEmployee[];
    salaries: Salary[];
    selectedMonth: string;
    months: string[];
}

export default function SalariesPage() {
    const { t } = useTranslation();
    const { employees, salaries, selectedMonth, months } = usePage<Props>().props;

    // If backend defaulted to a Gregorian month (year > 2000), redirect with current Shamsi month
    useEffect(() => {
        const year = parseInt(selectedMonth?.split('-')[0] ?? '0');
        if (year > 2000) {
            router.get('/salaries', { month: currentShamsiMonth() }, { replace: true });
        }
    }, []);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.salaries'), href: '/salaries' },
    ];

    const handleMonthChange = (month: string) => {
        router.get('/salaries', { month }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('salaries.monthlyOverview')} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md">
                            <Wallet className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{t('salaries.monthlyOverview')}</h1>
                            <p className="text-sm text-muted-foreground">{formatShamsiMonthLabel(selectedMonth)}</p>
                        </div>
                    </div>

                    {/* Month selector */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {months.map((m) => (
                            <Button
                                key={m}
                                variant={selectedMonth === m ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleMonthChange(m)}
                            >
                                {formatShamsiMonthLabel(m)}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Summary Cards */}
                <SalaryOverviewSummary salaries={salaries} />

                {/* Employee Salary Table */}
                <SalaryOverviewTable
                    employees={employees}
                    salaries={salaries}
                    month={selectedMonth}
                />
            </div>
        </AppLayout>
    );
}
