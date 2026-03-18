import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { PosCartItem, OrderType, PaymentMethod } from '../types';

function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }

interface PosReceiptProps {
    items: PosCartItem[];
    total: number;
    orderType: OrderType;
    paymentMethod: PaymentMethod;
    tableNumber?: number | null;
    orderNumber: string;
}

export const PosReceipt = forwardRef<HTMLDivElement, PosReceiptProps>(
    ({ items, total, orderType, paymentMethod, tableNumber, orderNumber }, ref) => {
        const { t } = useTranslation();

        const now = new Date();
        const dateStr = now.toLocaleDateString('fa-AF');
        const timeStr = now.toLocaleTimeString('fa-AF', { hour: '2-digit', minute: '2-digit' });

        const orderTypeLabel =
            orderType === 'dine_in'
                ? t('pos.dineIn')
                : orderType === 'takeaway'
                  ? t('pos.takeaway')
                  : t('pos.delivery');

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
                        <span>{t('print.billNumber')}: {orderNumber}</span>
                        <span>{t('print.date')}: {dateStr}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{orderTypeLabel}</span>
                        <span>{t('print.time')}: {timeStr}</span>
                    </div>
                    {tableNumber && (
                        <div>
                            <span>{t('print.table')}: {tableNumber}</span>
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
                        {items.map((item) => (
                            <tr key={item.food_item.id}>
                                <td>{item.food_item.name}</td>
                                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ textAlign: 'end' }}>{item.food_item.price.toLocaleString()}</td>
                                <td style={{ textAlign: 'end' }}>{(item.food_item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="receipt-divider" />

                {/* Totals */}
                <div style={{ fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t('print.subtotal')}:</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>
                        <span>{t('print.grandTotal')}:</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                        <span>{paymentMethod === 'cash' ? t('pos.cash') : t('pos.card')}</span>
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

PosReceipt.displayName = 'PosReceipt';
