import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopBar }     from '@/components/home/top-bar';
import { MainNav }    from '@/components/home/main-nav';
import { NewsTicker } from '@/components/home/news-ticker';
import { PageHeader } from '@/components/home/page-header';
import { HomeFooter } from '@/components/home/home-footer';
import { Search, Play, Clock, Eye, Filter, MonitorPlay, X, Download, ExternalLink, Youtube, Link as LinkIcon, Upload } from 'lucide-react';

type Locale = 'da' | 'en' | 'ar' | 'tg';
type VideoStatus = 'available' | 'restricted' | 'archived';
type VideoSource = 'link' | 'youtube' | 'upload';

function getLocale(lang: string): Locale {
    return (['da', 'en', 'ar', 'tg'] as const).includes(lang as Locale) ? lang as Locale : 'da';
}

interface VideoItem {
    id: number;
    title: string;
    instructor: string;
    category: string;
    categorySlug: string;
    duration: string;
    views: number;
    year: number;
    status: VideoStatus;
    description: string;
    thumbnail: string | null;
    video_source: VideoSource;
    video_url: string | null;
    has_file: boolean;
    youtube_id: string | null;
}

interface Category {
    slug: string;
    name: string;
}

interface PageProps {
    videos: VideoItem[];
    categories: Category[];
}

