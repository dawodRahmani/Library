import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { CalendarDays, Facebook, Twitter, Youtube, Rss, Linkedin } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';

interface SocialLink { platform: string; url: string; count: string }
interface SharedProps { siteSettings?: { social_links?: SocialLink[] }; [key: string]: unknown }

const PLATFORM_ICONS: Record<string, React.ElementType> = {
    facebook: Facebook, twitter: Twitter, youtube: Youtube, linkedin: Linkedin, rss: Rss,
};


export function TopBar() {
    const { t, i18n } = useTranslation();
    const { siteSettings } = usePage<SharedProps>().props;
    const socials = siteSettings?.social_links ?? [];

    // Format date based on current language
    const formatDate = () => {
        const now = new Date();
        const localeMap: Record<string, string> = {
            'da': 'fa-AF', // Dari -> Persian (Afghanistan)
            'en': 'en-US',
            'ar': 'ar-SA', // Arabic -> Saudi Arabia
        };
        const locale = localeMap[i18n.language] || 'en-US';

        const dateFormatter = new Intl.DateTimeFormat(locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        return dateFormatter.format(now);
    };

    return (
        <div className="bg-[#141824] text-gray-400 text-[13px] border-b border-white/5">
            <div className="max-w-[1240px] mx-auto px-4 py-2 flex justify-between items-center">
                {/* Date */}
                <div className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
                    <span>{t('today')} — {formatDate()}</span>
                </div>

                {/* Language + Social */}
                <div className="flex items-center gap-4">
                    {/* Language switcher */}
                    <LanguageSwitcher />

                    {/* Social icons */}
                    {socials.length > 0 && (
                        <div className="hidden sm:flex items-center gap-3">
                            {socials.map((s) => {
                                const Icon = PLATFORM_ICONS[s.platform] ?? Rss;
                                return (
                                    <a key={s.platform} href={s.url || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                        <Icon className="w-3.5 h-3.5" />
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
