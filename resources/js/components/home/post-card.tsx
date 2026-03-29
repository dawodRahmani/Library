import { Zap } from 'lucide-react';

export interface PostCardData {
    title: string;
    category: string;
    author: string;
    date: string;
    /** Tailwind gradient class for placeholder bg, e.g. "from-emerald-900 to-teal-800" */
    gradient?: string;
    href?: string;
    size?: 'large' | 'medium' | 'small';
}

const SIZE_HEIGHT: Record<string, string> = {
    large:  'h-[380px]',
    medium: 'h-[185px]',
    small:  'h-[130px]',
};

const SIZE_TITLE: Record<string, string> = {
    large:  'text-2xl',
    medium: 'text-base',
    small:  'text-sm',
};

export function PostCard({ card }: { card: PostCardData }) {
    const size   = card.size ?? 'medium';
    const href   = card.href ?? '#';
    const grad   = card.gradient ?? 'from-slate-900 to-slate-700';

    return (
        <a
            href={href}
            className={`home-card block relative overflow-hidden rounded-xl ${SIZE_HEIGHT[size]} bg-gradient-to-br ${grad} group`}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            {/* Category badge */}
            <span className="absolute top-3 end-3 bg-[#27ae60] text-white text-[11px] px-2 py-0.5 rounded font-bold z-10">
                {card.category}
            </span>

            {/* Flash icon */}
            <span className="absolute top-3 start-3 bg-black/40 text-white p-1 rounded z-10">
                <Zap className="w-3.5 h-3.5" />
            </span>

            {/* Info overlay */}
            <div className="absolute bottom-0 start-0 end-0 p-4 z-10">
                <h2 className={`text-white font-bold leading-snug mb-1 line-clamp-2 ${SIZE_TITLE[size]}`}>
                    {card.title}
                </h2>
                <div className="flex items-center gap-2 text-gray-300 text-[12px]">
                    <span>{card.author}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                    <span>{card.date}</span>
                </div>
            </div>

            {/* Hover shine */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-[#27ae60]/10" />
        </a>
    );
}
