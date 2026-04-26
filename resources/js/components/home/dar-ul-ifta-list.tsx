import { BookMarked, Clock, User, ChevronLeft, FileText, Music, Video, Play, Headphones } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Locale = 'da' | 'en' | 'ar' | 'tg';
function getLocale(lang: string): Locale {
    return (['da', 'en', 'ar', 'tg'] as const).includes(lang as Locale) ? lang as Locale : 'da';
}

type FatwaType = 'text' | 'audio' | 'video';

/* ── Types ───────────────────────────────────────────────── */
interface FatwaItem {
    id: number;
    title: string;
    description: string;
    body: string;
    author: string;
    date: string;
    category: string;
    categorySlug: string;
    thumbnail: string | null;
    type: FatwaType;
    media_source: 'link' | 'upload' | null;
    media_url: string | null;
    has_file: boolean;
    stream_url: string | null;
}

interface Category {
    slug: string;
    name: string;
}

interface DarUlIftaListProps {
    fatwas: FatwaItem[];
    categories: Category[];
}

// Generate gradient based on category and id
const getGradient = (category: string, id: number): string => {
    const gradients = [
        'from-emerald-900 to-teal-800',
        'from-blue-900 to-indigo-800',
        'from-violet-900 to-purple-800',
        'from-rose-900 to-red-800',
        'from-amber-900 to-orange-800',
        'from-teal-900 to-cyan-800',
        'from-green-900 to-emerald-800',
        'from-indigo-900 to-blue-800',
        'from-pink-900 to-rose-800',
        'from-slate-900 to-gray-800',
        'from-cyan-900 to-teal-800',
        'from-amber-900 to-yellow-800',
    ];
    const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = (hash + id) % gradients.length;
    return gradients[index];
};

const CAT_COLORS: Record<string, string> = {
    'توحید و عقیده':  'bg-emerald-100 text-emerald-700',
    'جهاد و استشهاد':  'bg-red-100     text-red-700',
    'قضایای سیاسی':   'bg-violet-100  text-violet-700',
    'احکام شرعی عام': 'bg-blue-100    text-blue-700',
    'بیانیه‌ها':       'bg-amber-100   text-amber-700',
    'default': 'bg-gray-100 text-gray-700',
};

const TYPE_META: Record<FatwaType, { icon: React.ElementType; color: string }> = {
    text:  { icon: FileText, color: 'bg-gray-100 text-gray-700' },
    audio: { icon: Music,    color: 'bg-blue-100 text-blue-700' },
    video: { icon: Video,    color: 'bg-purple-100 text-purple-700' },
};

