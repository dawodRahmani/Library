import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({
    size = 'md',
    className = '',
    ...props
}: ImgHTMLAttributes<HTMLImageElement> & { size?: 'sm' | 'md' | 'lg' }) {
    const dimensions = { sm: 'h-8 w-auto', md: 'h-10 w-auto', lg: 'h-20 w-auto' };

    return (
        <img
            src="/falogo.png"
            alt="Library"
            {...props}
            className={`${dimensions[size]} object-contain ${className}`}
        />
    );
}
