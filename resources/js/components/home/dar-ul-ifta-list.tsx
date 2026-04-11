import { BookMarked, Clock, User, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Locale = 'da' | 'en' | 'ar' | 'tg';
function getLocale(lang: string): Locale {
    return (['da', 'en', 'ar', 'tg'] as const).includes(lang as Locale) ? lang as Locale : 'da';
}

/* ── Types ───────────────────────────────────────────────── */
interface FatwaItem {
    id: number;
    title: string;
    description: string;
    author: string;
    date: string;
    category: string;
    categorySlug: string;
    thumbnail: string | null;
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
    // Use category hash to pick gradient
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
    // default fallback
    'default': 'bg-gray-100 text-gray-700',
};

/* ── Card ────────────────────────────────────────────────── */
function FatwaCard({ item, onOpen, locale }: { item: FatwaItem; onOpen: () => void; locale: Locale }) {
    const gradient = getGradient(item.category, item.id);
    const catClass = CAT_COLORS[item.category] ?? CAT_COLORS.default;

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
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                {!item.thumbnail && (
                    <BookMarked className="relative z-10 w-12 h-12 text-white/60 group-hover:text-white/90 transition-colors" />
                )}
                <span className={`absolute top-3 end-3 text-[11px] font-bold px-2 py-0.5 rounded-full ${catClass}`}>
                    {item.category}
                </span>
            </div>

            {/* Body */}
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

            {/* CTA */}
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

    const [activeSlug, setActiveSlug] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('category') ?? 'all';
        }
        return 'all';
    });

    const [selected, setSelected] = useState<FatwaItem | null>(null);

    const filtered = activeSlug === 'all' ? fatwas : fatwas.filter((item) => item.categorySlug === activeSlug);

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
                <DialogContent className="max-w-lg w-full" dir="rtl">
                    {selected && (
                        <>
                            <DialogHeader className="text-start">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${catClass}`}>
                                        {selected.category}
                                    </span>
                                </div>
                                <DialogTitle className="text-[16px] font-bold text-gray-900 leading-snug">
                                    {selected.title}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="mt-3 text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {selected.description || <span className="text-gray-400">{noContent}</span>}
                            </div>

                            <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100 text-[12px] text-gray-400">
                                <span className="flex items-center gap-1">
                                    <User className="w-3.5 h-3.5" /> {selected.author}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" /> {selected.date}
                                </span>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
