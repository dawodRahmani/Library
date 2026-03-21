import { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import { LedgerSummaryCards } from '@/modules/accounting/components/ledger-summary-cards';
import { LedgerTable } from '@/modules/accounting/components/ledger-table';
import { Pagination } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ShamsiDateInput } from '@/components/ui/shamsi-date-input';
import { Search, PlusCircle } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { LedgerEntry, LedgerEntryType } from '@/modules/accounting/types';

type Filter = LedgerEntryType | 'all';

interface PaginatedEntries {
    data: LedgerEntry[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Summary {
    totalIncome: number;
    totalOutflow: number;
    balance: number;
}

interface Filters {
    type?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
}

interface Props extends Record<string, unknown> {
    entries: PaginatedEntries;
    summary: Summary;
    filters: Filters;
}

const TYPE_FILTERS: Filter[] = ['all', 'income', 'expense', 'salary', 'inventory_purchase', 'fund'];

const filterColors: Record<Filter, string> = {
    all:                '',
    income:             'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
    expense:            'border-red-300 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
    salary:             'border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
    inventory_purchase: 'border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
    fund:               'border-purple-300 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
};

export default function AccountingPage() {
    const { t } = useTranslation();
    const { entries, summary, filters } = usePage<Props>().props;

    const [search, setSearch]     = useState(filters.search ?? '');
    const [typeFilter, setType]   = useState<Filter>((filters.type as Filter) ?? 'all');
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo]     = useState(filters.date_to ?? '');

    // Add fund dialog
    const [fundOpen, setFundOpen] = useState(false);
    const [fundAmount, setFundAmount] = useState('');
    const [fundDescription, setFundDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const debouncedSearch = useDebounce(search, 400);

    useEffect(() => {
        const params: Record<string, string> = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (typeFilter !== 'all') params.type = typeFilter;
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;
        router.get('/accounting', params, { preserveState: true, replace: true });
    }, [debouncedSearch, typeFilter, dateFrom, dateTo]);

    function goToPage(page: number) {
        const params: Record<string, string> = { page: String(page) };
        if (search) params.search = search;
        if (typeFilter !== 'all') params.type = typeFilter;
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;
        router.get('/accounting', params, { preserveState: true, replace: true });
    }

    function handleAddFund() {
        if (!fundAmount || Number(fundAmount) <= 0) return;
        setSubmitting(true);
        router.post('/accounting/fund', {
            amount: Number(fundAmount),
            description: fundDescription || t('accounting.fundDefault'),
        }, {
            onSuccess: () => {
                toast.success(t('accounting.fundSuccess'));
                setFundOpen(false);
                setFundAmount('');
                setFundDescription('');
            },
            onFinish: () => setSubmitting(false),
        });
    }

    const filterLabels: Record<Filter, string> = {
        all:                t('common.all'),
        income:             t('accounting.income'),
        expense:            t('accounting.expense'),
        salary:             t('accounting.salary'),
        inventory_purchase: t('accounting.inventoryPurchase'),
        fund:               t('accounting.fund'),
    };

    const breadcrumbs = [{ title: t('sidebar.accounting'), href: '/accounting' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('accounting.title')} />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{t('accounting.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('accounting.description')}</p>
                    </div>
                    <Button onClick={() => setFundOpen(true)}>
                        <PlusCircle className="me-2 size-4" />
                        {t('accounting.addFund')}
                    </Button>
                </div>

                <LedgerSummaryCards
                    totalIncome={summary.totalIncome}
                    totalOutflow={summary.totalOutflow}
                    balance={summary.balance}
                />

                {/* Filters */}
                <div className="space-y-3">
                    {/* Search */}
                    <div className="relative max-w-sm">
                        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="ps-9"
                            placeholder={t('accounting.searchPlaceholder')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Date range */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">{t('orders.dateFrom')}</Label>
                            <ShamsiDateInput value={dateFrom} onChange={setDateFrom} className="w-44" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">{t('orders.dateTo')}</Label>
                            <ShamsiDateInput value={dateTo} onChange={setDateTo} className="w-44" />
                        </div>
                        {(dateFrom || dateTo) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-4"
                                onClick={() => { setDateFrom(''); setDateTo(''); }}
                            >
                                {t('common.clear')}
                            </Button>
                        )}
                    </div>

                    {/* Type filter */}
                    <div className="flex flex-wrap gap-2">
                        {TYPE_FILTERS.map((f) => (
                            <Button
                                key={f}
                                size="sm"
                                variant="outline"
                                className={`${filterColors[f]} ${typeFilter === f ? 'ring-2 ring-offset-1' : ''}`}
                                onClick={() => setType(f)}
                            >
                                {filterLabels[f]}
                            </Button>
                        ))}
                    </div>
                </div>

                <LedgerTable entries={entries.data} />

                <Pagination
                    currentPage={entries.current_page}
                    totalPages={entries.last_page}
                    onPageChange={goToPage}
                    totalItems={entries.total}
                    perPage={entries.per_page}
                />
            </div>

            {/* Add Fund Dialog */}
            <Dialog open={fundOpen} onOpenChange={setFundOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('accounting.addFund')}</DialogTitle>
                        <DialogDescription>{t('accounting.addFundDescription')}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>{t('accounting.amount')}</Label>
                            <Input
                                type="number"
                                min="1"
                                value={fundAmount}
                                onChange={(e) => setFundAmount(e.target.value)}
                                placeholder="0"
                                dir="ltr"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('accounting.description')}</Label>
                            <Input
                                value={fundDescription}
                                onChange={(e) => setFundDescription(e.target.value)}
                                placeholder={t('accounting.fundDefault')}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFundOpen(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button onClick={handleAddFund} disabled={submitting || !fundAmount || Number(fundAmount) <= 0}>
                            <PlusCircle className="me-2 size-4" />
                            {submitting ? t('common.loading') : t('accounting.addFund')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
