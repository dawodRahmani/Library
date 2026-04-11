import { SectionHeader } from './section-header';
import { BookOpen, Headphones, FileText, PlayCircle, Play, Youtube, Link as LinkIcon, Upload } from 'lucide-react';

function extractYoutubeId(url: string | null): string | null {
    if (!url) return null;
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
}

interface ListItem {
    title: string;
    author: string;
    date: string;
    category: string;
    gradient: string;
}

interface RecentVideo {
    id: number;
    title: string;
    instructor: string;
    thumbnail: string | null;
    video_url: string | null;
    video_source: string;
    youtube_id: string | null;
    duration: string | null;
}

const RECENT_POSTS: ListItem[] = [
    {
        title: 'تفسیر سوره بقره — بخش اول',
        author: 'ادمین', date: '۹ حمل ۱۴۰۴',
        category: 'مقاله', gradient: 'from-teal-800 to-emerald-700',
    },
    {
        title: 'فقه الحنفی — کتاب الصلاة',
        author: 'ادمین', date: '۸ حمل ۱۴۰۴',
        category: 'کتاب', gradient: 'from-blue-800 to-indigo-700',
    },
    {
        title: 'تاریخ اسلام در ماوراءالنهر',
        author: 'ادمین', date: '۷ حمل ۱۴۰۴',
        category: 'مقاله', gradient: 'from-violet-800 to-purple-700',
    },
];

const AUDIO_ITEMS: ListItem[] = [
    {
        title: 'شرح حدیث جبریل — قسمت اول',
        author: 'ادمین', date: '۸ حمل ۱۴۰۴',
        category: 'صوت', gradient: 'from-rose-800 to-red-700',
    },
    {
        title: 'درس‌های توحید از علامه ابن‌باز',
        author: 'ادمین', date: '۶ حمل ۱۴۰۴',
        category: 'صوت', gradient: 'from-amber-800 to-orange-700',
    },
];

const BOOKS: ListItem[] = [
    {
        title: 'مختصر صحیح البخاری',
        author: 'ادمین', date: '۹ حمل ۱۴۰۴',
        category: 'کتاب', gradient: 'from-green-800 to-teal-700',
    },
    {
        title: 'ریاض الصالحین',
        author: 'ادمین', date: '۷ حمل ۱۴۰۴',
        category: 'کتاب', gradient: 'from-cyan-800 to-blue-700',
    },
    {
        title: 'فتح الباری شرح صحیح البخاری',
        author: 'ادمین', date: '۵ حمل ۱۴۰۴',
        category: 'کتاب', gradient: 'from-slate-800 to-gray-700',
    },
];

const GRADIENTS = [
    'from-indigo-800 to-blue-700',
    'from-teal-800 to-emerald-700',
    'from-violet-800 to-purple-700',
    'from-amber-800 to-orange-700',
];

function getVideoThumbnail(video: RecentVideo): string | null {
    const youtubeId = video.youtube_id ?? extractYoutubeId(video.video_url);
    if (youtubeId) {
        return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
    }
    if (video.thumbnail) {
        return video.thumbnail.startsWith('http') ? video.thumbnail : `/storage/${video.thumbnail}`;
    }
    return null;
}

function VideoSourceIcon({ source }: { source: string }) {
    if (source === 'youtube') return <Youtube className="w-3 h-3 text-red-400" />;
    if (source === 'upload')  return <Upload  className="w-3 h-3 text-blue-400" />;
    return <LinkIcon className="w-3 h-3 text-gray-400" />;
}

