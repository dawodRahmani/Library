import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, CheckCircle2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PurchaseOrderStatusBadge } from './purchase-order-status-badge';
import type { PurchaseOrder } from '../types';
import { formatShamsiDate } from '@/lib/date';

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

interface Props {
    orders: PurchaseOrder[];
    onMarkArrived: (id: number) => void;
    onEdit: (order: PurchaseOrder) => void;
}

export function PurchaseOrderTable({ orders, onMarkArrived, onEdit }: Props) {
    const { t } = useTranslation();
    const [expandedId, setExpandedId] = useState<number | null>(null);

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-8" />
                        <TableHead>{t('inventory.poNumber')}</TableHead>
                        <TableHead>{t('inventory.supplier')}</TableHead>
                        <TableHead>{t('inventory.orderDate')}</TableHead>
                        <TableHead>{t('inventory.expectedDelivery')}</TableHead>
                        <TableHead>{t('inventory.totalAmount')}</TableHead>
                        <TableHead>{t('inventory.status')}</TableHead>
                        <TableHead>{t('common.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                                {t('inventory.noPurchaseOrders')}
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((po) => (
                            <>
                                <TableRow key={po.id} className="cursor-pointer hover:bg-muted/30">
                                    <TableCell>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7"
                                            onClick={() => setExpandedId(expandedId === po.id ? null : po.id)}
                                        >
                                            {expandedId === po.id ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </TableCell>
                                    <TableCell className="font-mono font-medium">{po.po_number}</TableCell>
                                    <TableCell>{po.supplier_name}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{formatShamsiDate(po.order_date)}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{formatShamsiDate(po.expected_delivery)}</TableCell>
                                    <TableCell className="font-medium">{formatPrice(po.total_amount)}</TableCell>
                                    <TableCell>
                                        <PurchaseOrderStatusBadge status={po.status} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            {po.status === 'ordered' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs"
                                                    onClick={() => onMarkArrived(po.id)}
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    {t('inventory.markArrived')}
                                                </Button>
                                            )}
                                            {(po.status === 'draft' || po.status === 'ordered') && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8"
                                                    onClick={() => onEdit(po)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {expandedId === po.id && (
                                    <TableRow key={`${po.id}-items`} className="bg-muted/20">
                                        <TableCell />
                                        <TableCell colSpan={7} className="py-3">
                                            <div className="space-y-1.5">
                                                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                    {t('inventory.orderItems')}
                                                </p>
                                                <div className="rounded border bg-background">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="text-xs">{t('inventory.itemName')}</TableHead>
                                                                <TableHead className="text-xs">{t('inventory.quantity')}</TableHead>
                                                                <TableHead className="text-xs">{t('inventory.costPerUnit')}</TableHead>
                                                                <TableHead className="text-xs">{t('inventory.totalCost')}</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {po.items.map((item, idx) => (
                                                                <TableRow key={idx}>
                                                                    <TableCell className="text-sm">{item.inventory_item_name}</TableCell>
                                                                    <TableCell className="text-sm">
                                                                        {item.quantity} {t(`inventory.units.${item.unit}`)}
                                                                    </TableCell>
                                                                    <TableCell className="text-sm">{formatPrice(item.unit_cost)}</TableCell>
                                                                    <TableCell className="text-sm font-medium">{formatPrice(item.total_cost)}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                                {po.notes && (
                                                    <p className="text-xs text-muted-foreground">
                                                        <span className="font-medium">{t('inventory.notes')}:</span> {po.notes}
                                                    </p>
                                                )}
                                                {po.arrived_date && (
                                                    <p className="text-xs text-emerald-600">
                                                        <span className="font-medium">{t('inventory.arrivedDate')}:</span> {po.arrived_date}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
