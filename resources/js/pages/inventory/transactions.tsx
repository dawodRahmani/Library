import { useState, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Plus, ArrowUpCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';
import { StockTransactionTable } from '@/modules/inventory/components/stock-transaction-table';
import { StockTransactionFilters } from '@/modules/inventory/components/stock-transaction-filters';
import { StockTransactionFormDialog } from '@/modules/inventory/components/stock-transaction-form-dialog';
import type { StockTransaction, StockTransactionFormData } from '@/modules/inventory/types';

interface ItemOption {
    id: number;
    name: string;
    unit: string;
}

interface Props extends Record<string, unknown> {
    transactions: StockTransaction[];
    items: ItemOption[];
}

export default function TransactionsPage() {
    const { t } = useTranslation();
    const { transactions, items } = usePage<Props>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.inventory'), href: '/inventory' },
        { title: t('inventory.transactions'), href: '/inventory/transactions' },
    ];

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [formOpen, setFormOpen] = useState(false);

    const filteredTransactions = useMemo(() => {
        return transactions.filter((tx) => {
            const matchesSearch =
                !search ||
                tx.inventory_item_name.toLowerCase().includes(search.toLowerCase()) ||
                (tx.notes?.toLowerCase().includes(search.toLowerCase()) ?? false);
            const matchesType = typeFilter === 'all' || tx.type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [transactions, search, typeFilter]);

    const handleFormSubmit = (data: StockTransactionFormData) => {
        router.post('/inventory/transactions', { ...data }, {
            onSuccess: () => setFormOpen(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('inventory.transactions')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-purple-600 text-white shadow-md">
                            <ArrowUpCircle className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{t('inventory.transactions')}</h1>
                            <p className="text-sm text-muted-foreground">
                                {t('common.showing')} {filteredTransactions.length} {t('common.of')} {transactions.length} {t('common.results')}
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => setFormOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
                    >
                        <Plus className="size-4 me-2" />
                        {t('inventory.addTransaction')}
                    </Button>
                </div>

                <StockTransactionFilters
                    search={search}
                    onSearchChange={setSearch}
                    typeFilter={typeFilter}
                    onTypeFilterChange={setTypeFilter}
                />

                <StockTransactionTable transactions={filteredTransactions} />

                {filteredTransactions.length > 0 && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                        {t('common.showing')} {filteredTransactions.length} {t('common.of')} {transactions.length} {t('common.results')}
                    </div>
                )}
            </div>

            <StockTransactionFormDialog
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
                items={items}
            />
        </AppLayout>
    );
}
