import { useTranslation } from 'react-i18next';
import { ArrowDownCircle, ArrowUpCircle, AlertTriangle, Settings2, ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { StockTransaction, TransactionType } from '../types';
import { formatShamsiDateTime } from '@/lib/date';

function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }

interface StockTransactionTableProps {
    transactions: StockTransaction[];
}

const typeConfig: Record<TransactionType, { icon: typeof ArrowDownCircle; color: string; badgeClass: string }> = {
    stock_in: {
        icon: ArrowDownCircle,
        color: 'text-emerald-600 dark:text-emerald-400',
        badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700',
    },
    stock_out: {
        icon: ArrowUpCircle,
        color: 'text-red-600 dark:text-red-400',
        badgeClass: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
    },
    waste: {
        icon: AlertTriangle,
        color: 'text-amber-600 dark:text-amber-400',
        badgeClass: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
    },
    adjustment: {
        icon: Settings2,
        color: 'text-blue-600 dark:text-blue-400',
        badgeClass: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    },
};

export function StockTransactionTable({ transactions }: StockTransactionTableProps) {
    const { t } = useTranslation();

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <ClipboardList className="size-12 mb-3 opacity-30" />
                <p className="text-lg font-medium">{t('inventory.noTransactions')}</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-semibold">{t('inventory.selectType')}</TableHead>
                        <TableHead className="font-semibold">{t('inventory.itemName')}</TableHead>
                        <TableHead className="font-semibold">{t('inventory.quantity')}</TableHead>
                        <TableHead className="font-semibold">{t('inventory.totalCost')}</TableHead>
                        <TableHead className="font-semibold">{t('inventory.notes')}</TableHead>
                        <TableHead className="font-semibold">{t('inventory.createdBy')}</TableHead>
                        <TableHead className="font-semibold">{t('inventory.date')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((tx) => {
                        const config = typeConfig[tx.type];
                        const Icon = config.icon;
                        return (
                            <TableRow key={tx.id}>
                                <TableCell>
                                    <Badge variant="outline" className={`text-xs font-medium ${config.badgeClass}`}>
                                        <Icon className="size-3 me-1" />
                                        {t(`inventory.${tx.type === 'stock_in' ? 'stockIn' : tx.type === 'stock_out' ? 'stockOut' : tx.type}`)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium">{tx.inventory_item_name}</TableCell>
                                <TableCell>
                                    <span className={`font-semibold ${config.color}`}>
                                        {tx.type === 'stock_in' ? '+' : tx.type === 'adjustment' ? '' : '-'}
                                        {Math.abs(tx.quantity)} {t(`inventory.units.${tx.unit}`)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {tx.total_cost ? (
                                        <span className="text-sm">{formatPrice(tx.total_cost)}</span>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">—</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">{tx.notes || '—'}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">{tx.created_by_name}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">{formatShamsiDateTime(tx.created_at)}</span>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
