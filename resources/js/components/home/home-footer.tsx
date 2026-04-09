import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Youtube, Linkedin, Rss } from 'lucide-react';

interface SocialLink { platform: string; url: string; count: string }
interface SiteSettings {
    site_name?:    { da: string; en: string; ar?: string };
    footer_about?: { da: string; en: string; ar?: string };
    social_links?: SocialLink[];
}
interface SharedProps { siteSettings?: SiteSettings; [key: string]: unknown }

const PLATFORM_ICONS: Record<string, React.ElementType> = {
    facebook: Facebook, twitter: Twitter, youtube: Youtube, linkedin: Linkedin, rss: Rss,
};
const PLATFORM_COLORS: Record<string, string> = {
    facebook: 'hover:bg-[#3b5998]',
    twitter:  'hover:bg-[#1da1f2]',
    youtube:  'hover:bg-[#ff0000]',
    linkedin: 'hover:bg-[#0077b5]',
    rss:      'hover:bg-[#f26522]',
};

function FooterWidget({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10 relative">
                <div className="absolute bottom-[-1px] end-0 w-16 h-[1px] bg-[#27ae60]" />
                <h3 className="text-white font-bold text-[15px] flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#27ae60] rounded-full inline-block" />
                    {title}
                </h3>
            </div>
            {children}
        </div>
    );
}

export function HomeFooter() {
    const { t, i18n } = useTranslation();
    const { siteSettings } = usePage<SharedProps>().props;
    const locale = (['da', 'en', 'ar'] as const).includes(i18n.language as 'da' | 'en' | 'ar') ? i18n.language as 'da' | 'en' | 'ar' : 'da' as const;

    const siteName   = siteSettings?.site_name?.[locale]   || siteSettings?.site_name?.da    || t('app.name');
    const aboutText  = siteSettings?.footer_about?.[locale] || siteSettings?.footer_about?.da || t('footer.description');
    const socials    = siteSettings?.social_links ?? [];

    const navLinks = [
        { label: t('nav.library'),    href: '/library' },
        { label: t('nav.darUlIfta'), href: '/dar-ul-ifta' },
        { label: t('nav.videos'),     href: '/library/videos' },
        { label: t('nav.audio'),      href: '/audio' },
        { label: t('nav.magazine'),   href: '/majalla' },
        { label: t('nav.about'),      href: '/about' },
        { label: t('nav.contact'),    href: '/contact' },
    ];

    return (
        <footer>
            <div className="bg-[#1a252f] pt-10 pb-6">
                <div className="max-w-[1240px] mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* About */}
                        <FooterWidget title={t('footer.about')}>
                            <p className="text-gray-400 text-[13px] leading-loose line-clamp-6">
                                {aboutText}
                            </p>
                        </FooterWidget>

                        {/* Sitemap */}
                        <FooterWidget title={t('footer.sitemap')}>
                            <ul className="space-y-2">
                                {navLinks.map((item) => (
                                    <li key={item.href}>
                                        <a href={item.href} className="text-gray-400 text-[13px] hover:text-[#27ae60] transition-colors flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-[#27ae60] shrink-0" />
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </FooterWidget>

                        {/* Social links */}
                        {socials.length > 0 && (
                            <FooterWidget title={t('footer.followUs') || 'ما را دنبال کنید'}>
                                <div className="flex flex-wrap gap-2">
                                    {socials.map((s) => {
                                        const Icon  = PLATFORM_ICONS[s.platform] ?? Rss;
                                        const color = PLATFORM_COLORS[s.platform] ?? 'hover:bg-gray-600';
                                        return (
                                            <a
                                                key={s.platform}
                                                href={s.url || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center gap-2 bg-white/5 ${color} text-gray-300 hover:text-white text-[12px] px-3 py-2 rounded-lg transition-all`}
                                            >
                                                <Icon className="w-3.5 h-3.5" />
                                                {s.count && <span className="font-bold">{s.count}</span>}
                                            </a>
                                        );
                                    })}
                                </div>
                            </FooterWidget>
                        )}
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="bg-[#0d1117] py-4">
                <div className="max-w-[1240px] mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-gray-500 text-[13px]">
                        &copy; {new Date().getFullYear()}{' '}
                        <a href="/" className="text-[#27ae60] hover:text-[#2ecc71] transition-colors">{siteName}</a>.
                        {' '}{t('footer.copyright')}
                    </p>
                    <div className="flex items-center gap-1.5">
                        {socials.map((s) => {
                            const Icon  = PLATFORM_ICONS[s.platform] ?? Rss;
                            const color = PLATFORM_COLORS[s.platform] ?? 'hover:bg-gray-600';
                            return (
                                <a
                                    key={s.platform}
                                    href={s.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-7 h-7 flex items-center justify-center rounded bg-white/5 text-gray-400 hover:text-white transition-all ${color}`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
}
