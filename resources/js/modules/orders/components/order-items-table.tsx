import { useTranslation } from 'react-i18next';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { OrderItem } from '@/data/mock/types';

function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }

interface OrderItemsTableProps {
    items: OrderItem[];
    totalAmount: number;
}

export function OrderItemsTable({ items, totalAmount }: OrderItemsTableProps) {
    const { t } = useTranslation();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{t('orders.foodName')}</TableHead>
                    <TableHead>{t('orders.quantity')}</TableHead>
                    <TableHead>{t('orders.unitPrice')}</TableHead>
                    <TableHead>{t('orders.subtotal')}</TableHead>
                    <TableHead>{t('orders.notes')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.food_item?.name ?? '—'}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatPrice(item.unit_price)}</TableCell>
                        <TableCell>{formatPrice(item.subtotal)}</TableCell>
                        <TableCell className="text-muted-foreground">
                            {item.notes || '-'}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3} className="font-bold">
                        {t('orders.total')}
                    </TableCell>
                    <TableCell className="font-bold">{formatPrice(totalAmount)}</TableCell>
                    <TableCell />
                </TableRow>
            </TableFooter>
        </Table>
    );
}
