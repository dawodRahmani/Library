import { useTranslation } from 'react-i18next';

export interface HeroItem {
    type: string;
    title: string;
    category: { da: string; en: string };
    link: string;
    image: string;
}

interface Props { heroItems: HeroItem[] }

function HeroCard({
    item, size, locale,
}: { item: HeroItem; size: 'large' | 'medium'; locale: string }) {
    const catLabel = locale === 'en'
        ? (item.category.en || item.category.da)
        : (item.category.da || item.category.en);

    return (
        <a
            href={item.link}
            className={`relative block rounded-xl overflow-hidden group ${size === 'large' ? 'h-72 lg:h-full' : 'h-36'}`}
        >
            <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

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
    const locale = ['da', 'en', 'ar', 'tg'].includes(i18n.language) ? i18n.language : 'da';

    if (!heroItems || heroItems.length === 0) return null;

    const [main, ...rest] = heroItems;
    const sides = rest.slice(0, 4);

    // 1 item: full-width large card
    if (sides.length === 0) {
        return (
            <div className="py-6">
                <div className="h-72">
                    <HeroCard item={main} size="large" locale={locale} />
                </div>
            </div>
        );
    }

    // 2-3 items: large on left, column of smalls on right
    if (sides.length <= 2) {
        return (
            <div className="py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: 288 }}>
                    <HeroCard item={main} size="large" locale={locale} />
                    <div className="flex flex-col gap-4">
                        {sides.map((card, i) => (
                            <HeroCard key={i} item={card} size="medium" locale={locale} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // 4-5 items: large on left, 2×2 grid on right
    return (
        <div className="py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: 288 }}>
                <HeroCard item={main} size="large" locale={locale} />
                <div className="grid grid-cols-2 gap-4">
                    {sides.map((card, i) => (
                        <HeroCard key={i} item={card} size="medium" locale={locale} />
                    ))}
                </div>
            </div>
        </div>
    );
}
