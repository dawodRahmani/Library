import { useState, useEffect } from 'react';
import { Headphones, Play, Clock, User, ChevronLeft, Mic } from 'lucide-react';

type Category = 'همه' | 'عقیده و منهج' | 'پند و موعظه' | 'جهاد و استشهاد' | 'سیاست' | 'تحلیل و سخن روز' | 'تاریخ' | 'نشید و ترانه';

const CATEGORY_SLUG_MAP: Record<string, string> = {
    aqeedah: 'عقیده و منهج',
    advice: 'پند و موعظه',
    jihad: 'جهاد و استشهاد',
    politics: 'سیاست',
    analysis: 'تحلیل و سخن روز',
    history: 'تاریخ',
    nasheed: 'نشید و ترانه',
};

interface AudioItem {
    id: number;
    title: string;
    description: string;
    author: string;
    date: string;
    duration: string;
    category: Category;
    gradient: string;
    episodes?: number;
}

const AUDIO_ITEMS: AudioItem[] = [
    { id: 1,  title: 'شرح شعب الایمان — قسمت اول',         description: 'شرح و تفسیر کتاب شعب الایمان امام بیهقی، بیان شاخه‌های ایمان و چگونگی تقویت هر یک.',           author: 'شیخ عبدالله نوری',   date: '۹ حمل ۱۴۰۴',  duration: '۵۵ دقیقه', category: 'عقیده و منهج',      gradient: 'from-emerald-900 to-teal-800',   episodes: 12 },
    { id: 2,  title: 'شرح حدیث جبریل',                      description: 'تفسیر و شرح حدیث معروف جبریل که در آن اسلام، ایمان و احسان تعریف شده‌اند.',                    author: 'مفتی احمد رحمانی',  date: '۸ حمل ۱۴۰۴',  duration: '۴۸ دقیقه', category: 'پند و موعظه',       gradient: 'from-blue-900 to-indigo-800',    episodes: 8  },
    { id: 3,  title: 'آموزش قرائت قرآن کریم — مبتدی',      description: 'دوره جامع آموزش قرائت صحیح قرآن کریم با رعایت تجوید، مناسب برای مبتدیان.',                     author: 'قاری محمد امین',    date: '۷ حمل ۱۴۰۴',  duration: '۳۵ دقیقه', category: 'عقیده و منهج',      gradient: 'from-violet-900 to-purple-800',  episodes: 20 },
    { id: 4,  title: 'تحلیل اوضاع جهان اسلام',             description: 'بررسی و تحلیل اوضاع کنونی جهان اسلام، چالش‌ها و فرصت‌های پیش رو از منظر اسلامی.',            author: 'دکتر محمد حسینی',  date: '۶ حمل ۱۴۰۴',  duration: '۶۲ دقیقه', category: 'تحلیل و سخن روز',   gradient: 'from-rose-900 to-red-800',       episodes: 5  },
    { id: 5,  title: 'فضائل رمضان و احکام آن',             description: 'بیان فضائل ماه مبارک رمضان، احکام روزه، تراویح و شب قدر با ادله از قرآن و سنت.',              author: 'شیخ عبدالله نوری',   date: '۵ حمل ۱۴۰۴',  duration: '۴۵ دقیقه', category: 'پند و موعظه',       gradient: 'from-amber-900 to-orange-800',   episodes: 30 },
    { id: 6,  title: 'اذکار و ادعیه روزانه',               description: 'مجموعه اذکار صبح و شام، دعاهای بعد از نماز و اذکار مختلف با تلفظ صحیح و ترجمه دری.',          author: 'قاری محمد امین',    date: '۴ حمل ۱۴۰۴',  duration: '۲۸ دقیقه', category: 'نشید و ترانه',      gradient: 'from-teal-900 to-cyan-800',      episodes: 7  },
    { id: 7,  title: 'شرح اربعین نووی',                    description: 'شرح چهل حدیث نووی با بیان مفردات، معانی و فوائد فقهی و روحی هر حدیث.',                        author: 'مفتی احمد رحمانی',  date: '۳ حمل ۱۴۰۴',  duration: '۵۸ دقیقه', category: 'پند و موعظه',       gradient: 'from-green-900 to-emerald-800',  episodes: 15 },
    { id: 8,  title: 'تقویت ایمان در زندگی روزمره',        description: 'رهنمودهای عملی برای تقویت ایمان، اصلاح اخلاق و نزدیک شدن بیشتر به خداوند در زندگی روزانه.', author: 'شیخ زهرا نوری',    date: '۲ حمل ۱۴۰۴',  duration: '۴۰ دقیقه', category: 'عقیده و منهج',      gradient: 'from-indigo-900 to-blue-800',    episodes: 10 },
    { id: 9,  title: 'آموزش مقامات قرآنی',                 description: 'معرفی مقامات مشهور قرائت قرآن کریم، تفاوت آن‌ها و تمرین‌های عملی برای هر مقام.',             author: 'قاری محمد امین',    date: '۱ حمل ۱۴۰۴',  duration: '۵۰ دقیقه', category: 'نشید و ترانه',      gradient: 'from-pink-900 to-rose-800',      episodes: 18 },
    { id: 10, title: 'درس‌های عقیده از کتاب لمعة الاعتقاد', description: 'شرح کتاب لمعة الاعتقاد ابن قدامه، بیان اصول عقیده اهل سنت به صورت ساده و روان.',            author: 'دکتر محمد حسینی',  date: '۲۹ حوت ۱۴۰۳', duration: '۴۴ دقیقه', category: 'جهاد و استشهاد',    gradient: 'from-slate-900 to-gray-800',     episodes: 9  },
    { id: 11, title: 'شب‌های رمضان — تفسیر سوره بقره',    description: 'تفسیر سوره بقره در شب‌های ماه رمضان با تمرکز بر معانی و احکام آیات.',                        author: 'شیخ عبدالله نوری',   date: '۲۸ حوت ۱۴۰۳', duration: '۷۵ دقیقه', category: 'سیاست',             gradient: 'from-cyan-900 to-teal-800',      episodes: 28 },
    { id: 12, title: 'سیره نبوی — از ولادت تا بعثت',       description: 'بررسی دوران کودکی و جوانی پیامبر اکرم صلی الله علیه وسلم قبل از نبوت.',                      author: 'مفتی احمد رحمانی',  date: '۲۷ حوت ۱۴۰۳', duration: '۵۲ دقیقه', category: 'تاریخ',             gradient: 'from-amber-900 to-yellow-800',   episodes: 6  },
];

