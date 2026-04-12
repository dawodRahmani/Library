import { SectionHeader } from './section-header';
import { BookOpen, Headphones, FileText, PlayCircle, Play, Youtube, Link as LinkIcon, Upload } from 'lucide-react';

function extractYoutubeId(url: string | null): string | null {
    if (!url) return null;
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
}

function imgUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    return path.startsWith('http') ? path : `/storage/${path}`;
}

const GRADIENTS = [
    'from-teal-800 to-emerald-700',
    'from-blue-800 to-indigo-700',
    'from-violet-800 to-purple-700',
    'from-amber-800 to-orange-700',
    'from-rose-800 to-red-700',
    'from-green-800 to-teal-700',
    'from-cyan-800 to-blue-700',
    'from-slate-800 to-gray-700',
];

/* ── Video ────────────────────────────────────────────────── */

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

function getVideoThumbnail(video: RecentVideo): string | null {
    const youtubeId = video.youtube_id ?? extractYoutubeId(video.video_url);
    if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
    return imgUrl(video.thumbnail);
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
        <a href="/library/videos" className="flex gap-4 py-4 border-b border-gray-100 last:border-0 group">
            <div className={`shrink-0 w-24 h-16 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden relative`}>
                {thumb && <img src={thumb} alt={video.title} className="absolute inset-0 w-full h-full object-cover" />}
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

/* ── Generic content card (article / audio / book) ────────── */

interface ContentItem {
    id: number;
    title: string;
    author: string;
    date: string;
    cover_image?: string | null;
    thumbnail?: string | null;
}

function ContentCard({
    item,
    index,
    category,
    href,
    icon: Icon,
}: {
    item: ContentItem;
    index: number;
    category: string;
    href: string;
    icon: typeof BookOpen;
}) {
    const gradient = GRADIENTS[index % GRADIENTS.length];
    const cover = imgUrl(item.cover_image ?? item.thumbnail ?? null);

    return (
        <a href={href} className="flex gap-4 py-4 border-b border-gray-100 last:border-0 group">
            <div className={`shrink-0 w-24 h-16 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden relative`}>
                {cover && <img src={cover} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />}
                {!cover && <Icon className="w-6 h-6 text-white/70" />}
            </div>
            <div className="flex-1 min-w-0">
                <span className="inline-block text-[11px] bg-[#27ae60]/10 text-[#27ae60] px-2 py-0.5 rounded mb-1 font-bold">
                    {category}
                </span>
                <h3 className="text-[14px] font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#27ae60] transition-colors">
                    {item.title}
                </h3>
                <div className="flex gap-2 text-[12px] text-gray-400 mt-1">
                    <span>{item.author}</span>
                    {item.date && <><span>•</span><span>{item.date}</span></>}
                </div>
            </div>
        </a>
    );
}

/* ── Section wrapper ──────────────────────────────────────── */

function Section<T extends ContentItem>({
    title, items, icon: Icon, href, category, itemHref,
}: {
    title: string;
    items: T[];
    icon: typeof BookOpen;
    href: string;
    category: string;
    itemHref: string;
}) {
    if (items.length === 0) return null;
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-[#27ae60]" />
                <span className="text-[#27ae60] text-sm font-bold">{title}</span>
            </div>
            <SectionHeader title={title} />
            <div>
                {items.map((item, i) => (
                    <ContentCard key={item.id} item={item} index={i} category={category} href={itemHref} icon={Icon} />
                ))}
            </div>
            <a href={href} className="mt-3 flex items-center justify-center gap-1 text-[13px] text-[#27ae60] hover:text-[#1e8449] font-medium transition-colors">
                مشاهده همه
            </a>
        </div>
    );
}

/* ── Main export ──────────────────────────────────────────── */

interface HomeMainColumnProps {
    recentVideos: RecentVideo[];
    recentArticles: ContentItem[];
    recentAudios: ContentItem[];
    recentBooks: ContentItem[];
}

export function HomeMainColumn({ recentVideos, recentArticles, recentAudios, recentBooks }: HomeMainColumnProps) {
    const videosWithThumb = recentVideos.filter(v => getVideoThumbnail(v) !== null);

    return (
        <div>
            <Section
                title="پست‌های جدید"
                items={recentArticles}
                icon={FileText}
                href="/articles"
                category="مقاله"
                itemHref="/articles"
            />

            {videosWithThumb.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <PlayCircle className="w-4 h-4 text-[#27ae60]" />
                        <span className="text-[#27ae60] text-sm font-bold">ویدیوهای جدید</span>
                    </div>
                    <SectionHeader title="ویدیوهای جدید" />
                    <div>
                        {videosWithThumb.map((video, i) => (
                            <VideoCard key={video.id} video={video} index={i} />
                        ))}
                    </div>
                    <a href="/library/videos" className="mt-3 flex items-center justify-center gap-1 text-[13px] text-[#27ae60] hover:text-[#1e8449] font-medium transition-colors">
                        مشاهده همه
                    </a>
                </div>
            )}

            <Section
                title="صوت‌های جدید"
                items={recentAudios}
                icon={Headphones}
                href="/audio"
                category="صوت"
                itemHref="/audio"
            />

            <Section
                title="کتاب‌های جدید"
                items={recentBooks}
                icon={BookOpen}
                href="/library"
                category="کتاب"
                itemHref="/library"
            />
        </div>
    );
}
