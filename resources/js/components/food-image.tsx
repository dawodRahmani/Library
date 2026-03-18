import { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FoodImageProps {
    src?: string | null;
    alt: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    xs: 'size-10',
    sm: 'size-16',
    md: 'h-32 w-full',
    lg: 'h-40 w-full',
};

const iconSizes = {
    xs: 'size-4',
    sm: 'size-6',
    md: 'size-10',
    lg: 'size-12',
};

export function FoodImage({ src, alt, size = 'md', className }: FoodImageProps) {
    const [error, setError] = useState(false);
    const showImage = src && !error;

    return (
        <div
            className={cn(
                'relative flex items-center justify-center overflow-hidden bg-muted/50 shrink-0',
                size === 'xs' || size === 'sm' ? 'rounded-xl' : 'rounded-none',
                sizeClasses[size],
                className,
            )}
        >
            {showImage ? (
                <img
                    src={src}
                    alt={alt}
                    className="size-full object-cover"
                    onError={() => setError(true)}
                    loading="lazy"
                />
            ) : (
                <UtensilsCrossed className={cn('text-muted-foreground/30', iconSizes[size])} />
            )}
        </div>
    );
}
