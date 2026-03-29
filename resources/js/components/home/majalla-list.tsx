import { useState } from 'react';
import { BookOpen, Calendar, ChevronLeft, FileText, Newspaper, Star } from 'lucide-react';

type YearKey = 'همه' | '۱۴۰۴' | '۱۴۰۳' | '۱۴۰۲';

interface Issue {
    id: number;
    number: number;
    title: string;
    theme: string;
    date: string;
    year: string;
    articleCount: number;
    description: string;
    gradient: string;
    featured?: boolean;
    articles: string[];
}

/* ── Mock issues ─────────────────────────────────────────── */
const ISSUES: Issue[] = [
    {
        id: 1, number: 24, title: 'اسلام و دنیای مدرن', theme: 'عقیده و فکر',
        date: 'حمل ۱۴۰۴', year: '۱۴۰۴', articleCount: 8, featured: true,
        description: 'این شماره از مجله به بررسی رابطه اسلام با دنیای مدرن، چالش‌های پیش روی مسلمانان و راه‌حل‌های قرآنی و سنتی می‌پردازد.',
        gradient: 'from-indigo-900 via-blue-900 to-teal-900',
        articles: ['اسلام و مدرنیته', 'هویت مسلمان در غرب', 'فناوری و شریعت', 'جوانان مسلمان'],
    },
    {
        id: 2, number: 23, title: 'علم و دانش در اسلام', theme: 'تعلیم و تربیت',
        date: 'دلو ۱۴۰۳', year: '۱۴۰۳', articleCount: 7,
        description: 'شماره‌ای اختصاصی به فضیلت علم در اسلام، تاریخچه مدارس اسلامی و نقش دانشمندان مسلمان در تمدن بشری.',
        gradient: 'from-amber-900 via-orange-900 to-red-900',
        articles: ['تمدن اسلامی', 'مدارس دینی', 'علمای بزرگ', 'طلب علم در سنت'],
    },
    {
        id: 3, number: 22, title: 'خانواده مسلمان', theme: 'فقه و اخلاق',
        date: 'جدی ۱۴۰۳', year: '۱۴۰۳', articleCount: 9,
        description: 'بررسی جایگاه خانواده در اسلام، حقوق زن و مرد، تربیت فرزند و چالش‌های خانواده مسلمان در عصر حاضر.',
        gradient: 'from-rose-900 via-pink-900 to-purple-900',
        articles: ['حقوق زوجین', 'تربیت اسلامی', 'خانواده قرآنی', 'بحران خانواده'],
    },
    {
        id: 4, number: 21, title: 'قرآن و زندگی', theme: 'تفسیر و قرآن',
        date: 'قوس ۱۴۰۳', year: '۱۴۰۳', articleCount: 8,
        description: 'چگونگی تعامل روزانه با قرآن کریم، اهمیت تدبر در آیات و تأثیر قرآن در زندگی فردی و اجتماعی مسلمانان.',
        gradient: 'from-emerald-900 via-green-900 to-teal-900',
        articles: ['تدبر قرآنی', 'قرآن و درمان', 'حفظ قرآن', 'آداب تلاوت'],
    },
    {
        id: 5, number: 20, title: 'تاریخ اسلام در خراسان', theme: 'تاریخ',
        date: 'عقرب ۱۴۰۳', year: '۱۴۰۳', articleCount: 6,
        description: 'مروری جامع بر تاریخ ورود اسلام به خراسان، دانشمندان بزرگ منطقه و میراث علمی و فرهنگی اسلامی در این سرزمین.',
        gradient: 'from-stone-900 via-zinc-900 to-slate-900',
        articles: ['فتح خراسان', 'علمای خراسان', 'نسخه‌های خطی', 'میراث اسلامی'],
    },
    {
        id: 6, number: 19, title: 'رمضان — ماه تحول', theme: 'عبادت و تقوا',
        date: 'میزان ۱۴۰۳', year: '۱۴۰۳', articleCount: 10,
        description: 'ویژه‌نامه رمضان کریم: فضائل روزه، احکام، برنامه عبادی، تلاوت قرآن و توصیه‌های علما برای استفاده بهینه از این ماه مبارک.',
        gradient: 'from-violet-900 via-indigo-900 to-blue-900',
        articles: ['فقه روزه', 'برنامه رمضانی', 'قیام اللیل', 'عمره رمضان'],
    },
    {
        id: 7, number: 18, title: 'اقتصاد اسلامی', theme: 'فقه معاملات',
        date: 'سنبله ۱۴۰۳', year: '۱۴۰۳', articleCount: 7,
        description: 'اصول اقتصاد اسلامی، احکام بانکداری اسلامی، زکات و وقف به عنوان ابزار توسعه اقتصادی در جوامع مسلمان.',
        gradient: 'from-cyan-900 via-teal-900 to-emerald-900',
        articles: ['بانکداری اسلامی', 'زکات و توسعه', 'وقف', 'حرام و حلال'],
    },
    {
        id: 8, number: 17, title: 'سیره نبوی — الگوی جاودان', theme: 'سیره و حدیث',
        date: 'اسد ۱۴۰۳', year: '۱۴۰۳', articleCount: 8,
        description: 'بررسی جنبه‌های گوناگون سیره پیامبر اکرم صلی الله علیه وسلم به عنوان الگوی عملی برای زندگی مسلمانان.',
        gradient: 'from-yellow-900 via-amber-900 to-orange-900',
        articles: ['مکی و مدنی', 'اخلاق نبوی', 'معجزات', 'درس‌های سیره'],
    },
    {
        id: 9, number: 16, title: 'جوانان و آینده امت', theme: 'امت اسلامی',
        date: 'سرطان ۱۴۰۳', year: '۱۴۰۳', articleCount: 9,
        description: 'نقش جوانان مسلمان در بازسازی امت، چالش‌های نسل جدید، هویت اسلامی و برنامه‌های عملی برای آینده‌سازی.',
        gradient: 'from-lime-900 via-green-900 to-emerald-900',
        articles: ['بحران هویت', 'رهبری جوان', 'امت آینده', 'چالش‌های نسل Z'],
    },
    {
        id: 10, number: 15, title: 'علوم حدیث', theme: 'علوم اسلامی',
        date: 'جوزا ۱۴۰۲', year: '۱۴۰۲', articleCount: 6,
        description: 'معرفی علوم حدیث، روش محدثان در تحقیق سند و متن، کتب معتبر حدیثی و اهمیت آن در استنباط احکام اسلامی.',
        gradient: 'from-blue-900 via-indigo-900 to-violet-900',
        articles: ['اسناد حدیث', 'کتب صحاح', 'جرح و تعدیل', 'حدیث موضوع'],
    },
    {
        id: 11, number: 14, title: 'تفسیر قرآن — مناهج و روش‌ها', theme: 'تفسیر',
        date: 'ثور ۱۴۰۲', year: '۱۴۰۲', articleCount: 7,
        description: 'معرفی مناهج گوناگون تفسیری، تفاوت تفسیر ماثور و رأی، مفسران برجسته و کتب تفسیری معتبر در تاریخ اسلام.',
        gradient: 'from-teal-900 via-cyan-900 to-blue-900',
        articles: ['مناهج تفسیر', 'تفسیر به رأی', 'مفسران کبار', 'تفسیر علمی'],
    },
    {
        id: 12, number: 13, title: 'مسلمانان جهان', theme: 'جهان اسلام',
        date: 'حمل ۱۴۰۲', year: '۱۴۰۲', articleCount: 8,
        description: 'گزارشی از وضعیت مسلمانان در کشورهای مختلف جهان، چالش‌های اقلیت‌های مسلمان و همبستگی امت اسلامی.',
        gradient: 'from-orange-900 via-red-900 to-rose-900',
        articles: ['مسلمانان اروپا', 'آسیای مرکزی', 'آفریقا', 'همبستگی امت'],
    },
];

