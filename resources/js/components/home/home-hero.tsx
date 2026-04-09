import { useTranslation } from 'react-i18next';

export interface HeroItem {
    type: string;
    title: string;
    category: { da: string; en: string };
    link: string;
    gradient: string;
    cover_image?: string | null;
}

interface Props { heroItems: HeroItem[] }

const TYPE_LABEL: Record<string, { da: string; en: string }> = {
    book:    { da: 'کتاب',    en: 'Book'    },
    article: { da: 'مقاله',   en: 'Article' },
    video:   { da: 'ویدیو',   en: 'Video'   },
    audio:   { da: 'صوت',     en: 'Audio'   },
};

function HeroCard({
    item, size, locale,
}: { item: HeroItem; size: 'large' | 'medium'; locale: string }) {
    const catLabel = locale === 'en'
        ? (item.category.en || item.category.da)
        : (item.category.da || item.category.en);

    return (
        <a
            href={item.link}
            className={`relative block rounded-xl overflow-hidden home-card ${size === 'large' ? 'h-72 lg:h-full' : 'h-36'}`}
        >
            {/* Background: cover image or gradient */}
            {item.cover_image ? (
                <img
                    src={`/storage/${item.cover_image}`}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 inset-x-0 p-4">
                <span className="inline-block bg-[#27ae60] text-white text-[11px] font-bold px-2.5 py-1 rounded-full mb-2">
                    {catLabel}
                </span>
                <h3 className={`text-white font-bold leading-snug line-clamp-2 ${size === 'large' ? 'text-[18px]' : 'text-[13px]'}`}>
                    {item.title}
                </h3>
            </div>
        </a>
    );
}

export function HomeHero({ heroItems }: Props) {
    const { i18n } = useTranslation();
    const locale = ['da', 'en', 'ar'].includes(i18n.language) ? i18n.language : 'da';

    const [main, ...sides] = heroItems;
    const sideCards = sides.slice(0, 4);

    if (!main) return null;

    return (
        <div className="py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: 288 }}>
                {/* Large featured card */}
                <HeroCard item={main} size="large" locale={locale} />

                {/* 2×2 grid of smaller cards */}
                <div className="grid grid-cols-2 gap-4">
                    {sideCards.map((card, i) => (
                        <HeroCard key={i} item={card} size="medium" locale={locale} />
                    ))}
                </div>
            </div>
        </div>
    );
}
