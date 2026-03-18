import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { FinanceSummaryCards } from '@/modules/finance/components/finance-summary-cards';
import { CashFlowChart } from '@/modules/finance/components/cash-flow-chart';
import { ExpenseBreakdownChart } from '@/modules/finance/components/expense-breakdown-chart';
import { MonthlyComparison } from '@/modules/finance/components/monthly-comparison';
import { SalaryOverviewCard } from '@/modules/finance/components/salary-overview-card';
import { ProfitMarginCard } from '@/modules/finance/components/profit-margin-card';
import type {
    MonthlyFinance,
    DailyCashFlow,
    ExpenseCategoryBreakdown,
    SalaryOverview,
} from '@/modules/finance/data/mock-finance';

interface Props extends Record<string, unknown> {
    current: MonthlyFinance;
    previous: MonthlyFinance;
    dailyCashFlow: DailyCashFlow[];
    expenseBreakdown: ExpenseCategoryBreakdown[];
    salaryOverview: SalaryOverview[];
    monthlyHistory: MonthlyFinance[];
    selectedMonth: string;
    months: string[];
}

export default function FinancePage() {
    const { t } = useTranslation();
    const { current, previous, dailyCashFlow, expenseBreakdown, salaryOverview, monthlyHistory } =
        usePage<Props>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.finance'), href: '/finance' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('finance.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{t('finance.title')}</h1>
                        <p className="text-sm text-muted-foreground">
                            {current.monthLabel}
                        </p>
                    </div>
                </div>

                {/* Summary Cards — Income, Expenses, Salaries, Net Profit */}
                <FinanceSummaryCards current={current} previous={previous} />

                {/* Cash Flow Chart + Expense Breakdown Pie */}
                <div className="grid gap-4 lg:grid-cols-3">
                    <CashFlowChart data={dailyCashFlow} />
                    <ExpenseBreakdownChart data={expenseBreakdown} />
                </div>

                {/* Profit Margin Stats + Salary Overview */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <ProfitMarginCard
                        current={current}
                        previous={previous}
                        expenseBreakdown={expenseBreakdown}
                    />
                    <SalaryOverviewCard data={salaryOverview} />
                </div>

                {/* Monthly Comparison (6 months) */}
                <MonthlyComparison data={monthlyHistory} />
            </div>
        </AppLayout>
    );
}
