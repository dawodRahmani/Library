import { Clock, User, Tag } from 'lucide-react';

export interface Article {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    readTime: string;
    gradient: string;
}

export const MOCK_ARTICLES: Article[] = [
    {
        id: 1,
        title: 'تفسیر سوره بقره — بخش اول: آیات ابتدایی',
        excerpt: 'در این مقاله به بررسی آیات ابتدایی سوره بقره و تفسیر آن‌ها از دیدگاه مفسران بزرگ اسلامی می‌پردازیم.',
        author: 'استاد احمد رحمانی', date: '۹ حمل ۱۴۰۴', category: 'تفسیر', readTime: '۱۰ دقیقه',
        gradient: 'from-emerald-900 to-teal-800',
    },
    {
        id: 2,
        title: 'تاریخچه خط و کتابت در افغانستان',
        excerpt: 'مروری بر تاریخچه خط دری و سیر تحول آن از دوران باستان تا عصر حاضر، همراه با بررسی نسخه‌های خطی کمیاب.',
        author: 'دکتر محمد حسینی', date: '۸ حمل ۱۴۰۴', category: 'تاریخ', readTime: '۱۵ دقیقه',
        gradient: 'from-blue-900 to-indigo-800',
    },
    {
        id: 3,
        title: 'فقه الحنفی — کتاب الصلاة: احکام نماز',
        excerpt: 'شرح و بیان احکام نماز از دیدگاه فقه حنفی، با استناد به منابع معتبر فقهی و دیدگاه‌های علمای برجسته.',
        author: 'شیخ عبدالله نوری', date: '۷ حمل ۱۴۰۴', category: 'فقه', readTime: '۲۰ دقیقه',
        gradient: 'from-violet-900 to-purple-800',
    },
    {
        id: 4,
        title: 'سلسله مقالات امت اسلامی — قسمت اول',
        excerpt: 'بررسی وضعیت کنونی امت اسلامی، چالش‌های پیش رو و راه‌حل‌های پیشنهادی از منظر قرآن و سنت.',
        author: 'ادمین', date: '۶ حمل ۱۴۰۴', category: 'امت اسلامی', readTime: '۱۲ دقیقه',
        gradient: 'from-rose-900 to-red-800',
    },
    {
        id: 5,
        title: 'علم حدیث و اهمیت آن در شریعت اسلامی',
        excerpt: 'تبیین جایگاه حدیث نبوی در شریعت اسلامی، علوم مربوط به آن و روش‌های تحقیق و تحلیل احادیث.',
        author: 'استاد فاطمه کریمی', date: '۵ حمل ۱۴۰۴', category: 'علوم حدیث', readTime: '۱۸ دقیقه',
        gradient: 'from-amber-900 to-orange-800',
    },
    {
        id: 6,
        title: 'آموزش قرائت قرآن کریم برای مبتدیان',
        excerpt: 'راهنمای جامع و کامل آموزش قرائت صحیح قرآن کریم برای کسانی که می‌خواهند از ابتدا یاد بگیرند.',
        author: 'قاری محمد امین', date: '۴ حمل ۱۴۰۴', category: 'قرآن', readTime: '۸ دقیقه',
        gradient: 'from-teal-900 to-cyan-800',
    },
    {
        id: 7,
        title: 'تحلیلی بر وضعیت مسلمانان آسیای مرکزی',
        excerpt: 'بررسی وضعیت دینی، فرهنگی و اجتماعی مسلمانان کشورهای آسیای مرکزی پس از فروپاشی اتحاد شوروی.',
        author: 'دکتر علی محمدی', date: '۳ حمل ۱۴۰۴', category: 'تحلیل', readTime: '۲۵ دقیقه',
        gradient: 'from-slate-900 to-gray-800',
    },
    {
        id: 8,
        title: 'ادعیه و اذکار صباح و مساء با ترجمه دری',
        excerpt: 'مجموعه کامل دعاها و اذکار صبح و شام از قرآن کریم و سنت نبوی، همراه با ترجمه روان به زبان دری.',
        author: 'ادمین', date: '۲ حمل ۱۴۰۴', category: 'ادعیه', readTime: '۶ دقیقه',
        gradient: 'from-green-900 to-emerald-800',
    },
    {
        id: 9,
        title: 'اصول عقیده اسلامی از دیدگاه اهل سنت',
        excerpt: 'شرح مختصر اصول عقیده اسلامی بر اساس منهج اهل سنت و جماعت، با ارجاع به متون کلاسیک.',
        author: 'شیخ زهرا نوری', date: '۱ حمل ۱۴۰۴', category: 'عقیده', readTime: '۱۴ دقیقه',
        gradient: 'from-indigo-900 to-blue-800',
    },
    {
        id: 10,
        title: 'نقش زنان مسلمان در تاریخ علم و فرهنگ',
        excerpt: 'مروری بر نقش زنان مسلمان در توسعه علوم اسلامی، ادبیات و فرهنگ از صدر اسلام تا دوران معاصر.',
        author: 'دکتر سارا احمدی', date: '۲۹ حوت ۱۴۰۳', category: 'تاریخ', readTime: '۱۶ دقیقه',
        gradient: 'from-pink-900 to-rose-800',
    },
    {
        id: 11,
        title: 'اهمیت طلب علم در اسلام',
        excerpt: 'بررسی آیات و احادیث مربوط به فضیلت علم و دانش در اسلام و تأثیر آن در ساختن جوامع مسلمان.',
        author: 'استاد احمد رحمانی', date: '۲۸ حوت ۱۴۰۳', category: 'تعلیم', readTime: '۱۱ دقیقه',
        gradient: 'from-cyan-900 to-teal-800',
    },
    {
        id: 12,
        title: 'مناسک حج و آداب آن به زبان ساده',
        excerpt: 'توضیح کامل مناسک حج، واجبات، سنت‌ها و مستحبات آن به زبانی ساده و قابل فهم برای عموم مردم.',
        author: 'شیخ عبدالله نوری', date: '۲۷ حوت ۱۴۰۳', category: 'فقه', readTime: '۲۲ دقیقه',
        gradient: 'from-amber-900 to-yellow-800',
    },
];

