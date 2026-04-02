import { useState, useEffect } from 'react';
import { BookMarked, Clock, User, ChevronLeft } from 'lucide-react';

/* ── Types ───────────────────────────────────────────────── */
type Category = 'همه' | 'توحید و عقیده' | 'جهاد و استشهاد' | 'قضایای سیاسی' | 'احکام شرعی عام' | 'بیانیه‌ها';

const CATEGORY_SLUG_MAP: Record<string, string> = {
    tawheed: 'توحید و عقیده',
    jihad: 'جهاد و استشهاد',
    political: 'قضایای سیاسی',
    rulings: 'احکام شرعی عام',
    statements: 'بیانیه‌ها',
};

interface FatwaItem {
    id: number;
    title: string;
    description: string;
    author: string;
    date: string;
    category: Category;
    gradient: string;
}

/* ── Mock data ───────────────────────────────────────────── */
const FATWA_ITEMS: FatwaItem[] = [
    { id: 1, title: 'حکم نماز جماعت در مسجد', description: 'بیان احکام و فضایل نماز جماعت و شرایط وجوب آن از دیدگاه فقهای اهل سنت.', author: 'شیخ عبدالله نوری', date: '۹ حمل ۱۴۰۴', category: 'توحید و عقیده', gradient: 'from-emerald-900 to-teal-800' },
    { id: 2, title: 'مسائل زکات فطر', description: 'بررسی احکام تفصیلی زکات فطر، مقدار، وقت و مستحقین آن با دلایل از قرآن و سنت.', author: 'مفتی احمد رحمانی', date: '۸ حمل ۱۴۰۴', category: 'احکام شرعی عام', gradient: 'from-blue-900 to-indigo-800' },
    { id: 3, title: 'حکم روزه مسافر', description: 'تفصیل احکام روزه در سفر و شرایطی که افطار جایز یا واجب می‌شود.', author: 'شیخ عبدالله نوری', date: '۷ حمل ۱۴۰۴', category: 'احکام شرعی عام', gradient: 'from-violet-900 to-purple-800' },
    { id: 4, title: 'مسائل نکاح و طلاق', description: 'شرح مسائل مهم در باب نکاح، شرایط صحت آن و احکام طلاق از نظر فقه حنفی.', author: 'مفتی محمد حسینی', date: '۶ حمل ۱۴۰۴', category: 'احکام شرعی عام', gradient: 'from-rose-900 to-red-800' },
    { id: 5, title: 'بیانیه درباره وضعیت مسلمانان', description: 'بیانیه رسمی دارالإفتاء درباره وضعیت مسلمانان و مسئولیت‌های شرعی آنان.', author: 'دارالإفتاء', date: '۵ حمل ۱۴۰۴', category: 'بیانیه‌ها', gradient: 'from-amber-900 to-orange-800' },
    { id: 6, title: 'احکام تجارت آنلاین', description: 'فتوا در مورد خرید و فروش آنلاین، شرایط صحت معامله و موارد حرام در تجارت اینترنتی.', author: 'مفتی محمد حسینی', date: '۴ حمل ۱۴۰۴', category: 'احکام شرعی عام', gradient: 'from-teal-900 to-cyan-800' },
    { id: 7, title: 'حکم جهاد در عصر حاضر', description: 'بررسی احکام جهاد و شرایط آن در عصر حاضر از دیدگاه فقهای معاصر.', author: 'مفتی احمد رحمانی', date: '۳ حمل ۱۴۰۴', category: 'جهاد و استشهاد', gradient: 'from-red-900 to-rose-800' },
    { id: 8, title: 'توحید و اقسام آن', description: 'شرح اقسام توحید (ربوبیت، الوهیت، اسماء و صفات) با ادله از قرآن و سنت.', author: 'شیخ عبدالله نوری', date: '۲ حمل ۱۴۰۴', category: 'توحید و عقیده', gradient: 'from-indigo-900 to-blue-800' },
    { id: 9, title: 'موضع اسلام در مسائل سیاسی معاصر', description: 'تحلیل مسائل سیاسی معاصر از منظر شریعت اسلامی و موضع‌گیری فقهی.', author: 'دکتر محمد حسینی', date: '۱ حمل ۱۴۰۴', category: 'قضایای سیاسی', gradient: 'from-slate-900 to-gray-800' },
    { id: 10, title: 'فضائل شهادت در اسلام', description: 'بررسی آیات و احادیث مربوط به فضائل شهادت و مقام شهید در اسلام.', author: 'مفتی احمد رحمانی', date: '۲۹ حوت ۱۴۰۳', category: 'جهاد و استشهاد', gradient: 'from-green-900 to-emerald-800' },
    { id: 11, title: 'بیانیه درباره روز عرفه', description: 'بیانیه دارالإفتاء درباره فضایل روز عرفه و اعمال مستحب آن.', author: 'دارالإفتاء', date: '۲۸ حوت ۱۴۰۳', category: 'بیانیه‌ها', gradient: 'from-amber-900 to-yellow-800' },
    { id: 12, title: 'قضایای سیاسی جهان اسلام', description: 'بررسی مهم‌ترین قضایای سیاسی جهان اسلام و موضع شرعی مسلمانان.', author: 'دکتر محمد حسینی', date: '۲۷ حوت ۱۴۰۳', category: 'قضایای سیاسی', gradient: 'from-cyan-900 to-teal-800' },
];

