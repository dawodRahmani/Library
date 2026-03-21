import { useState, useCallback } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    CreditCard,
    Users,
    ShoppingCart,
    ArrowUpRight,
    ArrowDownRight,
    Minus,
    Download,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShamsiDateInput } from '@/components/ui/shamsi-date-input';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

// ── Types ────────────────────────────────────────────────────────────────────

interface ReportStats {
    totalRevenue: number;
    totalExpenses: number;
    totalSalaries: number;
    totalInventory: number;
    netProfit: number;
    prevRevenue: number;
    prevExpenses: number;
    prevSalaries: number;
    prevInventory: number;
    prevProfit: number;
}

interface DailySaleRow {
    date: string;
    orders: number;
    revenue: number;
}

interface ExpenseCategory {
    category: string;
    total: number;
    count: number;
}

interface SalaryRow {
    employee: string;
    month: string;
    amount: number;
    date: string | null;
}

interface InventoryPurchase {
    po_number: string;
    supplier: string;
    status: string;
    amount: number;
    date: string | null;
}

interface TopItem {
    name: string;
    quantity: number;
    revenue: number;
}

interface PageProps extends Record<string, unknown> {
    stats: ReportStats;
    dailySales: DailySaleRow[];
    expensesByCategory: ExpenseCategory[];
    salaries: SalaryRow[];
    inventoryPurchases: InventoryPurchase[];
    topItems: TopItem[];
    dateRange: { from: string; to: string };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

function variance(current: number, previous: number): number {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
}

type Period = 'today' | 'week' | 'month' | 'custom';
type VarianceFilter = 'all' | 'up' | 'down';

function periodDates(p: Period): { from: string; to: string } {
    const today = new Date();
    const fmt = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (p === 'today') return { from: fmt(today), to: fmt(today) };
    if (p === 'week') {
        const start = new Date(today);
        start.setDate(today.getDate() - 6);
        return { from: fmt(start), to: fmt(today) };
    }
    return { from: fmt(new Date(today.getFullYear(), today.getMonth(), 1)), to: fmt(today) };
}

const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
    groceries: 'مواد غذایی',
    rent: 'کرایه',
    electricity: 'برق',
    gas: 'گاز',
    supplies: 'لوازم',
    other: 'سایر',
};

/** Returns the variance direction of a metric.
 *  For revenue/profit "up" is good (+); for cost metrics "up" is bad (-). */
function metricVarianceDir(pct: number, invertVariance = false): VarianceFilter {
    const effective = invertVariance ? -pct : pct;
    if (effective > 0) return 'up';
    if (effective < 0) return 'down';
    return 'all';
}

// ── CSV export ────────────────────────────────────────────────────────────────

