import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Order } from '@/types/models';
import { formatShamsiDate, formatTime } from '@/lib/date';

function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }

interface OrderReceiptProps {
    order: Order;
}

export const OrderReceipt = forwardRef<HTMLDivElement, OrderReceiptProps>(
    ({ order }, ref) => {
        const { t } = useTranslation();

        const dateStr = formatShamsiDate(order.created_at);
        const timeStr = formatTime(order.created_at);

        return (
            <div ref={ref} className="print-area hidden print:block">
                {/* Header */}
                <div className="receipt-header">
                    <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 2px' }}>
                        رستورانت برتر
                    </h2>
                    <p style={{ fontSize: '10px', margin: '0' }}>سیستم مدیریت رستورانت</p>
                </div>

                <div className="receipt-divider" />

                {/* Bill Info */}
                <div style={{ fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t('print.billNumber')}: {order.order_number}</span>
                        <span>{t('print.date')}: {dateStr}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t('print.table')}: {order.table?.name || order.table?.number || '—'}</span>
                        <span>{t('print.time')}: {timeStr}</span>
                    </div>
                    {order.created_by_name && (
                        <div>
                            <span>{t('print.waiter')}: {order.created_by_name}</span>
                        </div>
                    )}
                </div>

                <div className="receipt-divider" />

                {/* Items Table */}
                <table>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                            <th style={{ textAlign: 'start' }}>{t('print.item')}</th>
                            <th style={{ textAlign: 'center', width: '40px' }}>{t('print.qty')}</th>
                            <th style={{ textAlign: 'end', width: '60px' }}>{t('print.price')}</th>
                            <th style={{ textAlign: 'end', width: '70px' }}>{t('print.total')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.food_item?.name ?? '—'}</td>
                                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ textAlign: 'end' }}>{item.unit_price.toLocaleString()}</td>
                                <td style={{ textAlign: 'end' }}>{item.subtotal.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="receipt-divider" />

                {/* Totals */}
                <div style={{ fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t('print.subtotal')}:</span>
                        <span>{formatPrice(order.total_amount)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>
                        <span>{t('print.grandTotal')}:</span>
                        <span>{formatPrice(order.total_amount)}</span>
                    </div>
                </div>

                <div className="receipt-divider" />

                {/* Footer */}
                <div className="receipt-footer">
                    <p style={{ fontWeight: 'bold', margin: '0' }}>{t('print.thankYou')}</p>
                    <p style={{ margin: '2px 0 0' }}>{t('print.visitAgain')}</p>
                </div>
            </div>
        );
    },
);

OrderReceipt.displayName = 'OrderReceipt';
