import { useTranslation } from 'react-i18next';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Category } from '@/data/mock/types';
import { Pencil, Trash2 } from 'lucide-react';

interface CategoryListProps {
    categories: Category[];
    onEdit: (cat: Category) => void;
    onDelete: (id: number) => void;
}

export function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
    const { t } = useTranslation();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>{t('menu.categoryName')}</TableHead>
                    <TableHead>{t('menu.itemsCount')}</TableHead>
                    <TableHead className="text-end">{t('common.actions')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map((cat, index) => (
                    <TableRow key={cat.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell>{cat.items_count ?? 0}</TableCell>
                        <TableCell>
                            <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => onEdit(cat)}>
                                    <Pencil className="size-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => onDelete(cat.id)}>
                                    <Trash2 className="size-4 text-destructive" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
