import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface TickerItem { da: string; en: string; ar?: string; tg?: string }
interface SharedProps { siteSettings?: { ticker_items?: TickerItem[] }; [key: string]: unknown }

const FALLBACK: TickerItem[] = [
    { da: 'به کتابخانه رسالت خوش آمدید', en: 'Welcome to Resalat Library', ar: 'مرحباً بكم في مكتبة الرسالة', tg: 'Ба Китобхонаи Рисолат хуш омадед' },
];

export function NewsTicker() {
    const { i18n } = useTranslation();
    const { siteSettings } = usePage<SharedProps>().props;
    const locale = ['da', 'en', 'ar', 'tg'].includes(i18n.language) ? i18n.language : 'da';

    const items: TickerItem[] = siteSettings?.ticker_items?.length
        ? siteSettings.ticker_items
        : FALLBACK;

    const texts = items.map((t) => {
        if (locale === 'en') return t.en || t.da;
        if (locale === 'ar') return t.ar || t.da;
        if (locale === 'tg') return t.tg || t.da;
        return t.da || t.en;
    }).filter(Boolean);

    return (
        <div className="bg-[#1a252f] border-y border-white/10 overflow-hidden">
            <div className="max-w-[1240px] mx-auto px-4">
                <div className="flex items-stretch h-10">
                    <div className="flex-1 overflow-hidden relative">
                        <div className="ticker-track flex items-center h-full gap-10 text-gray-300 text-[13px]">
                            {[...texts, ...texts].map((text, i) => (
                                <span key={i} className="flex items-center gap-2 shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#27ae60] shrink-0" />
                                    {text}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
