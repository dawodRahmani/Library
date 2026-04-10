import { Clock, User, Tag, X, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Locale = 'da' | 'en' | 'ar' | 'tg';
function getLocale(lang: string): Locale {
    return (['da', 'en', 'ar', 'tg'] as const).includes(lang as Locale) ? lang as Locale : 'da';
}

export interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content?: string;
    author: string;
    date: string;
    category: string;
    categorySlug?: string;
    readTime: string;
    cover_image?: string | null;
}

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

const getGradient = (category: string, id: number): string => {
    const gradients = [
        'from-emerald-900 to-teal-800',
        'from-blue-900 to-indigo-800',
        'from-violet-900 to-purple-800',
        'from-rose-900 to-red-800',
        'from-amber-900 to-orange-800',
        'from-teal-900 to-cyan-800',
        'from-slate-900 to-gray-800',
        'from-green-900 to-emerald-800',
        'from-indigo-900 to-blue-800',
        'from-pink-900 to-rose-800',
        'from-cyan-900 to-teal-800',
        'from-amber-900 to-yellow-800',
    ];
    const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[(hash + id) % gradients.length];
};

// ── Article Reader Modal ──────────────────────────────────────────────────────
function ArticleModal({ article, onClose, locale }: { article: Article; onClose: () => void; locale: Locale }) {
    const catClass = CATEGORY_COLORS[article.category] ?? CATEGORY_COLORS.default;
    const gradient = getGradient(article.category, article.id);

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto py-8 px-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cover */}
                {article.cover_image ? (
                    <div className="relative">
                        <img
                            src={`/storage/${article.cover_image}`}
                            alt={article.title}
                            className="w-full h-56 object-cover"
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-3 end-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                        <div className="absolute inset-0 bg-black/20" />
                        <button
                            onClick={onClose}
                            className="absolute top-3 end-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="p-6 md:p-8" dir="rtl">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${catClass}`}>{article.category}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400"><Calendar className="w-3.5 h-3.5" />{article.date}</span>
                        {article.readTime && (
                            <span className="flex items-center gap-1 text-xs text-gray-400"><Clock className="w-3.5 h-3.5" />{article.readTime}</span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-gray-400 ms-auto"><User className="w-3.5 h-3.5" />{article.author}</span>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-4">{article.title}</h1>

                    {article.excerpt && (
                        <p className="text-base text-gray-600 leading-relaxed mb-6 pb-6 border-b border-gray-100 font-medium">
                            {article.excerpt}
                        </p>
                    )}

                    {/* Rich text content */}
                    {article.content ? (
                        <div
                            className="prose prose-base max-w-none text-gray-700 leading-relaxed
                                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-4 [&_h1]:mt-6
                                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-3 [&_h2]:mt-5
                                [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mb-2 [&_h3]:mt-4
                                [&_p]:mb-4 [&_p]:leading-relaxed
                                [&_ul]:list-disc [&_ul]:ps-5 [&_ul]:mb-4
                                [&_ol]:list-decimal [&_ol]:ps-5 [&_ol]:mb-4
                                [&_li]:mb-1.5
                                [&_blockquote]:border-s-4 [&_blockquote]:border-emerald-400 [&_blockquote]:ps-4 [&_blockquote]:py-1 [&_blockquote]:text-gray-600 [&_blockquote]:italic [&_blockquote]:my-4
                                [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                                [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4
                                [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-4
                                [&_a]:text-emerald-600 [&_a]:underline
                                [&_hr]:border-gray-200 [&_hr]:my-6"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    ) : (
                        <p className="text-gray-400 italic text-sm">{{ da: 'محتوایی برای این مقاله ثبت نشده است.', en: 'No content for this article.', ar: 'لا يتوفر محتوى لهذه المقالة.', tg: 'Мӯҳтаво барои ин мақола ёфт нашуд.' }[locale]}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Article Card ──────────────────────────────────────────────────────────────
function ArticleCard({ article, onRead }: { article: Article; onRead: (a: Article) => void }) {
    const catClass = CATEGORY_COLORS[article.category] ?? CATEGORY_COLORS.default;
    const gradient = getGradient(article.category, article.id);

    return (
        <article
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onRead(article)}
        >
            {/* Thumbnail */}
            {article.cover_image ? (
                <div className="h-44 overflow-hidden">
                    <img
                        src={`/storage/${article.cover_image}`}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            ) : (
                <div className={`h-44 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
            )}

            <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${catClass}`}>{article.category}</span>
                    {article.readTime && (
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                            <Clock className="w-3 h-3" />{article.readTime}
                        </span>
                    )}
                </div>
                <h2 className="font-bold text-[15px] text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#27ae60] transition-colors">
                    {article.title}
                </h2>
                <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 mb-4">
                    {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-[12px] text-gray-400 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{article.author}</span>
                    </div>
                    <span>{article.date}</span>
                </div>
            </div>
        </article>
    );
}

// ── List ──────────────────────────────────────────────────────────────────────
interface ArticlesListProps {
    articles: Article[];
    activeCategory?: string;
    onCategoryChange?: (cat: string) => void;
}

export function ArticlesList({ articles, activeCategory = 'all', onCategoryChange }: ArticlesListProps) {
    const { i18n } = useTranslation();
    const locale = getLocale(i18n.language);

    const allLabel  = { da: 'همه', en: 'All', ar: 'الكل', tg: 'Ҳама' }[locale];
    const noItems   = { da: 'هیچ مقاله‌ای یافت نشد.', en: 'No articles found.', ar: 'لم يُعثر على مقالات.', tg: 'Мақолае ёфт нашуд.' }[locale];
    const noContent = { da: 'محتوایی برای این مقاله ثبت نشده است.', en: 'No content for this article.', ar: 'لا يتوفر محتوى لهذه المقالة.', tg: 'Мӯҳтаво барои ин мақола ёфт нашуд.' }[locale];

    // Build unique category list as {slug, name} pairs
    const categoryMap = new Map<string, string>();
    articles.forEach((a) => { if (a.categorySlug) categoryMap.set(a.categorySlug, a.category); });
    const allCategories = [{ slug: 'all', name: allLabel }, ...Array.from(categoryMap.entries()).map(([slug, name]) => ({ slug, name }))];

    const filtered = activeCategory === 'all'
        ? articles
        : articles.filter((a) => a.categorySlug === activeCategory);
    const [reading, setReading] = useState<Article | null>(null);

    return (
        <div>
            {/* Category filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {allCategories.map((cat) => (
                    <button
                        key={cat.slug}
                        onClick={() => onCategoryChange?.(cat.slug)}
                        className={`text-[12px] px-3 py-1.5 rounded-full border font-medium transition-colors ${
                            cat.slug === activeCategory
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
                {filtered.map((article) => (
                    <ArticleCard key={article.id} article={article} onRead={setReading} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>{noItems}</p>
                </div>
            )}

            {/* Article reader modal */}
            {reading && <ArticleModal article={reading} onClose={() => setReading(null)} locale={locale} />}
        </div>
    );
}
