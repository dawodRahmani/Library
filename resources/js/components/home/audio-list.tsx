import { Headphones, Play, Clock, User, Mic, Download, Link as LinkIcon, Upload, ExternalLink, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Locale = 'da' | 'en' | 'ar' | 'tg';
function getLocale(lang: string): Locale {
    return (['da', 'en', 'ar', 'tg'] as const).includes(lang as Locale) ? lang as Locale : 'da';
}

type AudioSource = 'link' | 'upload';

interface AudioItem {
    id: number;
    title: string;
    description: string;
    author: string;
    category: string;
    categorySlug: string;
    duration: string;
    episodes: number;
    audio_source: AudioSource;
    audio_url: string | null;
    has_file: boolean;
    file_size: number | null;
    thumbnail: string | null;
    date: string;
}

interface Category {
    slug: string;
    name: string;
}

interface AudioListProps {
    audios: AudioItem[];
    categories: Category[];
}

const CAT_COLORS: Record<string, string> = {
    'عقیده و منهج':    'bg-emerald-100 text-emerald-700',
    'پند و موعظه':     'bg-blue-100    text-blue-700',
    'جهاد و استشهاد':  'bg-red-100     text-red-700',
    'سیاست':           'bg-violet-100  text-violet-700',
    'تحلیل و سخن روز': 'bg-rose-100    text-rose-700',
    'تاریخ':           'bg-amber-100   text-amber-700',
    'نشید و ترانه':    'bg-teal-100    text-teal-700',
};

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
    return gradients[(hash + id) % gradients.length];
};

/** Returns true when the URL looks like a direct audio file we can embed */
function isDirectAudioUrl(url: string): boolean {
    try {
        const path = new URL(url).pathname.toLowerCase();
        return /\.(mp3|m4a|ogg|wav|aac|flac|opus|wma)$/.test(path);
    } catch {
        return false;
    }
}