const YEARS: YearKey[] = ['همه', '۱۴۰۴', '۱۴۰۳', '۱۴۰۲'];

/* ── Featured issue card ─────────────────────────────────── */
function FeaturedCard({ issue }: { issue: Issue }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg transition-shadow mb-6">
            <div className={`bg-gradient-to-br ${issue.gradient} relative p-8 flex gap-6 items-start`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                {/* Cover */}
                <div className="relative z-10 shrink-0 w-28 h-40 rounded-lg bg-white/10 border border-white/20 flex flex-col items-center justify-center gap-1 shadow-xl">
                    <Newspaper className="w-8 h-8 text-white/80" />
                    <span className="text-white/90 text-[11px] font-bold">شماره {issue.number}</span>
                    <span className="text-white/60 text-[10px]">{issue.date}</span>
                </div>
                {/* Text */}
                <div className="relative z-10 flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-300 text-[11px] font-bold">آخرین شماره</span>
                    </div>
                    <h2 className="text-white font-bold text-[20px] leading-snug mb-2">{issue.title}</h2>
                    <span className="inline-block bg-white/20 text-white text-[11px] px-2.5 py-0.5 rounded-full mb-3">{issue.theme}</span>
                    <p className="text-white/80 text-[13px] leading-relaxed line-clamp-3">{issue.description}</p>
                </div>
            </div>

            <div className="p-5">
                <p className="text-[12px] text-gray-500 font-bold mb-3">مقالات این شماره:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {issue.articles.map((a) => (
                        <span key={a} className="text-[12px] bg-[#f0faf5] text-[#27ae60] px-2.5 py-1 rounded-full border border-[#27ae60]/20">
                            {a}
                        </span>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[12px] text-gray-400">
                        <FileText className="w-3.5 h-3.5" />
                        {issue.articleCount} مقاله
                    </span>
                    <a href="#" className="flex items-center gap-1.5 text-[13px] text-[#27ae60] font-bold hover:underline">
                        دانلود و مطالعه
                        <ChevronLeft className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}

/* ── Regular issue card ──────────────────────────────────── */
function IssueCard({ issue }: { issue: Issue }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
            {/* Cover thumbnail */}
            <div className={`h-40 bg-gradient-to-br ${issue.gradient} relative flex flex-col items-center justify-center gap-2`}>
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Newspaper className="w-5 h-5 text-white" />
                </div>
                <span className="relative z-10 text-white/90 text-[12px] font-bold">شماره {issue.number}</span>
                <span className="absolute top-3 end-3 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded">
                    {issue.date}
                </span>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <span className="text-[11px] text-[#27ae60] font-bold mb-1">{issue.theme}</span>
                <h3 className="font-bold text-[14px] text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#27ae60] transition-colors">
                    <a href="#">{issue.title}</a>
                </h3>
                <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">
                    {issue.description}
                </p>
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {issue.articleCount} مقاله
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {issue.date}
                    </span>
                </div>
            </div>

            <a href="#" className="flex items-center justify-between px-4 py-2.5 bg-[#f0faf5] text-[#27ae60] text-[12px] font-bold hover:bg-[#27ae60] hover:text-white transition-colors border-t border-gray-100">
                <span>مطالعه</span>
                <ChevronLeft className="w-3.5 h-3.5" />
            </a>
        </div>
    );
}

export function MajallaList() {
    const [activeYear, setActiveYear] = useState<YearKey>('همه');

    const featured = ISSUES[0];
    const filtered = ISSUES.slice(1).filter((i) => activeYear === 'همه' || i.year === activeYear);

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#27ae60]/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[#27ae60]" />
                </div>
                <div>
                    <p className="text-[13px] font-bold text-gray-800">مجله کتابخانه رسالت</p>
                    <p className="text-[11px] text-gray-400">{ISSUES.length} شماره منتشر شده</p>
                </div>
            </div>

            {/* Featured */}
            <FeaturedCard issue={featured} />

            {/* Year filter */}
            <div className="flex gap-2 mb-6">
                {YEARS.map((y) => (
                    <button
                        key={y}
                        onClick={() => setActiveYear(y)}
                        className={`text-[12px] px-4 py-1.5 rounded-full border font-medium transition-colors ${
                            activeYear === y
                                ? 'bg-[#27ae60] border-[#27ae60] text-white'
                                : 'border-gray-200 text-gray-600 hover:border-[#27ae60] hover:text-[#27ae60]'
                        }`}
                    >
                        {y === 'همه' ? 'همه شماره‌ها' : `سال ${y}`}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filtered.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>شماره‌ای برای این سال یافت نشد.</p>
                </div>
            )}
        </div>
    );
}