const CATEGORIES: Category[] = ['همه', 'عقیده و منهج', 'پند و موعظه', 'جهاد و استشهاد', 'سیاست', 'تحلیل و سخن روز', 'تاریخ', 'نشید و ترانه'];

const CAT_COLORS: Record<string, string> = {
    'عقیده و منهج':    'bg-emerald-100 text-emerald-700',
    'پند و موعظه':     'bg-blue-100    text-blue-700',
    'جهاد و استشهاد':  'bg-red-100     text-red-700',
    'سیاست':           'bg-violet-100  text-violet-700',
    'تحلیل و سخن روز': 'bg-rose-100    text-rose-700',
    'تاریخ':           'bg-amber-100   text-amber-700',
    'نشید و ترانه':    'bg-teal-100    text-teal-700',
};

function AudioCard({ item }: { item: AudioItem }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
            {/* Thumbnail */}
            <div className={`h-36 bg-gradient-to-br ${item.gradient} relative flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30 group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white ms-0.5" />
                    </div>
                </div>
                <span className={`absolute top-3 end-3 text-[11px] font-bold px-2 py-0.5 rounded-full ${CAT_COLORS[item.category] ?? 'bg-gray-100 text-gray-700'}`}>
                    {item.category}
                </span>
                {item.episodes && (
                    <span className="absolute bottom-3 start-3 bg-black/50 text-white text-[11px] px-2 py-0.5 rounded flex items-center gap-1">
                        <Mic className="w-3 h-3" /> {item.episodes} قسمت
                    </span>
                )}
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
                    <span className="flex items-center gap-2">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.duration}</span>
                        <span>{item.date}</span>
                    </span>
                </div>
            </div>

            <a href="#" className="flex items-center justify-between px-4 py-2.5 bg-[#f0faf5] text-[#27ae60] text-[12px] font-bold hover:bg-[#27ae60] hover:text-white transition-colors border-t border-gray-100">
                <span>گوش دادن</span>
                <ChevronLeft className="w-3.5 h-3.5" />
            </a>
        </div>
    );
}

export function AudioList({ initialCategory }: { initialCategory?: string }) {
    const [active, setActive] = useState<Category>('همه');

    useEffect(() => {
        if (initialCategory) {
            setActive(initialCategory as Category);
            return;
        }
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('category');
        if (slug && CATEGORY_SLUG_MAP[slug]) {
            setActive(CATEGORY_SLUG_MAP[slug] as Category);
        }
    }, [initialCategory]);

    const filtered = active === 'همه' ? AUDIO_ITEMS : AUDIO_ITEMS.filter((a) => a.category === active);

    return (
        <div>
            {/* Stats bar */}
            <div className="flex items-center gap-3 mb-5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#27ae60]/10 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-[#27ae60]" />
                </div>
                <div>
                    <p className="text-[13px] font-bold text-gray-800">{AUDIO_ITEMS.length} فایل صوتی</p>
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
                    <AudioCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}