// ── Inline Audio Player Modal ─────────────────────────────────────────────────
function AudioPlayerModal({ item, onClose, locale }: { item: AudioItem; onClose: () => void; locale: Locale }) {
    const gradient = getGradient(item.category, item.id);
    const catColor = CAT_COLORS[item.category] ?? 'bg-gray-100 text-gray-700';

    // Determine the playable src
    const uploadSrc  = item.audio_source === 'upload' && item.has_file ? `/audio/${item.id}/stream` : null;
    const linkSrc    = item.audio_source === 'link' && item.audio_url && isDirectAudioUrl(item.audio_url) ? item.audio_url : null;
    const audioSrc   = uploadSrc ?? linkSrc;

    // External link (non-embeddable)
    const externalUrl = item.audio_source === 'link' && item.audio_url && !linkSrc ? item.audio_url : null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header gradient */}
                <div className={`bg-gradient-to-br ${gradient} relative p-6 flex gap-4 items-center`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10 w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0">
                        <Headphones className="w-7 h-7 text-white" />
                    </div>
                    <div className="relative z-10 flex-1 min-w-0">
                        <h2 className="text-white font-bold text-[16px] leading-snug line-clamp-2">{item.title}</h2>
                        <p className="text-white/70 text-sm mt-0.5 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />{item.author}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="relative z-10 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white shrink-0 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Player / actions */}
                <div className="p-5 space-y-4">
                    {/* HTML5 audio player — uploaded file or direct-link audio */}
                    {audioSrc && (
                        <audio
                            controls
                            autoPlay
                            className="w-full rounded-lg"
                            src={audioSrc}
                            preload="metadata"
                        >
                            مرورگر شما از پخش صوت پشتیبانی نمی‌کند.
                        </audio>
                    )}

                    {/* Non-embeddable external link */}
                    {externalUrl && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                            <ExternalLink className="w-4 h-4 shrink-0" />
                            <span className="flex-1">{{ da: 'این صوت در یک سایت خارجی موجود است.', en: 'This audio is hosted on an external site.', ar: 'هذا الصوت موجود على موقع خارجي.', tg: 'Ин садо дар сомонаи хориҷӣ мавҷуд аст.' }[locale]}</span>
                            <a
                                href={externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold underline underline-offset-2 hover:text-blue-900 transition-colors"
                            >
                                {{ da: 'باز کردن', en: 'Open', ar: 'فتح', tg: 'Кушодан' }[locale]}
                            </a>
                        </div>
                    )}

                    {/* Description */}
                    {item.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                        {item.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{item.duration}</span>}
                        {item.episodes > 0 && <span className="flex items-center gap-1"><Mic className="w-3.5 h-3.5" />{item.episodes} قسمت</span>}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${catColor}`}>{item.category}</span>
                    </div>

                    {/* Download button for uploaded files */}
                    {item.audio_source === 'upload' && item.has_file && (
                        <a
                            href={`/audio/${item.id}/download`}
                            className="inline-flex items-center gap-2 bg-[#27ae60] hover:bg-[#219a52] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            {{ da: 'دانلود صوت', en: 'Download Audio', ar: 'تحميل الصوت', tg: 'Зеркашии овоз' }[locale]}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Source icon ───────────────────────────────────────────────────────────────
function SourceDot({ source }: { source: AudioSource }) {
    if (source === 'upload') return <Upload className="w-3 h-3 text-emerald-500" />;
    return <LinkIcon className="w-3 h-3 text-gray-400" />;
}

// ── Audio Card ────────────────────────────────────────────────────────────────
function AudioCard({ item, onPlay, locale }: { item: AudioItem; onPlay: (a: AudioItem) => void; locale: Locale }) {
    const gradient = getGradient(item.category, item.id);
    const catColor = CAT_COLORS[item.category] ?? 'bg-gray-100 text-gray-700';

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
            {/* Thumbnail */}
            <div className={`h-36 bg-gradient-to-br ${gradient} relative flex items-center justify-center overflow-hidden`}>
                {item.thumbnail && (
                    <img
                        src={item.thumbnail.startsWith('http') ? item.thumbnail : `/storage/${item.thumbnail}`}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30 group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white ms-0.5" />
                    </div>
                </div>
                <span className={`absolute top-3 end-3 text-[11px] font-bold px-2 py-0.5 rounded-full ${catColor}`}>
                    {item.category}
                </span>
                {item.episodes > 0 && (
                    <span className="absolute bottom-3 start-3 bg-black/50 text-white text-[11px] px-2 py-0.5 rounded flex items-center gap-1">
                        <Mic className="w-3 h-3" /> {item.episodes} قسمت
                    </span>
                )}
                <span className="absolute top-3 start-3 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center">
                    <SourceDot source={item.audio_source ?? 'link'} />
                </span>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-[14px] text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#27ae60] transition-colors">
                    {item.title}
                </h3>
                <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">
                    {item.description}
                </p>
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {item.author}
                    </span>
                    <span className="flex items-center gap-2">
                        {item.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.duration}</span>}
                        <span>{item.date}</span>
                    </span>
                </div>
            </div>

            <button
                onClick={() => onPlay(item)}
                className="flex items-center justify-between px-4 py-2.5 bg-[#f0faf5] text-[#27ae60] text-[12px] font-bold hover:bg-[#27ae60] hover:text-white transition-colors border-t border-gray-100 w-full"
            >
                <span className="flex items-center gap-1.5">
                    {item.audio_source === 'upload' ? <Headphones className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                    {{ da: 'گوش دادن', en: 'Listen', ar: 'استمع', tg: 'Гӯш кардан' }[locale]}
                </span>
                <Play className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

// ── List ──────────────────────────────────────────────────────────────────────
export function AudioList({ audios, categories }: AudioListProps) {
    const { i18n } = useTranslation();
    const locale = getLocale(i18n.language);

    const allLabel    = { da: 'همه', en: 'All', ar: 'الكل', tg: 'Ҳама' }[locale];
    const audioFiles  = { da: 'فایل صوتی', en: 'audio files', ar: 'ملف صوتي', tg: 'файли садоӣ' }[locale];
    const inCats      = { da: 'در', en: 'in', ar: 'في', tg: 'дар' }[locale];
    const catsLabel   = { da: 'دسته‌بندی', en: 'categories', ar: 'فئة', tg: 'категория' }[locale];

    const [activeSlug, setActiveSlug] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('category') ?? 'all';
        }
        return 'all';
    });

    const [playing, setPlaying] = useState<AudioItem | null>(null);

    const allCategories = [{ slug: 'all', name: allLabel }, ...categories];
    const filtered = activeSlug === 'all' ? audios : audios.filter((a) => a.categorySlug === activeSlug);

    return (
        <div>
            {/* Stats bar */}
            <div className="flex items-center gap-3 mb-5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#27ae60]/10 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-[#27ae60]" />
                </div>
                <div>
                    <p className="text-[13px] font-bold text-gray-800">{audios.length} {audioFiles}</p>
                    <p className="text-[11px] text-gray-400">{inCats} {categories.length} {catsLabel}</p>
                </div>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-6">
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

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filtered.map((item) => (
                    <AudioCard key={item.id} item={item} onPlay={setPlaying} locale={locale} />
                ))}
            </div>

            {/* Player Modal */}
            {playing && <AudioPlayerModal item={playing} onClose={() => setPlaying(null)} locale={locale} />}
        </div>
    );
}