function youtubeEmbedUrl(url: string): string | null {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

/* ── Card ────────────────────────────────────────────────── */
function FatwaCard({ item, onOpen, locale }: { item: FatwaItem; onOpen: () => void; locale: Locale }) {
    const gradient = getGradient(item.category, item.id);
    const catClass = CAT_COLORS[item.category] ?? CAT_COLORS.default;
    const typeMeta = TYPE_META[item.type];
    const TypeIcon = typeMeta.icon;

    const typeLabel: string = {
        text:  { da: 'متن', en: 'Text',  ar: 'نص',   tg: 'Матн'  }[locale],
        audio: { da: 'صوت', en: 'Audio', ar: 'صوت',  tg: 'Аудио' }[locale],
        video: { da: 'ویدیو', en: 'Video', ar: 'فيديو', tg: 'Видео' }[locale],
    }[item.type];

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
            <button onClick={onOpen} className={`h-36 bg-gradient-to-br ${gradient} relative flex items-center justify-center overflow-hidden text-start w-full`}>
                {item.thumbnail && (
                    <img
                        src={item.thumbnail.startsWith('http') ? item.thumbnail : `/storage/${item.thumbnail}`}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                {!item.thumbnail && item.type === 'text' && (
                    <BookMarked className="relative z-10 w-12 h-12 text-white/60 group-hover:text-white/90 transition-colors" />
                )}
                {/* Play overlay for audio/video */}
                {(item.type === 'audio' || item.type === 'video') && (
                    <div className="relative z-10 w-14 h-14 rounded-full bg-white/30 border-2 border-white/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        {item.type === 'audio'
                            ? <Headphones className="w-6 h-6 text-white" />
                            : <Play className="w-6 h-6 text-white ms-0.5" fill="currentColor" />
                        }
                    </div>
                )}
                <span className={`absolute top-3 end-3 text-[11px] font-bold px-2 py-0.5 rounded-full ${catClass}`}>
                    {item.category}
                </span>
                <span className={`absolute top-3 start-3 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${typeMeta.color}`}>
                    <TypeIcon className="w-3 h-3" />
                    {typeLabel}
                </span>
            </button>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-[14px] text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#27ae60] transition-colors">
                    <button onClick={onOpen} className="text-start hover:text-[#27ae60] transition-colors">
                        {item.title}
                    </button>
                </h3>
                <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">
                    {item.description}
                </p>
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {item.author}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.date}
                    </span>
                </div>
            </div>

            <button
                onClick={onOpen}
                className="flex items-center justify-between px-4 py-2.5 bg-[#f0faf5] text-[#27ae60] text-[12px] font-bold hover:bg-[#27ae60] hover:text-white transition-colors border-t border-gray-100 w-full"
            >
                <span>{{ da: 'مشاهده', en: 'View', ar: 'عرض', tg: 'Мушоҳида' }[locale]}</span>
                <ChevronLeft className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

/* ── Main export ─────────────────────────────────────────── */
export function DarUlIftaList({ fatwas, categories }: DarUlIftaListProps) {
    const { i18n } = useTranslation();
    const locale = getLocale(i18n.language);

    const allLabel      = { da: 'همه', en: 'All', ar: 'الكل', tg: 'Ҳама' }[locale];
    const statsLabel    = { da: 'فتوا و بیانیه', en: 'fatwas & statements', ar: 'فتاوى وبيانات', tg: 'фатвоҳо ва изҳорот' }[locale];
    const inCats        = { da: 'در', en: 'in', ar: 'في', tg: 'дар' }[locale];
    const catsLabel     = { da: 'دسته‌بندی', en: 'categories', ar: 'فئة', tg: 'категория' }[locale];
    const noItems       = { da: 'هیچ موردی یافت نشد.', en: 'No items found.', ar: 'لم يُعثر على شيء.', tg: 'Чизе ёфт нашуд.' }[locale];
    const noContent     = { da: 'متن فتوا موجود نیست.', en: 'No content available.', ar: 'لا يتوفر محتوى.', tg: 'Матн дастрас нест.' }[locale];

    const allCategories = [{ slug: 'all', name: allLabel }, ...categories];

    const typeLabels: Record<'all' | FatwaType, string> = {
        all:   allLabel,
        text:  { da: 'متن', en: 'Text',  ar: 'نص',   tg: 'Матн'  }[locale],
        audio: { da: 'صوت', en: 'Audio', ar: 'صوت',  tg: 'Аудио' }[locale],
        video: { da: 'ویدیو', en: 'Video', ar: 'فيديو', tg: 'Видео' }[locale],
    };

    const [activeSlug, setActiveSlug] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('category') ?? 'all';
        }
        return 'all';
    });

    const [activeType, setActiveType] = useState<'all' | FatwaType>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const t = params.get('type');
            return t === 'text' || t === 'audio' || t === 'video' ? t : 'all';
        }
        return 'all';
    });

    const [selected, setSelected] = useState<FatwaItem | null>(null);

    const filtered = fatwas.filter((item) => {
        const catOk  = activeSlug === 'all' || item.categorySlug === activeSlug;
        const typeOk = activeType === 'all' || item.type === activeType;
        return catOk && typeOk;
    });

    const catClass = selected ? (CAT_COLORS[selected.category] ?? CAT_COLORS.default) : '';

    return (
        <div>
            {/* Stats bar */}
            <div className="flex items-center gap-3 mb-5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#27ae60]/10 flex items-center justify-center">
                    <BookMarked className="w-5 h-5 text-[#27ae60]" />
                </div>
                <div>
                    <p className="text-[13px] font-bold text-gray-800">{fatwas.length} {statsLabel}</p>
                    <p className="text-[11px] text-gray-400">{inCats} {categories.length} {catsLabel}</p>
                </div>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-3">
                {allCategories.map((cat) => (
                    <button
                        key={cat.slug}
                        onClick={() => setActiveSlug(cat.slug)}
                        className={`text-[12px] px-3 py-1.5 rounded-full border font-medium transition-colors ${
                            cat.slug === activeSlug
                                ? 'bg-[#27ae60] border-[#27ae60] text-white'
                                : 'border-gray-200 text-gray-600 hover:border-[#27ae60] hover:text-[#27ae60]'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Type sub-filter */}
            <div className="flex flex-wrap gap-1.5 mb-6 bg-gray-50 border border-gray-100 rounded-xl p-1.5 w-fit">
                {(['all', 'text', 'audio', 'video'] as const).map((t) => {
                    const Icon = t === 'all' ? null : TYPE_META[t].icon;
                    const active = activeType === t;
                    return (
                        <button
                            key={t}
                            onClick={() => setActiveType(t)}
                            className={`inline-flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                active
                                    ? 'bg-white shadow-sm text-[#27ae60]'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            {Icon && <Icon className="w-3.5 h-3.5" />}
                            {typeLabels[t]}
                        </button>
                    );
                })}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filtered.map((item) => (
                    <FatwaCard key={item.id} item={item} onOpen={() => setSelected(item)} locale={locale} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <BookMarked className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>{noItems}</p>
                </div>
            )}

            {/* Detail modal */}
            <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
                <DialogContent
                    className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto"
                    dir="rtl"
                >
                    {selected && (() => {
                        const TypeIcon = TYPE_META[selected.type].icon;
                        const audioSrc = selected.type === 'audio'
                            ? (selected.media_source === 'upload' ? selected.stream_url : selected.media_url)
                            : null;
                        const videoEmbed = selected.type === 'video' && selected.media_source === 'link' && selected.media_url
                            ? youtubeEmbedUrl(selected.media_url)
                            : null;
                        const videoFile = selected.type === 'video' && selected.media_source === 'upload'
                            ? selected.stream_url
                            : null;
                        const videoLink = selected.type === 'video' && selected.media_source === 'link' && !videoEmbed
                            ? selected.media_url
                            : null;

                        return (
                            <>
                                <DialogHeader className="text-start">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${catClass}`}>
                                            {selected.category}
                                        </span>
                                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${TYPE_META[selected.type].color}`}>
                                            <TypeIcon className="w-3 h-3" />
                                            {typeLabels[selected.type]}
                                        </span>
                                    </div>
                                    <DialogTitle className="text-[18px] sm:text-[20px] font-bold text-gray-900 leading-snug">
                                        {selected.title}
                                    </DialogTitle>
                                </DialogHeader>

                                {/* Thumbnail */}
                                {selected.thumbnail && (
                                    <div className="mt-3 rounded-lg overflow-hidden bg-gray-100 max-h-[420px] flex items-center justify-center">
                                        <img
                                            src={selected.thumbnail.startsWith('http') ? selected.thumbnail : `/storage/${selected.thumbnail}`}
                                            alt={selected.title}
                                            className="w-full h-auto max-h-[420px] object-contain"
                                        />
                                    </div>
                                )}

                                {/* Media player */}
                                {audioSrc && (
                                    <audio controls src={audioSrc} className="w-full mt-3">
                                        Your browser does not support audio.
                                    </audio>
                                )}
                                {videoEmbed && (
                                    <div className="mt-3 aspect-video rounded-lg overflow-hidden bg-black">
                                        <iframe src={videoEmbed} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
                                    </div>
                                )}
                                {videoFile && (
                                    <video controls src={videoFile} className="w-full mt-3 rounded-lg bg-black" />
                                )}
                                {videoLink && (
                                    <a href={videoLink} target="_blank" rel="noreferrer"
                                        className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-[#27ae60] hover:underline" dir="ltr">
                                        {videoLink}
                                    </a>
                                )}

                                {/* Short description */}
                                {selected.description && (
                                    <p className="mt-4 text-[14px] text-gray-600 leading-relaxed">{selected.description}</p>
                                )}

                                {/* Body (text type) */}
                                {selected.type === 'text' && (
                                    <div className="mt-4 text-[14px] text-gray-700 leading-relaxed">
                                        {selected.body
                                            ? <div className="prose prose-base max-w-none" dangerouslySetInnerHTML={{ __html: selected.body.replace(/\n/g, '<br />') }} />
                                            : !selected.description && <span className="text-gray-400">{noContent}</span>
                                        }
                                    </div>
                                )}

                                <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100 text-[12px] text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <User className="w-3.5 h-3.5" /> {selected.author}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" /> {selected.date}
                                    </span>
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    );
}
