import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopBar }     from '@/components/home/top-bar';
import { MainNav }    from '@/components/home/main-nav';
import { NewsTicker } from '@/components/home/news-ticker';
import { PageHeader } from '@/components/home/page-header';
import { HomeFooter } from '@/components/home/home-footer';
import { BookOpen, Search, Star, X, Hash, User, CalendarDays, Layers, Filter, Download, BookText, BookMarked } from 'lucide-react';

type Locale = 'da' | 'en' | 'ar' | 'tg';

function getLocale(lang: string): Locale {
    return (['da', 'en', 'ar', 'tg'] as const).includes(lang as Locale) ? lang as Locale : 'da';
}

interface Book {
    id: number;
    title: string;
    author: string;
    category: string;
    categorySlug: string;
    year: number;
    isbn: string;
    rating: number;
    description: string;
    pages: number;
    publisher: string;
    cover_image: string | null;
    has_file: boolean;
    file_url: string | null;
    file_type: string | null;
    file_size: number | null;
}

interface Category {
    slug: string;
    name: string;
}

interface PageProps {
    books: Book[];
    categories: Category[];
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
    const cls = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`${cls} ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
            ))}
        </div>
    );
}

function BookDetailModal({ book, onClose, locale }: { book: Book; onClose: () => void; locale: Locale }) {
    const L = {
        author:      { da: 'نویسنده',      en: 'Author',     ar: 'المؤلف',           tg: 'Муаллиф' }[locale],
        isbn:        { da: 'شابک',          en: 'ISBN',        ar: 'ISBN',             tg: 'ISBN' }[locale],
        year:        { da: 'سال انتشار',    en: 'Year',        ar: 'سنة النشر',        tg: 'Соли нашр' }[locale],
        pages:       { da: 'تعداد صفحات',  en: 'Pages',       ar: 'عدد الصفحات',      tg: 'Теъдоди саҳифаҳо' }[locale],
        publisher:   { da: 'ناشر',          en: 'Publisher',   ar: 'الناشر',           tg: 'Нашриётчӣ' }[locale],
        category:    { da: 'دسته‌بندی',     en: 'Category',    ar: 'الفئة',            tg: 'Категория' }[locale],
        pagesUnit:   { da: 'صفحه',          en: 'pages',       ar: 'صفحة',             tg: 'саҳифа' }[locale],
        readOnline:  { da: 'مطالعه آنلاین', en: 'Read Online', ar: 'قراءة عبر الإنترنت', tg: 'Хондани онлайн' }[locale],
        download:    { da: 'دانلود',        en: 'Download',    ar: 'تحميل',            tg: 'Зеркашӣ' }[locale],
        noFile:      { da: 'فایل دیجیتال موجود نیست', en: 'No digital file available', ar: 'لا يتوفر ملف رقمي', tg: 'Файли рақамӣ дастнорас' }[locale],
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between p-6 border-b border-gray-100">
                    <div className="flex gap-4">
                        <div className="w-14 h-20 rounded-lg bg-gradient-to-br from-[#27ae60]/20 to-emerald-600/10 border border-emerald-200 flex items-center justify-center shrink-0">
                            <BookOpen className="w-6 h-6 text-[#27ae60]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-snug">{book.title}</h2>
                            <p className="text-sm text-gray-500 mt-1">{book.author}</p>
                            <div className="mt-2"><StarRating rating={book.rating} size="md" /></div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-5">
                    {book.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">{book.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: User,         label: L.author,    value: book.author },
                            { icon: Hash,         label: L.isbn,      value: book.isbn },
                            { icon: CalendarDays, label: L.year,      value: String(book.year) },
                            { icon: Layers,       label: L.pages,     value: book.pages ? `${book.pages} ${L.pagesUnit}` : '—' },
                            { icon: BookOpen,     label: L.publisher, value: book.publisher || '—' },
                            { icon: Filter,       label: L.category,  value: book.category },
                        ].map(({ icon: IIcon, label, value }) => value && value !== '—' ? (
                            <div key={label} className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                                <IIcon className="w-4 h-4 text-[#27ae60] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[11px] text-gray-400">{label}</p>
                                    <p className="text-sm font-medium text-gray-800">{value}</p>
                                </div>
                            </div>
                        ) : null)}
                    </div>

                    {book.has_file ? (
                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={() => { window.location.href = `/library/books/${book.id}/reader`; }}
                                className="flex-1 flex items-center justify-center gap-2 bg-[#27ae60] hover:bg-[#219a52] text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
                            >
                                <BookText className="w-4 h-4" />
                                {L.readOnline}
                            </button>
                            <button
                                onClick={() => { window.location.href = `/library/books/${book.id}/download`; }}
                                className="flex-1 flex items-center justify-center gap-2 border border-[#27ae60] text-[#27ae60] hover:bg-emerald-50 rounded-xl py-2.5 text-sm font-medium transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                {L.download} {book.file_type?.toUpperCase()}
                            </button>
                        </div>
                    ) : (
                        <p className="text-center text-sm text-gray-400 py-2">{L.noFile}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function LibraryIndex({ books, categories }: PageProps) {
    const { i18n } = useTranslation();
    const locale = getLocale(i18n.language);

    const L = {
        all:              { da: 'همه',                                            en: 'All',                                     ar: 'الكل',                             tg: 'Ҳама' }[locale],
        searchPlaceholder:{ da: 'جستجو بر اساس عنوان، نویسنده یا شابک...',       en: 'Search by title, author or ISBN...',      ar: 'ابحث بالعنوان أو المؤلف أو ISBN...',tg: 'Ҷустуҷӯ аз рӯи унвон, муаллиф ё ISBN...' }[locale],
        titleCol:         { da: 'عنوان کتاب',                                     en: 'Book Title',                              ar: 'عنوان الكتاب',                     tg: 'Унвони китоб' }[locale],
        authorCol:        { da: 'نویسنده',                                        en: 'Author',                                  ar: 'المؤلف',                           tg: 'Муаллиф' }[locale],
        categoryCol:      { da: 'دسته‌بندی',                                      en: 'Category',                                ar: 'الفئة',                            tg: 'Категория' }[locale],
        yearCol:          { da: 'سال',                                            en: 'Year',                                    ar: 'السنة',                            tg: 'Сол' }[locale],
        ratingCol:        { da: 'امتیاز',                                         en: 'Rating',                                  ar: 'التقييم',                          tg: 'Баҳо' }[locale],
        accessCol:        { da: 'دسترسی',                                         en: 'Access',                                  ar: 'الوصول',                           tg: 'Дастрасӣ' }[locale],
        noBooks:          { da: 'هیچ کتابی یافت نشد',                            en: 'No books found',                          ar: 'لم يُعثر على كتب',                  tg: 'Китобе ёфт нашуд' }[locale],
        read:             { da: 'مطالعه',                                         en: 'Read',                                    ar: 'قراءة',                            tg: 'Хондан' }[locale],
        download:         { da: 'دانلود',                                         en: 'Download',                                ar: 'تحميل',                            tg: 'Зеркашӣ' }[locale],
        totalTitles:      { da: 'کل عناوین',                                      en: 'Total Titles',                            ar: 'مجموع العناوين',                   tg: 'Ҳамаи унвонҳо' }[locale],
        downloadable:     { da: 'قابل دانلود',                                    en: 'Downloadable',                            ar: 'قابل للتحميل',                     tg: 'Зеркашишаванда' }[locale],
        pageTitle:        { da: 'کتابخانه',                                       en: 'Library',                                 ar: 'المكتبة',                          tg: 'Китобхона' }[locale],
        home:             { da: 'خانه',                                           en: 'Home',                                    ar: 'الرئيسية',                         tg: 'Хона' }[locale],
        showing: (n: number, t: number) =>
            locale === 'en' ? `Showing ${n} of ${t} titles`
            : locale === 'ar' ? `عرض ${n} من ${t} عنوان`
            : locale === 'tg' ? `Намоиши ${n} аз ${t} унвон`
            : `نمایش ${n} از ${t} عنوان`,
    };

    const [search, setSearch] = useState('');
    const [categorySlug, setCategorySlug] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('category') ?? 'all';
        }
        return 'all';
    });
    const [selected, setSelected] = useState<Book | null>(null);

    const allCategories = [{ slug: 'all', name: L.all }, ...categories];

    const filtered = books.filter((book) => {
        const matchSearch =
            book.title.includes(search) ||
            book.author.includes(search) ||
            (book.isbn ?? '').includes(search);
        const matchCategory = categorySlug === 'all' || book.categorySlug === categorySlug;
        return matchSearch && matchCategory;
    });

    const withFile = books.filter((b) => b.has_file).length;

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
                    { label: L.pageTitle },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-4 py-8 flex flex-col gap-6">

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 max-w-sm">
                    {[
                        { label: L.totalTitles,  value: books.length, icon: BookOpen,   bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
                        { label: L.downloadable, value: withFile,     icon: BookMarked, bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200' },
                    ].map(({ label, value, icon: Icon, bg, text, border }) => (
                        <div key={label} className={`rounded-xl border ${border} bg-white p-4 flex items-center gap-3`}>
                            <div className={`w-10 h-10 rounded-lg ${bg} ${text} flex items-center justify-center shrink-0`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-800">{value}</p>
                                <p className="text-xs text-gray-500">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

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
                </div>

                {/* Books table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="text-start text-xs font-semibold text-gray-500 px-4 py-3 w-8">#</th>
                                    <th className="text-start text-xs font-semibold text-gray-500 px-4 py-3">{L.titleCol}</th>
                                    <th className="text-start text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">{L.authorCol}</th>
                                    <th className="text-start text-xs font-semibold text-gray-500 px-4 py-3 hidden lg:table-cell">{L.categoryCol}</th>
                                    <th className="text-start text-xs font-semibold text-gray-500 px-4 py-3 hidden lg:table-cell">{L.yearCol}</th>
                                    <th className="text-start text-xs font-semibold text-gray-500 px-4 py-3 hidden xl:table-cell">{L.ratingCol}</th>
                                    <th className="text-start text-xs font-semibold text-gray-500 px-4 py-3">{L.accessCol}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-16 text-gray-400">
                                            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                            <p className="text-sm">{L.noBooks}</p>
                                        </td>
                                    </tr>
                                ) : filtered.map((book, idx) => (
                                    <tr
                                        key={book.id}
                                        className="border-b border-gray-100 last:border-0 hover:bg-emerald-50/40 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelected(book)}
                                                className="flex items-center gap-3 text-start w-full"
                                            >
                                                <div className="w-8 h-10 rounded bg-gradient-to-br from-[#27ae60]/20 to-emerald-600/10 border border-emerald-200 flex items-center justify-center shrink-0">
                                                    <BookOpen className="w-3.5 h-3.5 text-[#27ae60]" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 hover:text-[#27ae60] transition-colors">{book.title}</p>
                                                    <p className="text-xs text-gray-400 md:hidden">{book.author}</p>
                                                </div>
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{book.author}</td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                                {book.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{book.year}</td>
                                        <td className="px-4 py-3 hidden xl:table-cell">
                                            <StarRating rating={book.rating} />
                                        </td>
                                        <td className="px-4 py-3">
                                            {book.has_file ? (
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); window.open(`/library/books/${book.id}/read`, '_blank'); }}
                                                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium bg-[#27ae60] text-white hover:bg-[#219a52] transition-colors"
                                                    >
                                                        <BookText className="w-3 h-3" />
                                                        {L.read}
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); window.location.href = `/library/books/${book.id}/download`; }}
                                                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium border border-[#27ae60] text-[#27ae60] hover:bg-emerald-50 transition-colors"
                                                    >
                                                        <Download className="w-3 h-3" />
                                                        {L.download}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filtered.length > 0 && (
                        <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between bg-gray-50/50">
                            <p className="text-xs text-gray-400">
                                {L.showing(filtered.length, books.length)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <HomeFooter />

            {selected && <BookDetailModal book={selected} onClose={() => setSelected(null)} locale={locale} />}
        </div>
    );
}
