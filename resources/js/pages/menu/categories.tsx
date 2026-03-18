import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Category } from '@/data/mock/types';
import { CategoryList } from '@/modules/menu/components/category-list';
import { AddCategoryModal } from '@/modules/menu/components/add-category-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface Props extends Record<string, unknown> { categories: Category[] }

export default function CategoriesPage() {
    const { t } = useTranslation();
    const { categories: initialCategories } = usePage<Props>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('menu.title'), href: '/menu' },
        { title: t('menu.categories'), href: '/menu/categories' },
    ];

    const [categories, setCategories] = useState(initialCategories);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

    useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    function handleEdit(cat: Category) {
        setEditingCategory(cat);
        setModalOpen(true);
    }

    function handleDelete(id: number) {
        router.delete(`/menu/categories/${id}`);
    }

    function handleOpenAdd() {
        setEditingCategory(undefined);
        setModalOpen(true);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('menu.categories')} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('menu.categories')}</h1>

                    <Button onClick={handleOpenAdd}>
                        <Plus className="size-4" />
                        {t('menu.addCategory')}
                    </Button>
                </div>

                {/* Categories table */}
                <Card>
                    <CardContent className="p-0">
                        <CategoryList
                            categories={categories}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </CardContent>
                </Card>
            </div>

            <AddCategoryModal
                open={modalOpen}
                onOpenChange={(open) => {
                    setModalOpen(open);
                    if (!open) setEditingCategory(undefined);
                }}
                category={editingCategory}
            />
        </AppLayout>
    );
}
