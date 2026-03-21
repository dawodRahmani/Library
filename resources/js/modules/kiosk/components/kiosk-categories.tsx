import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/models';

interface KioskCategoriesProps {
    categories: Category[];
    selectedId: number | null;
    onSelect: (id: number | null) => void;
}

export function KioskCategories({ categories, selectedId, onSelect }: KioskCategoriesProps) {
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-3 px-6 py-4 overflow-x-auto border-b bg-muted/30">
            <Button
                variant={selectedId === null ? 'default' : 'outline'}
                size="lg"
                className={cn('shrink-0 text-base px-6 h-12 rounded-full')}
                onClick={() => onSelect(null)}
            >
                {t('kiosk.allCategories')}
            </Button>
            {categories.map((cat) => (
                <Button
                    key={cat.id}
                    variant={selectedId === cat.id ? 'default' : 'outline'}
                    size="lg"
                    className={cn('shrink-0 text-base px-6 h-12 rounded-full')}
                    onClick={() => onSelect(cat.id)}
                >
                    {cat.name}
                </Button>
            ))}
        </div>
    );
}