const CATEGORY_COLORS: Record<string, string> = {
    'تفسیر':       'bg-emerald-100 text-emerald-700',
    'تاریخ':       'bg-blue-100 text-blue-700',
    'فقه':         'bg-violet-100 text-violet-700',
    'امت اسلامی': 'bg-rose-100 text-rose-700',
    'علوم حدیث':  'bg-amber-100 text-amber-700',
    'قرآن':        'bg-teal-100 text-teal-700',
    'تحلیل':       'bg-slate-100 text-slate-700',
    'ادعیه':       'bg-green-100 text-green-700',
    'عقیده':       'bg-indigo-100 text-indigo-700',
    'تعلیم':       'bg-cyan-100 text-cyan-700',
    'default':     'bg-gray-100 text-gray-700',
};

function ArticleCard({ article }: { article: Article }) {
    const catClass = CATEGORY_COLORS[article.category] ?? CATEGORY_COLORS.default;

    return (
        <article className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            {/* Thumbnail */}
            <div className={`h-44 bg-gradient-to-br ${article.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <span className={`absolute top-3 end-3 text-[11px] font-bold px-2.5 py-1 rounded-full ${catClass}`}>
                    {article.category}
                </span>
            </div>

            {/* Body */}
            <div className="p-5">
                <h2 className="font-bold text-[15px] text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#27ae60] transition-colors">
                    <a href={`/articles/${article.id}`}>{article.title}</a>
                </h2>
                <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 mb-4">
                    {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-[12px] text-gray-400 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {article.readTime}
                        </span>
                        <span>{article.date}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}

interface ArticlesListProps {
    articles?: Article[];
    activeCategory?: string;
    onCategoryChange?: (cat: string) => void;
}

const ALL_CATEGORIES = ['همه', ...Array.from(new Set(MOCK_ARTICLES.map((a) => a.category)))];

export function ArticlesList({ articles = MOCK_ARTICLES, activeCategory = 'همه', onCategoryChange }: ArticlesListProps) {
    const filtered = activeCategory === 'همه' ? articles : articles.filter((a) => a.category === activeCategory);

    return (
        <div>
            {/* Category filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {ALL_CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange?.(cat)}
                        className={`text-[12px] px-3 py-1.5 rounded-full border font-medium transition-colors ${
                            cat === activeCategory
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
                {filtered.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>هیچ مقاله‌ای یافت نشد.</p>
                </div>
            )}
        </div>
    );
}