function downloadCSV(
    stats: ReportStats,
    dailySales: DailySaleRow[],
    expensesByCategory: ExpenseCategory[],
    salaries: SalaryRow[],
    inventoryPurchases: InventoryPurchase[],
    topItems: TopItem[],
    dateRange: { from: string; to: string },
) {
    const rows: string[] = [];

    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const line = (...cols: (string | number)[]) => cols.map(esc).join(',');

    rows.push(line('گزارش مالی', `از ${dateRange.from} تا ${dateRange.to}`));
    rows.push('');

    // Summary
    rows.push(line('خلاصه', 'مبلغ', 'تغییر %'));
    rows.push(line('عواید', stats.totalRevenue, variance(stats.totalRevenue, stats.prevRevenue) + '%'));
    rows.push(line('مصارف', stats.totalExpenses, variance(stats.totalExpenses, stats.prevExpenses) + '%'));
    rows.push(line('معاشات', stats.totalSalaries, variance(stats.totalSalaries, stats.prevSalaries) + '%'));
    rows.push(line('خریدهای انبار', stats.totalInventory, variance(stats.totalInventory, stats.prevInventory) + '%'));
    rows.push(line('سود خالص', stats.netProfit, variance(stats.netProfit, stats.prevProfit) + '%'));
    rows.push('');

    // Daily sales
    if (dailySales.length > 0) {
        rows.push(line('فروش روزانه', '', ''));
        rows.push(line('تاریخ', 'تعداد فرمایش', 'عواید'));
        dailySales.forEach(r => rows.push(line(r.date, r.orders, r.revenue)));
        rows.push('');
    }

    // Expenses
    if (expensesByCategory.length > 0) {
        rows.push(line('تفکیک مصارف', '', ''));
        rows.push(line('دسته‌بندی', 'تعداد', 'مبلغ'));
        expensesByCategory.forEach(r =>
            rows.push(line(EXPENSE_CATEGORY_LABELS[r.category] ?? r.category, r.count, r.total)),
        );
        rows.push('');
    }

    // Salaries
    if (salaries.length > 0) {
        rows.push(line('معاشات پرداخت شده', '', '', ''));
        rows.push(line('کارمند', 'ماه', 'تاریخ', 'مبلغ'));
        salaries.forEach(r => rows.push(line(r.employee, r.month, r.date ?? '', r.amount)));
        rows.push('');
    }

    // Inventory
    if (inventoryPurchases.length > 0) {
        rows.push(line('خریدهای انبار', '', '', '', ''));
        rows.push(line('شماره سفارش', 'تامین‌کننده', 'تاریخ', 'وضعیت', 'مبلغ'));
        inventoryPurchases.forEach(r =>
            rows.push(line(r.po_number, r.supplier, r.date ?? '', r.status, r.amount)),
        );
        rows.push('');
    }

    // Top items
    if (topItems.length > 0) {
        rows.push(line('پرفروش‌ترین غذاها', '', ''));
        rows.push(line('نام', 'تعداد فروش', 'عواید'));
        topItems.forEach(r => rows.push(line(r.name, r.quantity, r.revenue)));
    }

    const bom = '\uFEFF'; // UTF-8 BOM so Excel reads Dari correctly
    const blob = new Blob([bom + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${dateRange.from}-${dateRange.to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function VarianceBadge({ pct }: { pct: number }) {
    if (pct === 0)
        return (
            <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
                <Minus className="h-3 w-3" />
                <span>0%</span>
            </span>
        );
    if (pct > 0)
        return (
            <span className="inline-flex items-center gap-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="h-3 w-3" />
                <span>{pct}%</span>
            </span>
        );
    return (
        <span className="inline-flex items-center gap-0.5 text-xs text-red-500">
            <ArrowDownRight className="h-3 w-3" />
            <span>{Math.abs(pct)}%</span>
        </span>
    );
}

interface StatCardProps {
    title: string;
    value: string;
    pct: number;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    valueColor: string;
    invertVariance?: boolean;
    dimmed?: boolean;
}

function StatCard({ title, value, pct, icon: Icon, iconBg, iconColor, valueColor, invertVariance = false, dimmed }: StatCardProps) {
    const displayPct = invertVariance ? -pct : pct;
    return (
        <Card className={cn('transition-opacity', dimmed && 'opacity-30')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className={cn('rounded-lg p-2.5', iconBg)}>
                    <Icon className={cn('h-4 w-4', iconColor)} />
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <div className={cn('text-2xl font-bold', valueColor)}>{value}</div>
                <VarianceBadge pct={displayPct} />
            </CardContent>
        </Card>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-lg font-semibold">{children}</h2>;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
    const { t } = useTranslation();
    const { stats, dailySales, expensesByCategory, salaries, inventoryPurchases, topItems, dateRange } =
        usePage<PageProps>().props;

    const [period, setPeriod] = useState<Period>('month');
    const [customFrom, setCustomFrom] = useState(dateRange.from);
    const [customTo, setCustomTo] = useState(dateRange.to);
    const [varFilter, setVarFilter] = useState<VarianceFilter>('all');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.reports'), href: '/reports' },
    ];

    function applyPeriod(p: Period) {
        setPeriod(p);
        if (p === 'custom') return;
        const { from, to } = periodDates(p);
        router.get('/reports', { from, to }, { preserveScroll: true, preserveState: false });
    }

    function applyCustom() {
        router.get('/reports', { from: customFrom, to: customTo }, { preserveScroll: true, preserveState: false });
    }

    const handleDownload = useCallback(() => {
        downloadCSV(stats, dailySales, expensesByCategory, salaries, inventoryPurchases, topItems, dateRange);
    }, [stats, dailySales, expensesByCategory, salaries, inventoryPurchases, topItems, dateRange]);

    // ── Variance-filtered daily sales ─────────────────────────────────────
    const avgRevenue = dailySales.length > 0
        ? dailySales.reduce((s, r) => s + r.revenue, 0) / dailySales.length
        : 0;

    const filteredDailySales = dailySales.filter(r => {
        if (varFilter === 'all') return true;
        if (varFilter === 'up') return r.revenue >= avgRevenue;
        return r.revenue < avgRevenue;
    });

    // ── Variance-filtered top items ───────────────────────────────────────
    const avgItemRevenue = topItems.length > 0
        ? topItems.reduce((s, r) => s + r.revenue, 0) / topItems.length
        : 0;

    const filteredTopItems = topItems.filter(item => {
        if (varFilter === 'all') return true;
        if (varFilter === 'up') return item.revenue >= avgItemRevenue;
        return item.revenue < avgItemRevenue;
    });

    // ── Per-card variance direction ───────────────────────────────────────
    const revenueDir  = metricVarianceDir(variance(stats.totalRevenue, stats.prevRevenue));
    const expenseDir  = metricVarianceDir(variance(stats.totalExpenses, stats.prevExpenses), true);
    const salaryDir   = metricVarianceDir(variance(stats.totalSalaries, stats.prevSalaries), true);
    const inventDir   = metricVarianceDir(variance(stats.totalInventory, stats.prevInventory), true);
    const profitDir   = metricVarianceDir(variance(stats.netProfit, stats.prevProfit));

    function isDimmed(dir: VarianceFilter): boolean {
        if (varFilter === 'all') return false;
        return dir !== varFilter && dir !== 'all';
    }

    const chartData = filteredDailySales.map(d => ({
        date: d.date.slice(5),
        [t('reports.revenue')]: d.revenue,
    }));

    const topChartData = filteredTopItems.slice(0, 8).map(item => ({
        name: item.name,
        [t('reports.quantitySold')]: item.quantity,
    }));

    const totalExpensesFromCategories = expensesByCategory.reduce((s, e) => s + e.total, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('sidebar.reports')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">

                {/* ── Header ─────────────────────────────────────────── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h1 className="text-2xl font-bold">{t('sidebar.reports')}</h1>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Period buttons */}
                        {(['today', 'week', 'month', 'custom'] as Period[]).map(p => (
                            <Button
                                key={p}
                                size="sm"
                                variant={period === p ? 'default' : 'outline'}
                                onClick={() => applyPeriod(p)}
                            >
                                {t(`reports.filter_${p}`)}
                            </Button>
                        ))}

                        <div className="w-px h-5 bg-border mx-1" />

                        {/* Variance filter */}
                        {([
                            { key: 'all',  label: t('reports.varAll'),  cls: '' },
                            { key: 'up',   label: '↑ ' + t('reports.varUp'),   cls: 'text-emerald-600 dark:text-emerald-400' },
                            { key: 'down', label: '↓ ' + t('reports.varDown'), cls: 'text-red-500' },
                        ] as { key: VarianceFilter; label: string; cls: string }[]).map(v => (
                            <Button
                                key={v.key}
                                size="sm"
                                variant={varFilter === v.key ? 'secondary' : 'ghost'}
                                className={cn('border', varFilter === v.key ? 'border-border' : 'border-transparent', v.cls)}
                                onClick={() => setVarFilter(v.key)}
                            >
                                {v.label}
                            </Button>
                        ))}

                        <div className="w-px h-5 bg-border mx-1" />

                        {/* Download */}
                        <Button size="sm" variant="outline" onClick={handleDownload}>
                            <Download className="h-4 w-4 me-1.5" />
                            {t('reports.download')}
                        </Button>
                    </div>
                </div>

                {/* ── Custom date range ───────────────────────────────── */}
                {period === 'custom' && (
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-muted-foreground">{t('reports.dateFrom')}:</span>
                        <ShamsiDateInput value={customFrom} onChange={setCustomFrom} />
                        <span className="text-sm text-muted-foreground">{t('reports.dateTo')}:</span>
                        <ShamsiDateInput value={customTo} onChange={setCustomTo} />
                        <Button size="sm" onClick={applyCustom}>{t('reports.apply')}</Button>
                    </div>
                )}

                {/* ── Variance active notice ──────────────────────────── */}
                {varFilter !== 'all' && (
                    <div className={cn(
                        'flex items-center gap-2 rounded-lg px-4 py-2 text-sm border',
                        varFilter === 'up'
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                            : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-600',
                    )}>
                        <span className="font-medium">
                            {varFilter === 'up' ? '↑' : '↓'}&nbsp;
                            {t('reports.filteringBy')}: {varFilter === 'up' ? t('reports.varUp') : t('reports.varDown')}
                        </span>
                        <button
                            className="ms-auto text-xs underline opacity-70 hover:opacity-100"
                            onClick={() => setVarFilter('all')}
                        >
                            {t('reports.clearFilter')}
                        </button>
                    </div>
                )}

                {/* ── Summary cards ───────────────────────────────────── */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    <StatCard
                        title={t('reports.revenue')}
                        value={formatPrice(stats.totalRevenue)}
                        pct={variance(stats.totalRevenue, stats.prevRevenue)}
                        icon={DollarSign}
                        iconBg="bg-emerald-100 dark:bg-emerald-900/40"
                        iconColor="text-emerald-600 dark:text-emerald-400"
                        valueColor="text-emerald-700 dark:text-emerald-400"
                        dimmed={isDimmed(revenueDir)}
                    />
                    <StatCard
                        title={t('reports.expenses')}
                        value={formatPrice(stats.totalExpenses)}
                        pct={variance(stats.totalExpenses, stats.prevExpenses)}
                        icon={CreditCard}
                        iconBg="bg-red-100 dark:bg-red-900/40"
                        iconColor="text-red-600 dark:text-red-400"
                        valueColor="text-red-600 dark:text-red-400"
                        invertVariance
                        dimmed={isDimmed(expenseDir)}
                    />
                    <StatCard
                        title={t('reports.salaries')}
                        value={formatPrice(stats.totalSalaries)}
                        pct={variance(stats.totalSalaries, stats.prevSalaries)}
                        icon={Users}
                        iconBg="bg-amber-100 dark:bg-amber-900/40"
                        iconColor="text-amber-600 dark:text-amber-400"
                        valueColor="text-amber-700 dark:text-amber-400"
                        invertVariance
                        dimmed={isDimmed(salaryDir)}
                    />
                    <StatCard
                        title={t('reports.inventory')}
                        value={formatPrice(stats.totalInventory)}
                        pct={variance(stats.totalInventory, stats.prevInventory)}
                        icon={ShoppingCart}
                        iconBg="bg-sky-100 dark:bg-sky-900/40"
                        iconColor="text-sky-600 dark:text-sky-400"
                        valueColor="text-sky-700 dark:text-sky-400"
                        invertVariance
                        dimmed={isDimmed(inventDir)}
                    />
                    <StatCard
                        title={t('reports.netProfit')}
                        value={formatPrice(stats.netProfit)}
                        pct={variance(stats.netProfit, stats.prevProfit)}
                        icon={stats.netProfit >= 0 ? TrendingUp : TrendingDown}
                        iconBg={stats.netProfit >= 0 ? 'bg-violet-100 dark:bg-violet-900/40' : 'bg-red-100 dark:bg-red-900/40'}
                        iconColor={stats.netProfit >= 0 ? 'text-violet-600 dark:text-violet-400' : 'text-red-500'}
                        valueColor={stats.netProfit >= 0 ? 'text-violet-700 dark:text-violet-400' : 'text-red-500'}
                        dimmed={isDimmed(profitDir)}
                    />
                </div>

                {/* ── Revenue / Daily Sales ───────────────────────────── */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <SectionTitle>{t('reports.dailySales')}</SectionTitle>
                        {varFilter !== 'all' && dailySales.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                                {filteredDailySales.length} / {dailySales.length} {t('reports.daysShown')}
                            </span>
                        )}
                    </div>

                    {filteredDailySales.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                {dailySales.length === 0 ? t('reports.noData') : t('reports.noDataForFilter')}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-3">
                            <Card className="lg:col-span-2">
                                <CardContent className="pt-4">
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData} margin={{ top: 5, right: 16, left: 16, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                                                <Tooltip
                                                    formatter={(v) => formatPrice(Number(v))}
                                                    contentStyle={{
                                                        background: 'hsl(var(--background))',
                                                        border: '1px solid hsl(var(--border))',
                                                        borderRadius: 8,
                                                        direction: 'rtl',
                                                    }}
                                                />
                                                <Legend />
                                                <Bar dataKey={t('reports.revenue')} fill="#10b981" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-0">
                                    <div className="overflow-auto max-h-72">
                                        <table className="w-full text-sm">
                                            <thead className="sticky top-0 bg-muted/70 backdrop-blur-sm">
                                                <tr>
                                                    <th className="py-2 px-3 text-start font-medium">{t('reports.date')}</th>
                                                    <th className="py-2 px-3 text-start font-medium">{t('reports.ordersCount')}</th>
                                                    <th className="py-2 px-3 text-start font-medium">{t('reports.revenue')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredDailySales.map(row => (
                                                    <tr
                                                        key={row.date}
                                                        className={cn(
                                                            'border-b transition-colors',
                                                            row.revenue >= avgRevenue
                                                                ? 'hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20'
                                                                : 'hover:bg-red-50/50 dark:hover:bg-red-950/20',
                                                        )}
                                                    >
                                                        <td className="py-2 px-3">{row.date}</td>
                                                        <td className="py-2 px-3">{row.orders}</td>
                                                        <td className={cn(
                                                            'py-2 px-3 font-medium',
                                                            row.revenue >= avgRevenue
                                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                                : 'text-red-500',
                                                        )}>
                                                            {formatPrice(row.revenue)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="border-t-2 font-bold">
                                                    <td className="py-2 px-3">{t('reports.total')}</td>
                                                    <td className="py-2 px-3">{filteredDailySales.reduce((s, r) => s + r.orders, 0)}</td>
                                                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">
                                                        {formatPrice(filteredDailySales.reduce((s, r) => s + r.revenue, 0))}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* ── Expenses breakdown ──────────────────────────────── */}
                <div className="space-y-3">
                    <SectionTitle>{t('reports.expenseBreakdown')}</SectionTitle>
                    {expensesByCategory.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">{t('reports.noData')}</CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-0">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="py-3 px-4 text-start font-medium">{t('reports.expenseCategory')}</th>
                                            <th className="py-3 px-4 text-start font-medium">{t('reports.count')}</th>
                                            <th className="py-3 px-4 text-start font-medium">{t('reports.amount')}</th>
                                            <th className="py-3 px-4 text-start font-medium">{t('reports.percentage')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expensesByCategory.map(row => {
                                            const pct = totalExpensesFromCategories > 0
                                                ? Math.round((row.total / totalExpensesFromCategories) * 100)
                                                : 0;
                                            return (
                                                <tr key={row.category} className="border-b hover:bg-muted/40 transition-colors">
                                                    <td className="py-3 px-4 font-medium">
                                                        {EXPENSE_CATEGORY_LABELS[row.category] ?? row.category}
                                                    </td>
                                                    <td className="py-3 px-4">{row.count}</td>
                                                    <td className="py-3 px-4 text-red-600 dark:text-red-400 font-medium">
                                                        {formatPrice(row.total)}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 bg-muted rounded-full h-2 max-w-24">
                                                                <div className="bg-red-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <span className="text-xs text-muted-foreground w-8">{pct}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 font-bold">
                                            <td className="py-3 px-4">{t('reports.total')}</td>
                                            <td className="py-3 px-4">{expensesByCategory.reduce((s, r) => s + r.count, 0)}</td>
                                            <td className="py-3 px-4 text-red-600 dark:text-red-400">{formatPrice(totalExpensesFromCategories)}</td>
                                            <td className="py-3 px-4">100%</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* ── Salaries ────────────────────────────────────────── */}
                <div className="space-y-3">
                    <SectionTitle>{t('reports.salariesPaid')}</SectionTitle>
                    {salaries.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">{t('reports.noData')}</CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-0">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="py-3 px-4 text-start font-medium">{t('reports.employee')}</th>
                                            <th className="py-3 px-4 text-start font-medium">{t('reports.salaryMonth')}</th>
                                            <th className="py-3 px-4 text-start font-medium">{t('reports.paymentDate')}</th>
                                            <th className="py-3 px-4 text-start font-medium">{t('reports.amount')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salaries.map((row, i) => (
                                            <tr key={i} className="border-b hover:bg-muted/40 transition-colors">
                                                <td className="py-3 px-4 font-medium">{row.employee}</td>
                                                <td className="py-3 px-4">{row.month}</td>
                                                <td className="py-3 px-4">{row.date ?? '—'}</td>
                                                <td className="py-3 px-4 text-amber-600 dark:text-amber-400 font-medium">
                                                    {formatPrice(row.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 font-bold">
                                            <td className="py-3 px-4">{t('reports.total')}</td>
                                            <td colSpan={2} />
                                            <td className="py-3 px-4 text-amber-600 dark:text-amber-400">{formatPrice(stats.totalSalaries)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* ── Inventory Purchases ─────────────────────────────── */}
                <div className="space-y-3">
                    <SectionTitle>{t('reports.inventoryPurchases')}</SectionTitle>
                    {inventoryPurchases.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">{t('reports.noData')}</CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-0">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="py-3 px-4 text-start font-medium">{t('reports.poNumber')}</th>
                                            <th className="py-3 px-4 text-start font-medium">{t('reports.supplier')}</th>
                                            <th className="py-3 px-4 text-start font-medium">{t('reports.date')}</th>
                                            <th className="py-3 px-4 text-start font-medium">{t('reports.status')}</th>
                                            <th className="py-3 px-4 text-start font-medium">{t('reports.amount')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventoryPurchases.map((row, i) => (
                                            <tr key={i} className="border-b hover:bg-muted/40 transition-colors">
                                                <td className="py-3 px-4 font-mono text-xs">{row.po_number}</td>
                                                <td className="py-3 px-4">{row.supplier}</td>
                                                <td className="py-3 px-4">{row.date ?? '—'}</td>
                                                <td className="py-3 px-4">{row.status}</td>
                                                <td className="py-3 px-4 text-sky-600 dark:text-sky-400 font-medium">
                                                    {formatPrice(row.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 font-bold">
                                            <td className="py-3 px-4">{t('reports.total')}</td>
                                            <td colSpan={3} />
                                            <td className="py-3 px-4 text-sky-600 dark:text-sky-400">{formatPrice(stats.totalInventory)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* ── Top Selling Items ───────────────────────────────── */}
                {topItems.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <SectionTitle>{t('reports.topSellingItems')}</SectionTitle>
                            {varFilter !== 'all' && (
                                <span className="text-xs text-muted-foreground">
                                    {filteredTopItems.length} / {topItems.length} {t('reports.itemsShown')}
                                </span>
                            )}
                        </div>
                        {filteredTopItems.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center text-muted-foreground">{t('reports.noDataForFilter')}</CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 lg:grid-cols-2">
                                <Card>
                                    <CardContent className="pt-4">
                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={topChartData}
                                                    layout="vertical"
                                                    margin={{ top: 5, right: 16, left: 80, bottom: 5 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                                    <XAxis type="number" tick={{ fontSize: 11 }} />
                                                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={75} />
                                                    <Tooltip
                                                        contentStyle={{
                                                            background: 'hsl(var(--background))',
                                                            border: '1px solid hsl(var(--border))',
                                                            borderRadius: 8,
                                                            direction: 'rtl',
                                                        }}
                                                    />
                                                    <Bar dataKey={t('reports.quantitySold')} fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-0">
                                        <div className="overflow-auto max-h-72">
                                            <table className="w-full text-sm">
                                                <thead className="sticky top-0 bg-muted/70 backdrop-blur-sm">
                                                    <tr>
                                                        <th className="py-2 px-3 text-start font-medium">{t('reports.itemName')}</th>
                                                        <th className="py-2 px-3 text-start font-medium">{t('reports.quantitySold')}</th>
                                                        <th className="py-2 px-3 text-start font-medium">{t('reports.revenue')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredTopItems.map((item, i) => (
                                                        <tr key={i} className="border-b hover:bg-muted/40 transition-colors">
                                                            <td className="py-2 px-3 font-medium">{item.name}</td>
                                                            <td className="py-2 px-3">{item.quantity}</td>
                                                            <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">
                                                                {formatPrice(item.revenue)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </AppLayout>
    );
}
