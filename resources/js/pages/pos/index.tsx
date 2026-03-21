import { useState, useCallback } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
    LogOut,
    Pause,
    Trash2,
    UtensilsCrossed,
    ShoppingBag,
    Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { FoodItem, Category, RestaurantTable } from '@/types/models';

function formatPrice(amount: number): string {
    return `${amount.toLocaleString()} ؋`;
}

interface Props extends Record<string, unknown> {
    items: FoodItem[];
    categories: Category[];
    tables: RestaurantTable[];
}
import { PosMenuGrid } from '@/modules/pos/components/pos-menu-grid';
import { PosCart } from '@/modules/pos/components/pos-cart';
import { PosPaymentDialog } from '@/modules/pos/components/pos-payment-dialog';
import { PosHeldOrders } from '@/modules/pos/components/pos-held-orders';
import { PosSuccessDialog } from '@/modules/pos/components/pos-success-dialog';
import { PosReceipt } from '@/modules/pos/components/pos-receipt';
import type { PosCartItem, OrderType, HeldOrder, PaymentMethod } from '@/modules/pos/types';
import { useOrderEvents } from '@/hooks/use-order-events';

export default function PosPage() {
    const { t } = useTranslation();
    const { items, categories, tables } = usePage<Props>().props;

    // Real-time updates — only reload server props (tables/items), preserve cart state
    useOrderEvents({ reloadProps: ['items', 'tables'], showNotifications: true });

    // Cart state
    const [cartItems, setCartItems] = useState<PosCartItem[]>([]);
    const [orderType, setOrderType] = useState<OrderType>('dine_in');
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [lastPaymentMethod, setLastPaymentMethod] = useState<PaymentMethod>('cash');
    const [lastCartItems, setLastCartItems] = useState<PosCartItem[]>([]);
    const [orderCounter, setOrderCounter] = useState(2000);

    // Dialog states
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [heldOrdersOpen, setHeldOrdersOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [lastTotal, setLastTotal] = useState(0);

    // Held orders
    const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
    const [nextHeldId, setNextHeldId] = useState(1);

    const availableTables = tables; // already filtered to available on backend

    const total = cartItems.reduce(
        (sum, item) => sum + item.food_item.price * item.quantity,
        0,
    );

    // Cart handlers
    const handleAddItem = useCallback((item: FoodItem) => {
        setCartItems((prev) => {
            const existing = prev.find((ci) => ci.food_item.id === item.id);
            if (existing) {
                return prev.map((ci) =>
                    ci.food_item.id === item.id
                        ? { ...ci, quantity: ci.quantity + 1 }
                        : ci,
                );
            }
            return [...prev, { food_item: item, quantity: 1 }];
        });
    }, []);

    const handleUpdateQuantity = useCallback((foodItemId: number, qty: number) => {
        if (qty < 1) return;
        setCartItems((prev) =>
            prev.map((ci) =>
                ci.food_item.id === foodItemId ? { ...ci, quantity: qty } : ci,
            ),
        );
    }, []);

    const handleRemoveItem = useCallback((foodItemId: number) => {
        setCartItems((prev) => prev.filter((ci) => ci.food_item.id !== foodItemId));
    }, []);

    const handleClearCart = () => {
        setCartItems([]);
        setSelectedTable(null);
    };

    // Hold order
    const handleHoldOrder = () => {
        if (cartItems.length === 0) return;
        const held: HeldOrder = {
            id: nextHeldId,
            table_id: selectedTable,
            order_type: orderType,
            items: [...cartItems],
            created_at: new Date().toISOString(),
            label: selectedTable
                ? `${t('orders.table')} ${selectedTable}`
                : `${t('pos.holdOrder')} #${nextHeldId}`,
        };
        setHeldOrders((prev) => [...prev, held]);
        setNextHeldId((n) => n + 1);
        handleClearCart();
    };

    const handleResumeOrder = (order: HeldOrder) => {
        setCartItems(order.items);
        setOrderType(order.order_type);
        setSelectedTable(order.table_id);
        setHeldOrders((prev) => prev.filter((o) => o.id !== order.id));
        setHeldOrdersOpen(false);
    };

    const handleDeleteHeld = (orderId: number) => {
        setHeldOrders((prev) => prev.filter((o) => o.id !== orderId));
    };

    // Payment
    const handlePayment = (method: PaymentMethod) => {
        const snapshot = [...cartItems];
        const snapshotTotal = total;
        router.post('/pos/checkout', {
            table_id: selectedTable,
            order_type: orderType,
            items: cartItems.map((ci) => ({ menu_item_id: ci.food_item.id, quantity: ci.quantity })),
            payment_method: method,
        }, {
            onSuccess: () => {
                setLastTotal(snapshotTotal);
                setLastPaymentMethod(method);
                setLastCartItems(snapshot);
                setOrderCounter((n) => n + 1);
                setPaymentOpen(false);
                setSuccessOpen(true);
                toast.success(t('pos.paymentSuccess'));
            },
        });
    };

    const handleNewSale = () => {
        setSuccessOpen(false);
        handleClearCart();
        setOrderType('dine_in');
    };

    const handlePrint = () => {
        window.print();
    };

    const orderTypeOptions: { value: OrderType; label: string; icon: typeof UtensilsCrossed }[] = [
        { value: 'dine_in', label: t('pos.dineIn'), icon: UtensilsCrossed },
        { value: 'takeaway', label: t('pos.takeaway'), icon: ShoppingBag },
        { value: 'delivery', label: t('pos.delivery'), icon: Truck },
    ];

    return (
        <>
            <Head title={t('pos.title')} />

            <div className="flex h-screen flex-col bg-background" dir="rtl">
                {/* Top Bar */}
                <header className="flex items-center justify-between border-b bg-card px-4 py-2 shadow-sm no-print">
                    <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-purple-600 text-white">
                            <span className="text-xs font-bold">TR</span>
                        </div>
                        <h1 className="text-lg font-bold">{t('pos.title')}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Held orders badge */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setHeldOrdersOpen(true)}
                            className="relative"
                        >
                            <Pause className="size-4 me-1.5" />
                            {t('pos.heldOrders')}
                            {heldOrders.length > 0 && (
                                <span className="ms-1.5 flex size-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                                    {heldOrders.length}
                                </span>
                            )}
                        </Button>

                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard">
                                <LogOut className="size-4 me-1.5" />
                                {t('pos.exit')}
                            </Link>
                        </Button>
                    </div>
                </header>

                {/* Main content — split view */}
                <div className="flex flex-1 overflow-hidden">
                    {/* RIGHT SIDE: Menu grid */}
                    <div className="flex-1 flex flex-col overflow-hidden p-4 no-print">
                        <PosMenuGrid
                            items={items}
                            categories={categories}
                            onAddItem={handleAddItem}
                        />
                    </div>

                    {/* LEFT SIDE: Cart + controls */}
                    <div className="flex w-[380px] flex-col border-s bg-card shadow-sm">
                        {/* Order type selector */}
                        <div className="flex gap-1 p-3 border-b">
                            {orderTypeOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        setOrderType(opt.value);
                                        if (opt.value !== 'dine_in') setSelectedTable(null);
                                    }}
                                    className={cn(
                                        'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all',
                                        orderType === opt.value
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'bg-muted hover:bg-muted/80 text-muted-foreground',
                                    )}
                                >
                                    <opt.icon className="size-3.5" />
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Table selector (only for dine-in) */}
                        {orderType === 'dine_in' && (
                            <div className="px-3 py-2 border-b">
                                <Select
                                    value={selectedTable?.toString() || ''}
                                    onValueChange={(val) => setSelectedTable(parseInt(val))}
                                >
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder={t('pos.selectTable')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableTables.map((table) => (
                                            <SelectItem key={table.id} value={table.id.toString()}>
                                                {table.name || `${t('orders.table')} ${table.number}`} ({table.capacity} {t('tables.seats')})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Cart items */}
                        <PosCart
                            items={cartItems}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveItem}
                        />

                        {/* Cart footer */}
                        <div className="border-t p-3 space-y-3">
                            <Separator />

                            {/* Total */}
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold">{t('pos.total')}</span>
                                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {formatPrice(total)}
                                </span>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClearCart}
                                    disabled={cartItems.length === 0}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <Trash2 className="size-4 me-1" />
                                    {t('pos.clearCart')}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleHoldOrder}
                                    disabled={cartItems.length === 0}
                                >
                                    <Pause className="size-4 me-1" />
                                    {t('pos.holdOrder')}
                                </Button>
                            </div>

                            {/* Pay button */}
                            <Button
                                onClick={() => setPaymentOpen(true)}
                                disabled={cartItems.length === 0}
                                className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
                            >
                                {t('pos.pay')} — {formatPrice(total)}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <PosPaymentDialog
                open={paymentOpen}
                onClose={() => setPaymentOpen(false)}
                onConfirm={handlePayment}
                total={total}
            />

            <PosHeldOrders
                open={heldOrdersOpen}
                onClose={() => setHeldOrdersOpen(false)}
                heldOrders={heldOrders}
                onResume={handleResumeOrder}
                onDelete={handleDeleteHeld}
            />

            <PosSuccessDialog
                open={successOpen}
                total={lastTotal}
                onNewSale={handleNewSale}
                onPrint={handlePrint}
            />

            {/* Hidden receipt for printing */}
            <PosReceipt
                items={lastCartItems}
                total={lastTotal}
                orderType={orderType}
                paymentMethod={lastPaymentMethod}
                tableNumber={selectedTable}
                orderNumber={`#${orderCounter}`}
            />
        </>
    );
}
