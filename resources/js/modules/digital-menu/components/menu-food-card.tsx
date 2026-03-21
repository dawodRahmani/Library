import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UtensilsCrossed } from 'lucide-react';
import type { FoodItem } from '@/types/models';

function formatPrice(amount: number): string { return `${amount.toLocaleString()} ؋`; }

interface MenuFoodCardProps {
    item: FoodItem;
}

export function MenuFoodCard({ item }: MenuFoodCardProps) {
    const { t } = useTranslation();
    const [imgError, setImgError] = useState(false);
    const showImage = item.image && !imgError;

    return (
        <div
            className={`group relative flex flex-col rounded-2xl overflow-hidden border bg-white dark:bg-card shadow-sm transition-all duration-200 ${
                item.is_available
                    ? 'border-border/40 hover:shadow-lg hover:-translate-y-0.5'
                    : 'border-border/20 opacity-60'
            }`}
        >
            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/60">
                {showImage ? (
                    <img
                        src={item.image!}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <UtensilsCrossed className="size-10 text-muted-foreground/20" />
                    </div>
                )}

                {/* Unavailable overlay */}
                {!item.is_available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                            {t('digitalMenu.unavailable')}
                        </span>
                    </div>
                )}

                {/* Category chip */}
                {item.category?.name && (
                    <div className="absolute bottom-2 start-2">
                        <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                            {item.category.name}
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col p-3 gap-1">
                <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
                    {item.name}
                </h3>
                <p className={`text-base font-bold mt-0.5 ${
                    item.is_available
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-muted-foreground'
                }`}>
                    {formatPrice(item.price)}
                </p>
            </div>
        </div>
    );
}
