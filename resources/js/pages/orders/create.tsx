import { useState, useCallback } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Truck, UtensilsCrossed } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { FoodItem, Category, RestaurantTable } from '@/data/mock/types';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { FoodSelector } from '@/modules/orders/components/food-selector';
import { OrderCart } from '@/modules/orders/components/order-cart';

interface Props extends Record<string, unknown> {
    tables: RestaurantTable[];
    categories: Category[];
    items: FoodItem[];
    preselectedTable: number | null;
}

type OrderType = 'dine_in' | 'takeaway' | 'delivery';

interface CartItem {
    food_item: FoodItem;
    quantity: number;
    notes?: string;
}

export default function CreateOrderPage() {
    const { t } = useTranslation();
    const { tables, categories, items, preselectedTable } = usePage<Props>().props;

    const [orderType, setOrderType] = useState<OrderType>(preselectedTable ? 'dine_in' : 'dine_in');
    const [selectedTable, setSelectedTable] = useState<number | null>(preselectedTable ?? null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('orders.title'), href: '/orders' },
        { title: t('orders.newOrder'), href: '/orders/create' },
    ];

    const availableTables = tables.filter((table) => table.status === 'available' || table.id === selectedTable);

    const orderTypeOptions: { value: OrderType; label: string; icon: typeof UtensilsCrossed }[] = [
        { value: 'dine_in', label: t('orders.dineIn'), icon: UtensilsCrossed },
        { value: 'takeaway', label: t('orders.takeaway'), icon: ShoppingBag },
        { value: 'delivery', label: t('orders.delivery'), icon: Truck },
    ];

    const handleOrderTypeChange = (type: OrderType) => {
        setOrderType(type);
        if (type !== 'dine_in') setSelectedTable(null);
    };

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

    const handleUpdateNotes = useCallback((foodItemId: number, notes: string) => {
        setCartItems((prev) =>
            prev.map((ci) =>
                ci.food_item.id === foodItemId ? { ...ci, notes } : ci,
            ),
        );
    }, []);

    const handleSubmit = () => {
        if (cartItems.length === 0) return;

        router.post('/orders', {
            table_id: orderType === 'dine_in' ? selectedTable : null,
            order_type: orderType,
            notes: '',
            items: cartItems.map((ci) => ({
                menu_item_id: ci.food_item.id,
                quantity: ci.quantity,
                unit_price: ci.food_item.price,
                notes: ci.notes ?? '',
            })),
        });
    };

    const handleCancel = () => {
        router.visit('/orders');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('orders.newOrder')} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header bar: title + order type + table */}
                <div className="flex flex-wrap items-center gap-4">
                    <h1 className="text-2xl font-bold">{t('orders.newOrder')}</h1>

                    {/* Order type toggle */}
                    <div className="flex items-center rounded-xl border bg-muted/30 p-1 gap-1">
                        {orderTypeOptions.map((opt) => (
                            <Button
                                key={opt.value}
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOrderTypeChange(opt.value)}
                                className={cn(
                                    'gap-1.5 rounded-lg px-4 h-9 transition-all',
                                    orderType === opt.value
                                        ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <opt.icon className="size-4" />
                                {opt.label}
                            </Button>
                        ))}
                    </div>

                    {/* Table selector (dine-in only) */}
                    {orderType === 'dine_in' && (
                        <Select
                            value={selectedTable?.toString() || ''}
                            onValueChange={(val) => setSelectedTable(parseInt(val))}
                        >
                            <SelectTrigger className="w-56 h-9">
                                <SelectValue placeholder={t('orders.selectTable')} />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTables.map((table) => (
                                    <SelectItem key={table.id} value={table.id.toString()}>
                                        {table.name || `${t('orders.table')} ${table.number}`} ({table.capacity} {t('tables.seats')})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {/* Split view: menu | cart */}
                <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-5 min-h-0">
                    {/* Food selector */}
                    <div className="lg:col-span-3 overflow-y-auto rounded-xl border bg-card p-4">
                        <FoodSelector
                            items={items}
                            categories={categories}
                            onAddItem={handleAddItem}
                        />
                    </div>

                    {/* Cart */}
                    <div className="lg:col-span-2">
                        <OrderCart
                            cartItems={cartItems}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveItem}
                            onUpdateNotes={handleUpdateNotes}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            selectedTable={selectedTable}
                            orderType={orderType}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
