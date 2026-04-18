import { usePage } from '@inertiajs/react';
import { Facebook, Youtube, Share2, PlayCircle } from 'lucide-react';
import { Telegram, WhatsApp } from '@/components/icons/brand-icons';
import { SectionHeader } from './section-header';

interface SocialLink { platform: string; url: string; count: string }
interface SiteSettings { social_links?: SocialLink[] }
interface SharedProps { siteSettings?: SiteSettings; [key: string]: unknown }

const PLATFORM_ICONS: Record<string, React.ElementType> = {
    facebook: Facebook, telegram: Telegram, youtube: Youtube, whatsapp: WhatsApp,
};
const PLATFORM_COLORS: Record<string, string> = {
    facebook: 'bg-[#3b5998]', telegram: 'bg-[#229ed9]',
    youtube:  'bg-[#ff0000]', whatsapp: 'bg-[#25d366]',
};
const PLATFORM_LABELS: Record<string, string> = {
    facebook: 'Likes', telegram: 'Members', youtube: 'Subscribers', whatsapp: 'Contacts',
};

/* ── Social Widget ───────────────────────────────────────── */
function SocialWidget() {
    const { siteSettings } = usePage<SharedProps>().props;
    const socials = siteSettings?.social_links ?? [];

    if (socials.length === 0) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-2 mb-1">
                <Share2 className="w-4 h-4 text-[#27ae60]" />
            </div>
            <SectionHeader title="در ارتباط بمانید" showNav={false} />
            <div className="grid grid-cols-2 gap-3 mt-2">
                {socials.map((s) => {
                    const Icon  = PLATFORM_ICONS[s.platform];
                    if (!Icon) return null;
                    const color = PLATFORM_COLORS[s.platform] ?? 'bg-gray-500';
                    const label = PLATFORM_LABELS[s.platform] ?? 'Followers';
                    return (
                        <a
                            key={s.platform}
                            href={s.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${color} text-white rounded-lg p-3 flex flex-col items-center gap-1 hover:opacity-90 transition-opacity`}
                        >
                            <Icon className="w-5 h-5" />
                            {s.count ? (
                                <>
                                    <span className="font-bold text-base leading-none">{s.count}</span>
                                    <span className="text-[11px] opacity-90">{label}</span>
                                </>
                            ) : (
                                <span className="text-[12px] opacity-90 font-medium">{label}</span>
                            )}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

/* ── Video Widget (static recent-videos placeholder) ─────── */
const VIDEOS = [
    { title: 'نشید جدید — بخش ایمان',            gradient: 'from-teal-800 to-emerald-700' },
    { title: 'درس توحید — شرح عقیده طحاویه',     gradient: 'from-blue-800 to-indigo-700' },
    { title: 'آموزش قرائت قرآن کریم',             gradient: 'from-violet-800 to-purple-700' },
];

function VideoWidget() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-2 mb-1">
                <PlayCircle className="w-4 h-4 text-[#27ae60]" />
            </div>
            <SectionHeader title="ویدیوهای اخیر" />
            <div className="space-y-3 mt-2">
                {VIDEOS.map((v) => (
                    <a key={v.title} href="/library/videos" className="flex gap-3 group">
                        <div className={`shrink-0 w-20 h-14 rounded-lg bg-gradient-to-br ${v.gradient} flex items-center justify-center`}>
                            <PlayCircle className="w-5 h-5 text-white/80" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[13px] font-bold text-gray-800 line-clamp-2 group-hover:text-[#27ae60] transition-colors leading-snug">
                                {v.title}
                            </h4>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

export function HomeSidebar() {
    return (
        <div>
            <SocialWidget />
            <VideoWidget />
        </div>
    );
}