function VideoCard({ video, index }: { video: RecentVideo; index: number }) {
    const thumb = getVideoThumbnail(video);
    const gradient = GRADIENTS[index % GRADIENTS.length];

    return (
        <a
            href="/library/videos"
            className="flex gap-4 py-4 border-b border-gray-100 last:border-0 group"
        >
            {/* Thumbnail */}
            <div className={`shrink-0 w-24 h-16 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden relative`}>
                {thumb ? (
                    <img
                        src={thumb}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : null}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="relative w-7 h-7 rounded-full bg-white/25 border border-white/40 flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 text-white ms-0.5" />
                </div>
                {video.duration && (
                    <span className="absolute bottom-1 end-1 bg-black/60 text-white text-[10px] font-mono px-1 py-0.5 rounded leading-none">
                        {video.duration}
                    </span>
                )}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
                <span className="inline-flex items-center gap-1 text-[11px] bg-[#27ae60]/10 text-[#27ae60] px-2 py-0.5 rounded mb-1 font-bold">
                    <VideoSourceIcon source={video.video_source} />
                    ویدیو
                </span>
                <h3 className="text-[14px] font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#27ae60] transition-colors">
                    {video.title}
                </h3>
                <div className="flex gap-2 text-[12px] text-gray-400 mt-1">
                    <span>{video.instructor}</span>
                </div>
            </div>
        </a>
    );
}

function ContentCard({ item, icon: Icon = BookOpen }: { item: ListItem; icon?: typeof BookOpen }) {
    return (
        <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0 group">
            {/* Thumbnail */}
            <div className={`shrink-0 w-24 h-16 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center overflow-hidden`}>
                <Icon className="w-6 h-6 text-white/70" />
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
                <span className="inline-block text-[11px] bg-[#27ae60]/10 text-[#27ae60] px-2 py-0.5 rounded mb-1 font-bold">
                    {item.category}
                </span>
                <h3 className="text-[14px] font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#27ae60] transition-colors">
                    <a href="#">{item.title}</a>
                </h3>
                <div className="flex gap-2 text-[12px] text-gray-400 mt-1">
                    <span>{item.author}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                </div>
            </div>
        </div>
    );
}

function Section({ title, items, icon: Icon, href, itemIcon }: { title: string; items: ListItem[]; icon: typeof BookOpen; href?: string; itemIcon?: typeof BookOpen }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-[#27ae60]" />
                <span className="text-[#27ae60] text-sm font-bold">{title}</span>
            </div>
            <SectionHeader title={title} />
            <div>
                {items.map((item) => (
                    <ContentCard key={item.title} item={item} icon={itemIcon} />
                ))}
            </div>
            {href && (
                <a href={href} className="mt-3 flex items-center justify-center gap-1 text-[13px] text-[#27ae60] hover:text-[#1e8449] font-medium transition-colors">
                    مشاهده همه
                </a>
            )}
        </div>
    );
}

interface HomeMainColumnProps {
    recentVideos: RecentVideo[];
}

export function HomeMainColumn({ recentVideos }: HomeMainColumnProps) {
    return (
        <div>
            <Section title="پست‌های جدید" items={RECENT_POSTS} icon={FileText} />

            {/* Real videos from DB — only shown if at least one has a thumbnail */}
            {recentVideos.some(v => getVideoThumbnail(v) !== null) && <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <PlayCircle className="w-4 h-4 text-[#27ae60]" />
                    <span className="text-[#27ae60] text-sm font-bold">ویدیوهای جدید</span>
                </div>
                <SectionHeader title="ویدیوهای جدید" />
                <div>
                    {(() => {
                        const withImages = recentVideos.filter(v => getVideoThumbnail(v) !== null);
                        if (withImages.length === 0) return null;
                        return withImages.map((video, i) => (
                            <VideoCard key={video.id} video={video} index={i} />
                        ));
                    })()}
                </div>
                <a href="/library/videos" className="mt-3 flex items-center justify-center gap-1 text-[13px] text-[#27ae60] hover:text-[#1e8449] font-medium transition-colors">
                    مشاهده همه
                </a>
            </div>}

            <Section title="صوت‌های جدید" items={AUDIO_ITEMS} icon={Headphones} />
            <Section title="کتاب‌های جدید" items={BOOKS} icon={BookOpen} />
        </div>
    );
}