function getStatusConfig(locale: Locale): Record<string, { label: string; className: string }> {
    const labels = {
        available:  { da: 'در دسترس', en: 'Available',  ar: 'متاح',    tg: 'Дастрас' },
        restricted: { da: 'محدود',    en: 'Restricted', ar: 'مقيّد',   tg: 'Маҳдуд' },
        archived:   { da: 'آرشیو',    en: 'Archived',   ar: 'مؤرشف',   tg: 'Архив' },
    };
    return {
        available:  { label: labels.available[locale],  className: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
        restricted: { label: labels.restricted[locale], className: 'bg-amber-100 text-amber-700 border border-amber-200' },
        archived:   { label: labels.archived[locale],   className: 'bg-slate-100 text-slate-600 border border-slate-200' },
    };
}

const DEFAULT_STATUS = { label: '—', className: 'bg-gray-100 text-gray-500 border border-gray-200' };

const GRADIENTS = [
    'from-emerald-800 to-teal-700',
    'from-indigo-800 to-blue-700',
    'from-violet-800 to-purple-700',
    'from-amber-800 to-orange-700',
    'from-cyan-800 to-teal-700',
    'from-green-800 to-emerald-700',
    'from-yellow-800 to-amber-700',
    'from-stone-800 to-zinc-700',
    'from-lime-800 to-green-700',
    'from-rose-800 to-pink-700',
    'from-red-800 to-rose-700',
    'from-teal-800 to-cyan-700',
    'from-slate-800 to-gray-700',
    'from-blue-800 to-indigo-700',
    'from-purple-800 to-violet-700',
];

function getGradient(id: number): string {
    return GRADIENTS[id % GRADIENTS.length];
}

function extractYoutubeId(url: string | null): string | null {
    if (!url) return null;
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
}

function isDirectVideoUrl(url: string | null): boolean {
    if (!url) return false;
    return /\.(mp4|webm|mov|avi|mkv|ogv)(\?.*)?$/i.test(url);
}

function VideoPlayerModal({ video, onClose, locale }: { video: VideoItem; onClose: () => void; locale: Locale }) {
    const statusConfig = getStatusConfig(locale);
    const { label, className } = statusConfig[video.status] ?? DEFAULT_STATUS;

    const youtubeId   = video.youtube_id ?? extractYoutubeId(video.video_url);
    const isUploaded  = video.video_source === 'upload' && video.has_file;
    const isDirectVid = !youtubeId && !isUploaded && isDirectVideoUrl(video.video_url);

    const watchOnYoutube = { da: 'مشاهده در یوتیوب', en: 'Watch on YouTube', ar: 'المشاهدة على يوتيوب', tg: 'Тамошо дар YouTube' }[locale];
    const downloadVideo  = { da: 'دانلود ویدیو',       en: 'Download Video',  ar: 'تحميل الفيديو',        tg: 'Зеркашии видео' }[locale];
    const openLink       = { da: 'باز کردن لینک',       en: 'Open Link',       ar: 'فتح الرابط',           tg: 'Кушодани пайванд' }[locale];
    const openVideo      = { da: 'مشاهده ویدیو',        en: 'Watch Video',     ar: 'مشاهدة الفيديو',       tg: 'Тамошои видео' }[locale];
    const views          = { da: 'بازدید',               en: 'views',           ar: 'مشاهدة',               tg: 'дидан' }[locale];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative bg-black w-full" style={{ aspectRatio: '16/9' }}>
                    {youtubeId ? (
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : isUploaded ? (
                        <video
                            className="absolute inset-0 w-full h-full"
                            src={`/library/videos/${video.id}/stream`}
                            controls
                            autoPlay
                        />
                    ) : isDirectVid ? (
                        <video
                            className="absolute inset-0 w-full h-full"
                            src={video.video_url!}
                            controls
                            autoPlay
                        />
                    ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(video.id)} flex flex-col items-center justify-center gap-4`}>
                            <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                                <Play className="w-7 h-7 text-white ms-1" />
                            </div>
                            {video.video_url && (
                                <a
                                    href={video.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 font-semibold text-sm px-5 py-2.5 rounded-full shadow transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    {openVideo}
                                </a>
                            )}
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="absolute top-3 end-3 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-3" dir="rtl">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-bold text-gray-900 leading-snug">{video.title}</h2>
                            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                                <MonitorPlay className="w-4 h-4 shrink-0" />
                                {video.instructor}
                            </p>
                        </div>
                        <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${className}`}>{label}</span>
                    </div>

                    {video.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">{video.description}</p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{video.duration}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{video.views.toLocaleString()} {views}</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded">{video.category}</span>
                        {video.year && <span>{video.year}</span>}
                    </div>

                    <div className="flex gap-2 flex-wrap pt-1">
                        {youtubeId && (
                            <a
                                href={`https://www.youtube.com/watch?v=${youtubeId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                            >
                                <Youtube className="w-4 h-4" />
                                {watchOnYoutube}
                            </a>
                        )}
                        {isUploaded && (
                            <a
                                href={`/library/videos/${video.id}/download`}
                                className="flex items-center gap-2 bg-[#27ae60] hover:bg-[#219a52] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                {downloadVideo}
                            </a>
                        )}
                        {!youtubeId && !isUploaded && video.video_url && (
                            <a
                                href={video.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                            >
                                <LinkIcon className="w-4 h-4" />
                                {openLink}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SourceIcon({ source }: { source: VideoSource }) {
    if (source === 'youtube') return <Youtube className="w-3.5 h-3.5 text-red-500" />;
    if (source === 'upload')  return <Upload  className="w-3.5 h-3.5 text-blue-500" />;
    return <LinkIcon className="w-3.5 h-3.5 text-gray-400" />;
}

function VideoCard({ video, onPlay, locale }: { video: VideoItem; onPlay: (v: VideoItem) => void; locale: Locale }) {
    const statusConfig = getStatusConfig(locale);
    const { label, className } = statusConfig[video.status] ?? DEFAULT_STATUS;
    const youtubeId = video.youtube_id ?? extractYoutubeId(video.video_url);

    return (
        <div
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => onPlay(video)}
        >
            <div className={`relative h-36 bg-gradient-to-br ${getGradient(video.id)} flex items-center justify-center overflow-hidden`}>
                {youtubeId && (
                    <img
                        src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-white ms-0.5" />
                </div>
                {video.duration && (
                    <span className="absolute bottom-2 end-2 bg-black/50 text-white text-[11px] font-mono px-1.5 py-0.5 rounded">
                        {video.duration}
                    </span>
                )}
                <span className={`absolute top-2 start-2 text-[11px] font-medium px-2 py-0.5 rounded-full ${className}`}>
                    {label}
                </span>
                <span className="absolute top-2 end-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                    {youtubeId ? <Youtube className="w-3.5 h-3.5 text-red-500" /> : <SourceIcon source={video.video_source} />}
                </span>
            </div>

            <div className="p-4 flex flex-col gap-1.5">
                <h3 className="font-bold text-[14px] text-gray-900 leading-snug line-clamp-2 group-hover:text-[#27ae60] transition-colors">
                    {video.title}
                </h3>
                {video.description && (
                    <p className="text-[12px] text-gray-500 line-clamp-1">{video.description}</p>
                )}
                <div className="flex items-center justify-between mt-1">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <MonitorPlay className="w-3.5 h-3.5" />
                        {video.instructor}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Eye className="w-3 h-3" />
                        {video.views.toLocaleString()}
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                        {video.category}
                    </span>
                    {video.year && <span className="text-[11px] text-gray-400">{video.year}</span>}
                </div>
            </div>
        </div>
    );
}

export default function VideosIndex({ videos, categories }: PageProps) {
    const { i18n } = useTranslation();
    const locale = getLocale(i18n.language);

    const L = {
        all:             { da: 'همه',                                             en: 'All',                                    ar: 'الكل',                              tg: 'Ҳама' }[locale],
        searchPlaceholder:{ da: 'جستجو بر اساس عنوان، استاد یا دسته‌بندی...',   en: 'Search by title, instructor or category...', ar: 'ابحث بالعنوان أو المحاضر أو الفئة...', tg: 'Ҷустуҷӯ аз рӯи унвон, устод ё категория...' }[locale],
        allStatuses:     { da: 'همه وضعیت‌ها',                                   en: 'All Statuses',                           ar: 'جميع الحالات',                      tg: 'Ҳамаи ҳолатҳо' }[locale],
        noVideos:        { da: 'هیچ ویدیویی یافت نشد',                           en: 'No videos found',                        ar: 'لم يُعثر على فيديوهات',             tg: 'Видеое ёфт нашуд' }[locale],
        pageTitle:       { da: 'ویدیوها',                                         en: 'Videos',                                 ar: 'مقاطع الفيديو',                     tg: 'Видеоҳо' }[locale],
        home:            { da: 'خانه',                                            en: 'Home',                                   ar: 'الرئيسية',                          tg: 'Хона' }[locale],
        library:         { da: 'کتابخانه',                                        en: 'Library',                                ar: 'المكتبة',                           tg: 'Китобхона' }[locale],
        showing: (n: number, t: number) =>
            locale === 'en' ? `Showing ${n} of ${t} videos`
            : locale === 'ar' ? `عرض ${n} من ${t} فيديو`
            : locale === 'tg' ? `Намоиши ${n} аз ${t} видео`
            : `نمایش ${n} از ${t} ویدیو`,
    };

    const statusConfig = getStatusConfig(locale);

    const [search,          setSearch]          = useState('');
    const [categorySlug,    setCategorySlug]    = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('category') ?? 'all';
        }
        return 'all';
    });
    const [statusFilter,    setStatusFilter]    = useState('all');
    const [playing,         setPlaying]         = useState<VideoItem | null>(null);

    const allCategories = [{ slug: 'all', name: L.all }, ...categories];

    const filtered = videos.filter((v) => {
        const matchSearch   = v.title.includes(search) || v.instructor.includes(search) || v.category.includes(search);
        const matchCategory = categorySlug === 'all' || v.categorySlug === categorySlug;
        const matchStatus   =
            statusFilter === 'all' ||
            (statusFilter === 'available'  && v.status === 'available')  ||
            (statusFilter === 'restricted' && v.status === 'restricted') ||
            (statusFilter === 'archived'   && v.status === 'archived');
        return matchSearch && matchCategory && matchStatus;
    });

    return (
        <div dir="rtl" className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title={`${L.pageTitle} — کتابخانه رسالت`} />
            <TopBar />
            <MainNav />
            <NewsTicker />

            <PageHeader
                title={L.pageTitle}
                breadcrumbs={[
                    { label: L.home, href: '/' },
                    { label: L.library, href: '/library' },
                    { label: L.pageTitle },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-4 py-8 flex flex-col gap-6">

                {/* Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={L.searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg ps-9 pe-4 py-2 text-sm focus:outline-none focus:border-[#27ae60] transition-colors"
                        />
                    </div>
                    <select
                        value={categorySlug}
                        onChange={(e) => setCategorySlug(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#27ae60] transition-colors sm:w-44"
                    >
                        {allCategories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#27ae60] transition-colors sm:w-44"
                    >
                        <option value="all">{L.allStatuses}</option>
                        <option value="available">{statusConfig.available.label}</option>
                        <option value="restricted">{statusConfig.restricted.label}</option>
                        <option value="archived">{statusConfig.archived.label}</option>
                    </select>
                </div>

                {/* Video grid */}
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-12 flex flex-col items-center gap-3 text-gray-400">
                        <Filter className="w-10 h-10 opacity-30" />
                        <p>{L.noVideos}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map((video) => (
                            <VideoCard key={video.id} video={video} onPlay={setPlaying} locale={locale} />
                        ))}
                    </div>
                )}

                {filtered.length > 0 && (
                    <div className="flex items-center justify-between px-1">
                        <p className="text-xs text-gray-400">
                            {L.showing(filtered.length, videos.length)}
                        </p>
                    </div>
                )}
            </div>

            <HomeFooter />

            {playing && (
                <VideoPlayerModal video={playing} onClose={() => setPlaying(null)} locale={locale} />
            )}
        </div>
    );
}
