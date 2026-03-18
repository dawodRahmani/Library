import { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Search, UtensilsCrossed } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { FoodItem, Category } from '@/data/mock/types';
import { MenuHeader } from '@/modules/digital-menu/components/menu-header';
import { MenuCategoryNav } from '@/modules/digital-menu/components/menu-category-nav';
import { MenuFoodCard } from '@/modules/digital-menu/components/menu-food-card';
import { CallWaiterButton } from '@/modules/digital-menu/components/call-waiter-button';

interface Props extends Record<string, unknown> {
    items: FoodItem[];
    categories: Category[];
}

export default function DigitalMenuPage() {
    const { t } = useTranslation();
    const { items, categories } = usePage<Props>().props;

    const params = new URLSearchParams(window.location.search);
    const tableNumber = params.get('table') ? parseInt(params.get('table')!) : null;

    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesCategory = activeCategory === null || item.category_id === activeCategory;
            const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, search, items]);

    const availableItems = filteredItems.filter((i) => i.is_available);
    const unavailableItems = filteredItems.filter((i) => !i.is_available);

    // Group available items by category when showing all
    const groupedByCategory = useMemo(() => {
        if (activeCategory !== null || search) return null;
        const map = new Map<number, { category: Category; items: FoodItem[] }>();
        for (const item of availableItems) {
            if (!map.has(item.category_id)) {
                const cat = categories.find((c) => c.id === item.category_id);
                if (cat) map.set(item.category_id, { category: cat, items: [] });
            }
            map.get(item.category_id)?.items.push(item);
        }
        return Array.from(map.values());
    }, [availableItems, activeCategory, search, categories]);

    return (
        <>
            <Head title={t('digitalMenu.title')} />

            <div className="min-h-screen bg-gray-50 dark:bg-background">
                <MenuHeader tableNumber={tableNumber} />
                <MenuCategoryNav
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />

                <main className="mx-auto max-w-3xl px-4 pb-28 pt-5">

                    {/* Search */}
                    <div className="relative mb-5">
                        <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder={t('digitalMenu.searchPlaceholder')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="ps-10 h-12 rounded-2xl bg-white dark:bg-card border-border/50 shadow-sm text-base"
                        />
                    </div>

                    {filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                            <div className="flex size-20 items-center justify-center rounded-full bg-muted mb-4">
                                <UtensilsCrossed className="size-9 opacity-40" />
                            </div>
                            <p className="text-lg font-semibold">{t('digitalMenu.noItems')}</p>
                            <p className="text-sm mt-1 opacity-70">{t('digitalMenu.searchPlaceholder')}</p>
                        </div>
                    ) : groupedByCategory ? (
                        /* Grouped view (all categories, no search) */
                        <div className="space-y-8">
                            {groupedByCategory.map(({ category, items: catItems }) => (
                                <section key={category.id}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <h2 className="text-base font-bold text-foreground">{category.name}</h2>
                                        <div className="flex-1 h-px bg-border/50" />
                                        <span className="text-xs text-muted-foreground">{catItems.length} {t('digitalMenu.items')}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {catItems.map((item) => (
                                            <MenuFoodCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                </section>
                            ))}

                            {unavailableItems.length > 0 && (
                                <section>
                                    <div className="flex items-center gap-3 mb-3">
                                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                            {t('digitalMenu.unavailable')}
                                        </h2>
                                        <div className="flex-1 h-px bg-border/30" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {unavailableItems.map((item) => (
                                            <MenuFoodCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    ) : (
                        /* Filtered view (single category or search) */
                        <div className="space-y-6">
                            {availableItems.length > 0 && (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {availableItems.map((item) => (
                                        <MenuFoodCard key={item.id} item={item} />
                                    ))}
                                </div>
                            )}

                            {unavailableItems.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                                        {t('digitalMenu.unavailable')}
                                    </p>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {unavailableItems.map((item) => (
                                            <MenuFoodCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>

                {tableNumber && <CallWaiterButton />}

                <footer className="border-t bg-white dark:bg-card py-5 text-center text-xs text-muted-foreground">
                    <p>{t('digitalMenu.poweredBy')}</p>
                </footer>
            </div>
        </>
    );
}
