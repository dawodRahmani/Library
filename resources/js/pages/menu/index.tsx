import { useState, useMemo, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { FoodItem, Category } from '@/types/models';
import { FoodItemGrid } from '@/modules/menu/components/food-item-grid';
import { AddFoodModal } from '@/modules/menu/components/add-food-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Grid3X3 } from 'lucide-react';

interface Props extends Record<string, unknown> { items: FoodItem[]; categories: Category[] }

export default function MenuPage() {
    const { t } = useTranslation();
    const { items: foodItems, categories } = usePage<Props>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('menu.title'), href: '/menu' },
    ];

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<FoodItem | undefined>(undefined);
    const [items, setItems] = useState(foodItems);

    useEffect(() => {
        setItems(foodItems);
    }, [foodItems]);

    const filteredItems = useMemo(() => {
        let result = items;

        if (selectedCategory !== null) {
            result = result.filter((item) => item.category_id === selectedCategory);
        }

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter((item) => item.name.toLowerCase().includes(q));
        }

        return result;
    }, [items, selectedCategory, search]);

    function handleEdit(item: FoodItem) {
        setEditingItem(item);
        setModalOpen(true);
    }

    function handleToggleAvailability(id: number) {
        // Optimistic update
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, is_available: !item.is_available } : item,
            ),
        );
        router.patch(`/menu/items/${id}/availability`);
    }

    function handleOpenAdd() {
        setEditingItem(undefined);
        setModalOpen(true);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('menu.title')} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">{t('menu.title')}</h1>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={t('menu.searchPlaceholder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="ps-9 w-64"
                            />
                        </div>

                        <Button variant="outline" asChild>
                            <Link href="/menu/categories">
                                <Grid3X3 className="size-4" />
                                {t('menu.categories')}
                            </Link>
                        </Button>

                        <Button onClick={handleOpenAdd}>
                            <Plus className="size-4" />
                            {t('menu.addFood')}
                        </Button>
                    </div>
                </div>

                {/* Category filter tabs */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant={selectedCategory === null ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(null)}
                    >
                        {t('common.all')}
                    </Button>
                    {categories.map((cat) => (
                        <Button
                            key={cat.id}
                            variant={selectedCategory === cat.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            {cat.name}
                        </Button>
                    ))}
                </div>

                {/* Food items grid */}
                {filteredItems.length > 0 ? (
                    <FoodItemGrid
                        items={filteredItems}
                        onEdit={handleEdit}
                        onToggleAvailability={handleToggleAvailability}
                    />
                ) : (
                    <div className="flex flex-1 items-center justify-center text-muted-foreground">
                        {t('menu.noItems')}
                    </div>
                )}
            </div>

            <AddFoodModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                item={editingItem}
                categories={categories}
            />
        </AppLayout>
    );
}
