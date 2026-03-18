import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { Category } from '@/data/mock/types';

interface MenuCategoryNavProps {
    categories: Category[];
    activeCategory: number | null;
    onCategoryChange: (id: number | null) => void;
}

export function MenuCategoryNav({ categories, activeCategory, onCategoryChange }: MenuCategoryNavProps) {
    const { t } = useTranslation();

    return (
        <div className="sticky top-[57px] z-10 border-b bg-white/95 backdrop-blur-md dark:bg-card/95">
            <div className="mx-auto max-w-3xl overflow-x-auto px-4 scrollbar-hide">
                <div className="flex gap-2 py-3">
                    <button
                        onClick={() => onCategoryChange(null)}
                        className={cn(
                            'shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200',
                            activeCategory === null
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-105'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
                        )}
                    >
                        {t('digitalMenu.allItems')}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryChange(cat.id)}
                            className={cn(
                                'shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap',
                                activeCategory === cat.id
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-105'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
                            )}
                        >
                            {cat.name}
                            {cat.items_count !== undefined && (
                                <span className={cn(
                                    'ms-1.5 rounded-full px-1.5 text-[10px]',
                                    activeCategory === cat.id ? 'bg-white/20' : 'bg-background',
                                )}>
                                    {cat.items_count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
