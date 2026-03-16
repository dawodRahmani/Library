import { useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { FoodItem } from '@/data/mock/types';
import { mockFoodItems, mockCategories, mockTables } from '@/data/mock';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FoodSelector } from '@/modules/orders/components/food-selector';
import { OrderCart } from '@/modules/orders/components/order-cart';

interface CartItem {
    food_item: FoodItem;
    quantity: number;
    notes?: string;
}

export default function CreateOrderPage() {
    const { t } = useTranslation();

    const initialTable = new URLSearchParams(window.location.search).get('table');
    const [selectedTable, setSelectedTable] = useState<number | null>(
        initialTable ? parseInt(initialTable) : null,
    );
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('orders.title'), href: '/orders' },
        { title: t('orders.newOrder'), href: '/orders/create' },
    ];

    const availableTables = mockTables.filter((table) => table.status === 'available');

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
        alert(t('orders.orderCreatedSuccess'));
        router.visit('/orders');
    };

    const handleCancel = () => {
        router.visit('/orders');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('orders.newOrder')} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">{t('orders.newOrder')}</h1>
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
                                {availableTables.map((table) => (
                                    <SelectItem key={table.id} value={table.id.toString()}>
                                        {table.name || `${t('orders.table')} ${table.number}`} ({t('orders.capacity')}: {table.capacity})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid flex-1 grid-cols-5 gap-4">
                    <div className="col-span-3 overflow-y-auto">
                        <FoodSelector
                            items={mockFoodItems}
                            categories={mockCategories}
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
