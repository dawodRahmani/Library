import { useState, useCallback } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { FoodItem, Category, Order, RestaurantTable } from '@/types/models';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FoodSelector } from '@/modules/orders/components/food-selector';
import { OrderCart } from '@/modules/orders/components/order-cart';

interface Props extends Record<string, unknown> {
    order: Order;
    tables: RestaurantTable[];
    categories: Category[];
    items: FoodItem[];
}

interface CartItem {
    food_item: FoodItem;
    quantity: number;
    notes?: string;
}

export default function EditOrderPage() {
    const { t } = useTranslation();
    const { order, tables, categories, items: foodItems } = usePage<Props>().props;

    const initialCart: CartItem[] = order.items.map((item) => ({
        food_item: item.food_item,
        quantity: item.quantity,
        notes: item.notes,
    }));

    const [selectedTable, setSelectedTable] = useState<number | null>(order.table_id ?? null);
    const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('orders.title'), href: '/orders' },
        { title: order.order_number, href: `/orders/${order.id}` },
        { title: t('orders.editOrder'), href: `/orders/${order.id}/edit` },
    ];

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

        router.patch(`/orders/${order.id}`, {
            table_id: selectedTable,
            notes: order.notes ?? '',
            items: cartItems.map((ci) => ({
                menu_item_id: ci.food_item.id,
                quantity: ci.quantity,
                unit_price: ci.food_item.price,
                notes: ci.notes ?? '',
            })),
        });
    };

    const handleCancel = () => {
        router.visit(`/orders/${order.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('orders.editOrder')} ${order.order_number}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">
                        {t('orders.editOrder')} — {order.order_number}
                    </h1>
                    <div className="flex items-center gap-2">
                        <Label>{t('orders.selectTable')}</Label>
                        <Select
                            value={selectedTable?.toString() || ''}
                            onValueChange={(val) => setSelectedTable(parseInt(val))}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder={t('orders.selectTable')} />
                            </SelectTrigger>
                            <SelectContent>
                                {tables.map((table) => (
                                    <SelectItem key={table.id} value={table.id.toString()}>
                                        {table.name || `${t('orders.table')} ${table.number}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid flex-1 grid-cols-5 gap-4">
                    <div className="col-span-3 overflow-y-auto">
                        <FoodSelector
                            items={foodItems}
                            categories={categories}
                            onAddItem={handleAddItem}
                        />
                    </div>
                    <div className="col-span-2">
                        <OrderCart
                            cartItems={cartItems}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveItem}
                            onUpdateNotes={handleUpdateNotes}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            selectedTable={selectedTable}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
