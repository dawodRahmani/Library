import { useTranslation } from 'react-i18next';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LedgerEntryBadge } from './ledger-entry-badge';
import type { LedgerEntry } from '@/data/mock-accounting';

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

interface Props {
    entries: LedgerEntry[];
}

export function LedgerTable({ entries }: Props) {
    const { t } = useTranslation();

    const rowColor: Record<string, string> = {
        income:             'hover:bg-emerald-50/50',
        expense:            'hover:bg-red-50/50',
        salary:             'hover:bg-orange-50/50',
        inventory_purchase: 'hover:bg-blue-50/50',
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('accounting.date')}</TableHead>
                        <TableHead>{t('accounting.type')}</TableHead>
                        <TableHead>{t('accounting.reference')}</TableHead>
                        <TableHead>{t('accounting.description')}</TableHead>
                        <TableHead className="text-end">{t('accounting.in')}</TableHead>
                        <TableHead className="text-end">{t('accounting.out')}</TableHead>
                        <TableHead className="text-end">{t('accounting.balance')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entries.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                                {t('accounting.noEntries')}
                            </TableCell>
                        </TableRow>
                    ) : (
                        // Show in reverse (newest first)
                        [...entries].reverse().map((entry) => (
                            <TableRow key={entry.id} className={rowColor[entry.type]}>
                                <TableCell className="text-sm text-muted-foreground">{entry.date}</TableCell>
                                <TableCell>
                                    <LedgerEntryBadge type={entry.type} />
                                </TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                    {entry.reference}
                                </TableCell>
                                <TableCell className="max-w-[220px] truncate text-sm">{entry.description}</TableCell>
                                <TableCell className="text-end">
                                    {entry.direction === 'in' ? (
                                        <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                                            <ArrowDownLeft className="h-3.5 w-3.5" />
                                            {formatPrice(entry.amount)}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">—</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-end">
                                    {entry.direction === 'out' ? (
                                        <span className="inline-flex items-center gap-1 font-medium text-red-600">
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                            {formatPrice(entry.amount)}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">—</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-end">
                                    <span className={`font-semibold ${entry.balance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                                        {entry.balance >= 0 ? '' : '-'}{formatPrice(Math.abs(entry.balance))}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
