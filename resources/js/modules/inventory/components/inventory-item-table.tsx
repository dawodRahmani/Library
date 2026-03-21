import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { InventoryItem } from '../types';

interface InventoryItemTableProps {
    items: InventoryItem[];
    onEdit: (item: InventoryItem) => void;
    onDelete: (item: InventoryItem) => void;
}

function StockLevelBar({ current, min }: { current: number; min: number }) {
    const ratio = min > 0 ? current / min : 1;
    const percentage = Math.min(ratio * 100, 100);
    const color =
        ratio <= 0.3
            ? 'bg-red-500'
            : ratio < 1
              ? 'bg-amber-500'
              : 'bg-emerald-500';

    return (
        <div className="flex items-center gap-2">
            <div className="h-2 w-20 rounded-full bg-muted">
                <div
                    className={`h-full rounded-full ${color} transition-all`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="text-xs text-muted-foreground">{Math.round(percentage)}%</span>
        </div>
    );
}

export function InventoryItemTable({ items, onEdit, onDelete }: InventoryItemTableProps) {
    const { t } = useTranslation();

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Package className="size-12 mb-3 opacity-30" />
                <p className="text-lg font-medium">{t('inventory.noItems')}</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-semibold">{t('inventory.itemName')}</TableHead>
                        <TableHead className="font-semibold">{t('inventory.category')}</TableHead>
                        <TableHead className="font-semibold">{t('inventory.currentStock')}</TableHead>
                        <TableHead className="font-semibold">{t('inventory.stockLevel')}</TableHead>
                        <TableHead className="font-semibold">{t('inventory.costPerUnit')}</TableHead>
                        <TableHead className="font-semibold">{t('inventory.status')}</TableHead>
                        <TableHead className="font-semibold text-center">{t('common.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id} className="group">
                            <TableCell>
                                <div>
                                    <span className="font-medium">{item.name}</span>
                                    <span className="ms-1 text-xs text-muted-foreground">
                                        ({item.unit_name || item.unit})
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="text-xs">
                                    {item.category_name || item.category}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className={`font-semibold ${item.current_stock < item.min_stock_level ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
                                    {item.current_stock}
                                </span>
                                <span className="text-xs text-muted-foreground ms-1">
                                    / {item.min_stock_level} {item.unit_name || item.unit}
                                </span>
                            </TableCell>
                            <TableCell>
                                <StockLevelBar current={item.current_stock} min={item.min_stock_level} />
                            </TableCell>
                            <TableCell>
                                <span className="text-sm">{formatPrice(item.cost_per_unit)}</span>
                            </TableCell>
                            <TableCell>
                                {item.is_active ? (
                                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700">
                                        {t('inventory.active')}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-muted-foreground">
                                        {t('inventory.inactive')}
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(item)}
                                        className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                    >
                                        <Edit className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(item)}
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
