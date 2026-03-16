import type { SVGAttributes } from 'react';

export default function AppLogoIcon({
    size = 'md',
    ...props
}: SVGAttributes<SVGElement> & { size?: 'sm' | 'md' | 'lg' }) {
    const dimensions = {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-20 w-20',
    };

    return (
        <svg
            {...props}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className={`${dimensions[size]} ${props.className || ''}`}
        >
            <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="logoGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="60%" stopColor="#6ee7b7" />
                    <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
            </defs>

            {/* Outer rounded square */}
            <rect
                x="8"
                y="8"
                width="184"
                height="184"
                rx="44"
                fill="url(#logoGrad)"
            />

            {/* Inner subtle border */}
            <rect
                x="16"
                y="16"
                width="168"
                height="168"
                rx="38"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
            />

            {/* Letter T */}
            <text
                x="66"
                y="135"
                fontFamily="'Segoe UI', Arial, sans-serif"
                fontWeight="800"
                fontSize="100"
                fill="white"
                textAnchor="middle"
                letterSpacing="-4"
            >
                T
            </text>

            {/* Letter R */}
            <text
                x="138"
                y="135"
                fontFamily="'Segoe UI', Arial, sans-serif"
                fontWeight="800"
                fontSize="100"
                fill="rgba(255,255,255,0.85)"
                textAnchor="middle"
                letterSpacing="-4"
            >
                R
            </text>

            {/* Small red diamond accent */}
            <rect
                x="94"
                y="148"
                width="12"
                height="12"
                rx="2"
                fill="#ef4444"
                transform="rotate(45 100 154)"
            />
        </svg>
    );
}
