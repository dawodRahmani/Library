import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { TopBar }     from '@/components/home/top-bar';
import { MainNav }    from '@/components/home/main-nav';
import { NewsTicker } from '@/components/home/news-ticker';
import { PageHeader } from '@/components/home/page-header';
import { HomeFooter } from '@/components/home/home-footer';
import { BookOpen, Search, Star, X, Hash, User, CalendarDays, Layers, Filter, Download, BookText, BookMarked } from 'lucide-react';

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

function BookDetailModal({ book, onClose }: { book: Book; onClose: () => void }) {
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
                            { icon: User,         label: 'نویسنده',      value: book.author },
                            { icon: Hash,         label: 'شابک',         value: book.isbn },
                            { icon: CalendarDays, label: 'سال انتشار',   value: String(book.year) },
                            { icon: Layers,       label: 'تعداد صفحات', value: book.pages ? `${book.pages} صفحه` : '—' },
                            { icon: BookOpen,     label: 'ناشر',         value: book.publisher || '—' },
                            { icon: Filter,       label: 'دسته‌بندی',    value: book.category },
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
                                onClick={() => window.open(`/library/books/${book.id}/read`, '_blank')}
                                className="flex-1 flex items-center justify-center gap-2 bg-[#27ae60] hover:bg-[#219a52] text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
                            >
                                <BookText className="w-4 h-4" />
                                مطالعه آنلاین
                            </button>
                            <button
                                onClick={() => { window.location.href = `/library/books/${book.id}/download`; }}
                                className="flex-1 flex items-center justify-center gap-2 border border-[#27ae60] text-[#27ae60] hover:bg-emerald-50 rounded-xl py-2.5 text-sm font-medium transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                دانلود {book.file_type?.toUpperCase()}
                            </button>
                        </div>
                    ) : (
                        <p className="text-center text-sm text-gray-400 py-2">فایل دیجیتال موجود نیست</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function LibraryIndex({ books, categories }: PageProps) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const slug = params.get('category');
            if (slug) {
                const mapping = categories.reduce((acc, cat) => {
                    acc[cat.slug] = cat.name;
                    return acc;
                }, {} as Record<string, string>);
                if (mapping[slug]) return mapping[slug];
            }
        }
        return 'همه';
    });
    const [selected, setSelected] = useState<Book | null>(null);

    const allCategories = [{ slug: 'all', name: 'همه' }, ...categories];

    const filtered = books.filter((book) => {
        const matchSearch =
            book.title.includes(search) ||
            book.author.includes(search) ||
            (book.isbn ?? '').includes(search);
        const matchCategory = category === 'همه' || book.category === category;
        return matchSearch && matchCategory;
    });

    const withFile = books.filter((b) => b.has_file).length;

    return (
        <div dir="rtl" className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title="کتابخانه — کتابخانه رسالت" />
            <TopBar />
            <MainNav />
            <NewsTicker />

            <PageHeader
                title="کتابخانه"
                breadcrumbs={[
                    { label: 'خانه', href: '/' },
                    { label: 'کتابخانه' },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-4 py-8 flex flex-col gap-6">

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 max-w-sm">
                    {[
                        { label: 'کل عناوین',    value: books.length, icon: BookOpen,   bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
                        { label: 'قابل دانلود',  value: withFile,     icon: BookMarked, bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200' },
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
                            placeholder="جستجو بر اساس عنوان، نویسنده یا شابک..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg ps-9 pe-4 py-2 text-sm focus:outline-none focus:border-[#27ae60] transition-colors"
                        />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#27ae60] transition-colors sm:w-44"
                    >
                        {allCategories.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                    </select>
                </div>

                {/* Books table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="text-start text-xs font-semibold text-gray-500 px-4 py-3 w-8">#</th>
                                    <th className="text-start text-xs font-semibold text-gray-500 px-4 py-3">عنوان کتاب</th>
                                    <th className="text-start text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">نویسنده</th>
                                    <th className="text-start text-xs font-semibold text-gray-500 px-4 py-3 hidden lg:table-cell">دسته‌بندی</th>
                                    <th className="text-start text-xs font-semibold text-gray-500 px-4 py-3 hidden lg:table-cell">سال</th>
                                    <th className="text-start text-xs font-semibold text-gray-500 px-4 py-3 hidden xl:table-cell">امتیاز</th>
                                    <th className="text-start text-xs font-semibold text-gray-500 px-4 py-3">دسترسی</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-16 text-gray-400">
                                            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                            <p className="text-sm">هیچ کتابی یافت نشد</p>
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
                                                        مطالعه
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); window.location.href = `/library/books/${book.id}/download`; }}
                                                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium border border-[#27ae60] text-[#27ae60] hover:bg-emerald-50 transition-colors"
                                                    >
                                                        <Download className="w-3 h-3" />
                                                        دانلود
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
                                نمایش <span className="font-medium text-gray-700">{filtered.length}</span> از{' '}
                                <span className="font-medium text-gray-700">{books.length}</span> عنوان
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <HomeFooter />

            {selected && <BookDetailModal book={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}
