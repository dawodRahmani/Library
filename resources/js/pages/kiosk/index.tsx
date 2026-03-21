import { useState, useMemo, useCallback, useRef } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useEcho } from '@laravel/echo-react';
import { toast } from 'sonner';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FoodItem, Category, RestaurantTable } from '@/types/models';

interface Props extends Record<string, unknown> {
    items: FoodItem[];
    categories: Category[];
    tables: RestaurantTable[];
}
import { KioskHeader } from '@/modules/kiosk/components/kiosk-header';
import { KioskCategories } from '@/modules/kiosk/components/kiosk-categories';
import { KioskMenuGrid } from '@/modules/kiosk/components/kiosk-menu-grid';
import { KioskCart, type CartItem } from '@/modules/kiosk/components/kiosk-cart';
import { KioskTableSelect } from '@/modules/kiosk/components/kiosk-table-select';
import { KioskOrderSuccess } from '@/modules/kiosk/components/kiosk-order-success';

type KioskView = 'menu' | 'success';

export default function KioskPage() {
    const { t } = useTranslation();
    const { items, categories, tables } = usePage<Props>().props;

    const [view, setView] = useState<KioskView>('menu');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [tableDialogOpen, setTableDialogOpen] = useState(false);
    const lastOrderIdRef = useRef<number | null>(null);

    // ── Real-time: order status updates (public channel) ────
    const statusKeys: Record<string, string> = {
        pending: 'orders.statusPending',
        in_kitchen: 'orders.statusInKitchen',
        ready: 'orders.statusReady',
        served: 'orders.statusServed',
        paid: 'orders.statusPaid',
        cancelled: 'orders.statusCancelled',
    };

    useEcho(
        'public-restaurant',
        '.OrderStatusChanged',
        (payload: { order_id: number; status: string }) => {
            if (lastOrderIdRef.current && payload.order_id === lastOrderIdRef.current) {
                const statusLabel = t(statusKeys[payload.status] || payload.status);
                toast.info(t('kiosk.orderUpdate'), {
                    description: statusLabel,
                    duration: 6000,
                });
            }
        },
        [t],
        'public',
    );

    // ── Real-time: menu availability changes ────────────────
    useEcho(
        'public-restaurant',
        '.MenuAvailabilityChanged',
        (payload: { item_id: number; is_available: boolean }) => {
            router.reload({ only: ['items'] });
            if (!payload.is_available) {
                const item = items.find((i) => i.id === payload.item_id);
                if (item) {
                    toast.warning(t('digitalMenu.itemUnavailable'), {
                        description: item.name,
                        duration: 4000,
                    });
                    // Remove from cart if present
                    setCart((prev) => prev.filter((ci) => ci.item.id !== payload.item_id));
                }
            }
        },
        [items, t],
        'public',
    );

    // Filter items by category
    const filteredItems = useMemo(() => {
        if (selectedCategory === null) return items;
        return items.filter((item) => item.category_id === selectedCategory);
    }, [selectedCategory, items]);

    // Cart actions
    const addToCart = useCallback((item: FoodItem) => {
        setCart((prev) => {
            const existing = prev.find((ci) => ci.item.id === item.id);
            if (existing) {
                return prev.map((ci) =>
                    ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci,
                );
            }
            return [...prev, { item, quantity: 1 }];
        });
    }, []);

    const increaseItem = useCallback((itemId: number) => {
        setCart((prev) =>
            prev.map((ci) =>
                ci.item.id === itemId ? { ...ci, quantity: ci.quantity + 1 } : ci,
            ),
        );
    }, []);

    const decreaseItem = useCallback((itemId: number) => {
        setCart((prev) =>
            prev
                .map((ci) =>
                    ci.item.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci,
                )
                .filter((ci) => ci.quantity > 0),
        );
    }, []);

    const removeItem = useCallback((itemId: number) => {
        setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
    }, []);

    const handleSubmitOrder = () => {
        router.post('/kiosk/order', {
            table_id: selectedTable,
            order_type: selectedTable ? 'dine_in' : 'takeaway',
            items: cart.map((ci) => ({ menu_item_id: ci.item.id, quantity: ci.quantity })),
        }, {
            onSuccess: (page) => {
                const orderId = (page.props as Record<string, unknown>).lastOrderId as number | undefined;
                if (orderId) lastOrderIdRef.current = orderId;
                setView('success');
            },
        });
    };

    const handleNewOrder = () => {
        setCart([]);
        setSelectedTable(null);
        setSelectedCategory(null);
        lastOrderIdRef.current = null;
        setView('menu');
    };

    return (
        <>
            <Head title={t('kiosk.title')} />
            <div className="flex flex-col h-screen bg-background">
                {/* Header */}
                <KioskHeader />

                {view === 'success' ? (
                    <KioskOrderSuccess
                        tableNumber={selectedTable}
                        onNewOrder={handleNewOrder}
                    />
                ) : (
                    <>
                        {/* Category tabs */}
                        <KioskCategories
                            categories={categories}
                            selectedId={selectedCategory}
                            onSelect={setSelectedCategory}
                        />

                        {/* Main content: menu + cart */}
                        <div className="flex flex-1 min-h-0">
                            {/* Menu grid (scrollable) */}
                            <div className="flex-1 overflow-y-auto">
                                {/* Table selector bar */}
                                <div className="px-6 pt-4">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="gap-2 rounded-full"
                                        onClick={() => setTableDialogOpen(true)}
                                    >
                                        <MapPin className="size-4" />
                                        {selectedTable
                                            ? `${t('kiosk.table')} ${selectedTable}`
                                            : t('kiosk.selectTable')
                                        }
                                    </Button>
                                </div>

                                <KioskMenuGrid
                                    items={filteredItems}
                                    onAddItem={addToCart}
                                />
                            </div>

                            {/* Cart sidebar */}
                            <div className="w-[380px] shrink-0">
                                <KioskCart
                                    items={cart}
                                    onIncrease={increaseItem}
                                    onDecrease={decreaseItem}
                                    onRemove={removeItem}
                                    onSubmit={handleSubmitOrder}
                                    selectedTable={selectedTable}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Footer */}
                <footer className="text-center py-2 text-xs text-muted-foreground border-t">
                    {t('kiosk.poweredBy')}
                </footer>
            </div>

            {/* Table select dialog */}
            <KioskTableSelect
                open={tableDialogOpen}
                onClose={() => setTableDialogOpen(false)}
                tables={tables}
                selectedTable={selectedTable}
                onSelect={setSelectedTable}
            />
        </>
    );
}