const CATEGORIES: Category[] = ['همه', 'توحید و عقیده', 'جهاد و استشهاد', 'قضایای سیاسی', 'احکام شرعی عام', 'بیانیه‌ها'];

const CAT_COLORS: Record<string, string> = {
    'توحید و عقیده':  'bg-emerald-100 text-emerald-700',
    'جهاد و استشهاد':  'bg-red-100     text-red-700',
    'قضایای سیاسی':   'bg-violet-100  text-violet-700',
    'احکام شرعی عام': 'bg-blue-100    text-blue-700',
    'بیانیه‌ها':       'bg-amber-100   text-amber-700',
};

/* ── Card ────────────────────────────────────────────────── */
function FatwaCard({ item }: { item: FatwaItem }) {
    const catClass = CAT_COLORS[item.category] ?? 'bg-gray-100 text-gray-700';

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
            {/* Thumbnail */}
            <div className={`h-36 bg-gradient-to-br ${item.gradient} relative flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <BookMarked className="relative z-10 w-12 h-12 text-white/60 group-hover:text-white/90 transition-colors" />
                <span className={`absolute top-3 end-3 text-[11px] font-bold px-2 py-0.5 rounded-full ${catClass}`}>
                    {item.category}
                </span>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-[14px] text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#27ae60] transition-colors">
                    <a href="#">{item.title}</a>
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
            <a href="#" className="flex items-center justify-between px-4 py-2.5 bg-[#f0faf5] text-[#27ae60] text-[12px] font-bold hover:bg-[#27ae60] hover:text-white transition-colors border-t border-gray-100">
                <span>مشاهده</span>
                <ChevronLeft className="w-3.5 h-3.5" />
            </a>
        </div>
    );
}

/* ── Main export ─────────────────────────────────────────── */
export function DarUlIftaList() {
    const [active, setActive] = useState<Category>('همه');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('category');
        if (slug && CATEGORY_SLUG_MAP[slug]) {
            setActive(CATEGORY_SLUG_MAP[slug] as Category);
        }
    }, []);

    const filtered = active === 'همه' ? FATWA_ITEMS : FATWA_ITEMS.filter((item) => item.category === active);

    return (
        <div>
            {/* Stats bar */}
            <div className="flex items-center gap-3 mb-5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#27ae60]/10 flex items-center justify-center">
                    <BookMarked className="w-5 h-5 text-[#27ae60]" />
                </div>
                <div>
                    <p className="text-[13px] font-bold text-gray-800">{FATWA_ITEMS.length} فتوا و بیانیه</p>
                    <p className="text-[11px] text-gray-400">در {CATEGORIES.length - 1} دسته‌بندی</p>
                </div>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActive(cat)}
                        className={`text-[12px] px-3 py-1.5 rounded-full border font-medium transition-colors ${
                            cat === active
                                ? 'bg-[#27ae60] border-[#27ae60] text-white'
                                : 'border-gray-200 text-gray-600 hover:border-[#27ae60] hover:text-[#27ae60]'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filtered.map((item) => (
                    <FatwaCard key={item.id} item={item} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <BookMarked className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>هیچ موردی یافت نشد.</p>
                </div>
            )}
        </div>
    );
}
