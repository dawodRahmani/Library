import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { TopBar }     from '@/components/home/top-bar';
import { MainNav }    from '@/components/home/main-nav';
import { NewsTicker } from '@/components/home/news-ticker';
import { PageHeader } from '@/components/home/page-header';
import { HomeFooter } from '@/components/home/home-footer';
import { BookOpen, Search, Star, Clock, CheckCircle2, BookMarked, X, Hash, User, CalendarDays, Layers, Filter } from 'lucide-react';

type BookStatus = 'available' | 'borrowed' | 'reserved';

interface Book {
    id: number;
    title: string;
    author: string;
    category: string;
    year: number;
    isbn: string;
    status: BookStatus;
    copies: number;
    available: number;
    rating: number;
    description: string;
    pages: number;
    publisher: string;
}

const MOCK_BOOKS: Book[] = [
    { id: 1,  title: 'صحیح البخاری',                    author: 'امام محمد بن اسماعیل البخاری', category: 'حدیث',      year: 846,  isbn: '978-964-101-001-1', status: 'available', copies: 5, available: 3, rating: 5, pages: 1200, publisher: 'دار الفکر',          description: 'صحیح البخاری معتبرترین مجموعه احادیث نبوی پس از قرآن کریم است. امام بخاری بیش از ۶۰۰ هزار حدیث را بررسی کرد و ۷۳۹۷ حدیث صحیح را در این مجموعه گردآوری نمود.' },
    { id: 2,  title: 'صحیح مسلم',                       author: 'امام مسلم بن الحجاج',         category: 'حدیث',      year: 875,  isbn: '978-964-101-002-8', status: 'available', copies: 4, available: 2, rating: 5, pages: 1050, publisher: 'دار الفکر',          description: 'صحیح مسلم دومین کتاب معتبر حدیثی در نزد اهل سنت است. امام مسلم این کتاب را در ۵۴ سال عمر خود تألیف کرد و شامل ۷۴۷۰ حدیث صحیح می‌باشد.' },
    { id: 3,  title: 'تفسیر ابن کثیر',                  author: 'ابوالفداء اسماعیل ابن کثیر',  category: 'تفسیر',     year: 1370, isbn: '978-964-101-003-5', status: 'borrowed',  copies: 3, available: 0, rating: 5, pages: 1800, publisher: 'دار الکتب العلمیه', description: 'تفسیر ابن کثیر یکی از مهم‌ترین تفاسیر قرآن کریم به روش تفسیر قرآن به قرآن و حدیث است. این کتاب در چهار جلد نوشته شده و مرجع اصلی علمای اهل سنت به شمار می‌رود.' },
    { id: 4,  title: 'ریاض الصالحین',                   author: 'امام محیی الدین النووی',      category: 'اخلاق',     year: 1277, isbn: '978-964-101-004-2', status: 'available', copies: 6, available: 4, rating: 5, pages: 560,  publisher: 'مکتبه المعارف',      description: 'ریاض الصالحین مجموعه‌ای از احادیث نبوی در موضوعات اخلاقی و عبادی است. این کتاب یکی از پرخواننده‌ترین کتب اسلامی در سراسر جهان محسوب می‌شود.' },
    { id: 5,  title: 'فتح الباری شرح صحیح البخاری',     author: 'ابن حجر العسقلانی',           category: 'حدیث',      year: 1430, isbn: '978-964-101-005-9', status: 'available', copies: 2, available: 2, rating: 5, pages: 3500, publisher: 'دار المعرفه',        description: 'فتح الباری بزرگترین و معتبرترین شرح صحیح البخاری است. این اثر علمی عظیم توسط حافظ ابن حجر عسقلانی در ۱۳ جلد نوشته شده و مرجع اول محدثان است.' },
    { id: 6,  title: 'العقیدة الواسطیه',                author: 'شیخ الاسلام ابن تیمیه',       category: 'عقیده',     year: 1300, isbn: '978-964-101-006-6', status: 'reserved',  copies: 3, available: 1, rating: 5, pages: 120,  publisher: 'مکتبه السنه',        description: 'العقیدة الواسطیه رساله‌ای کوتاه اما بسیار مهم در بیان عقیده اهل سنت و الجماعت است که توسط شیخ الاسلام ابن تیمیه نوشته شده.' },
    { id: 7,  title: 'زاد المعاد',                      author: 'ابن قیم الجوزیه',             category: 'سیره',      year: 1350, isbn: '978-964-101-007-3', status: 'available', copies: 3, available: 2, rating: 5, pages: 800,  publisher: 'مؤسسه الرساله',      description: 'زاد المعاد کتابی جامع در سیره نبوی، احکام عبادات، و طب نبوی است. این اثر چندوجهی ابن قیم در پنج جلد نوشته شده و بینشی عمیق از زندگی پیامبر اکرم ارائه می‌دهد.' },
    { id: 8,  title: 'الرحیق المختوم',                  author: 'صفی الرحمن المبارکفوری',      category: 'سیره',      year: 1976, isbn: '978-964-101-008-0', status: 'available', copies: 4, available: 3, rating: 5, pages: 480,  publisher: 'دار الوفاء',         description: 'الرحیق المختوم برنده جایزه اول مسابقه بین‌المللی سیره نبوی رابطه جهان اسلام بود. این کتاب کامل‌ترین و خواندنی‌ترین زندگینامه پیامبر اکرم به شمار می‌رود.' },
    { id: 9,  title: 'مختصر صحیح البخاری',              author: 'محمد فؤاد عبدالباقی',         category: 'حدیث',      year: 1950, isbn: '978-964-101-009-7', status: 'borrowed',  copies: 5, available: 0, rating: 4, pages: 680,  publisher: 'دار الفکر',          description: 'مختصر صحیح البخاری خلاصه‌ای از صحیح البخاری است که احادیث مکرر حذف شده و فقط ۲۲۳۰ حدیث منحصربه‌فرد باقی مانده است.' },
    { id: 10, title: 'الأذکار',                         author: 'امام محیی الدین النووی',      category: 'اخلاق',     year: 1280, isbn: '978-964-101-010-3', status: 'available', copies: 4, available: 3, rating: 4, pages: 340,  publisher: 'دار المنهاج',        description: 'الاذکار مجموعه‌ای جامع از دعاها و اذکار اسلامی از قرآن و سنت است که امام نووی آن را تألیف کرده. این کتاب راهنمای عملی برای ذکر خدا در همه حالات است.' },
    { id: 11, title: 'تفسیر الجلالین',                  author: 'جلال الدین المحلی و السیوطی', category: 'تفسیر',     year: 1505, isbn: '978-964-101-011-0', status: 'available', copies: 3, available: 2, rating: 4, pages: 560,  publisher: 'دار الفکر',          description: 'تفسیر الجلالین یکی از مشهورترین تفاسیر مختصر قرآن کریم است که توسط دو عالم بزرگ به نام جلال‌الدین نوشته شده. این کتاب در یک جلد کل قرآن را تفسیر می‌کند.' },
    { id: 12, title: 'شرح ثلاثة الأصول',               author: 'شیخ محمد بن صالح العثیمین',  category: 'عقیده',     year: 1990, isbn: '978-964-101-012-7', status: 'available', copies: 5, available: 5, rating: 5, pages: 180,  publisher: 'مکتبه الاسلامیه',    description: 'شرح ثلاثة الأصول توضیح رساله معروف شیخ محمد بن عبدالوهاب است. این کتاب پایه‌های عقیده اسلامی (معرفت خدا، دین و پیامبر) را به زبانی ساده بیان می‌کند.' },
    { id: 13, title: 'بلوغ المرام',                     author: 'ابن حجر العسقلانی',           category: 'فقه',       year: 1400, isbn: '978-964-101-013-4', status: 'borrowed',  copies: 4, available: 0, rating: 4, pages: 420,  publisher: 'دار القبله',         description: 'بلوغ المرام مجموعه احادیث فقهی است که ابن حجر عسقلانی از کتب صحیح گردآوری کرده. این کتاب مرجع اصلی علمای فقه در استنباط احکام شرعی است.' },
    { id: 14, title: 'الأربعون النوویه',                author: 'امام محیی الدین النووی',      category: 'حدیث',      year: 1275, isbn: '978-964-101-014-1', status: 'available', copies: 8, available: 6, rating: 5, pages: 80,   publisher: 'دار السلام',          description: 'اربعین نووی مجموعه ۴۲ حدیث مهم و جامع نبوی است که هر مسلمانی باید بداند. این کتاب کوچک یکی از پرتیراژترین کتب اسلامی در جهان است.' },
    { id: 15, title: 'الحلال والحرام في الإسلام',       author: 'دکتر یوسف القرضاوی',         category: 'فقه',       year: 1960, isbn: '978-964-101-015-8', status: 'reserved',  copies: 3, available: 1, rating: 4, pages: 360,  publisher: 'مکتبه وهبه',         description: 'حلال و حرام در اسلام کتابی جامع در فقه معاصر است که دکتر قرضاوی در آن احکام روزمره زندگی مسلمانان را از منابع اصیل اسلامی بیان کرده است.' },
];

const CATEGORIES = ['همه', 'حدیث', 'تفسیر', 'فقه', 'عقیده', 'سیره', 'اخلاق'];

const STATUS_CONFIG: Record<BookStatus, { label: string; icon: React.ElementType; className: string }> = {
    available: { label: 'موجود',          icon: CheckCircle2, className: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
    borrowed:  { label: 'امانت داده شده', icon: Clock,        className: 'bg-amber-100 text-amber-700 border border-amber-200' },
    reserved:  { label: 'رزرو شده',       icon: BookMarked,   className: 'bg-blue-100 text-blue-700 border border-blue-200' },
};

function StatusBadge({ status }: { status: BookStatus }) {
    const { label, icon: Icon, className } = STATUS_CONFIG[status];
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
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
    const { label, icon: Icon, className } = STATUS_CONFIG[book.status];
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
                    <p className="text-sm text-gray-600 leading-relaxed">{book.description}</p>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: User,         label: 'نویسنده',      value: book.author },
                            { icon: Hash,         label: 'شابک',         value: book.isbn },
                            { icon: CalendarDays, label: 'سال انتشار',   value: String(book.year) },
                            { icon: Layers,       label: 'تعداد صفحات', value: `${book.pages} صفحه` },
                            { icon: BookOpen,     label: 'ناشر',         value: book.publisher },
                            { icon: Filter,       label: 'دسته‌بندی',    value: book.category },
                        ].map(({ icon: IIcon, label, value }) => (
                            <div key={label} className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                                <IIcon className="w-4 h-4 text-[#27ae60] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[11px] text-gray-400">{label}</p>
                                    <p className="text-sm font-medium text-gray-800">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">موجودی نسخه‌ها</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {book.available}
                                <span className="text-base font-normal text-gray-400">/{book.copies}</span>
                            </p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${className}`}>
                            <Icon className="w-4 h-4" />
                            {label}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LibraryIndex() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('همه');
    const [statusFilter, setStatusFilter] = useState('همه');
    const [selected, setSelected] = useState<Book | null>(null);

    const filtered = MOCK_BOOKS.filter((book) => {
        const matchSearch =
            book.title.includes(search) ||
            book.author.includes(search) ||
            book.isbn.includes(search);
        const matchCategory = category === 'همه' || book.category === category;
        const matchStatus =
            statusFilter === 'همه' ||
            (statusFilter === 'available' && book.status === 'available') ||
            (statusFilter === 'borrowed'  && book.status === 'borrowed')  ||
            (statusFilter === 'reserved'  && book.status === 'reserved');
        return matchSearch && matchCategory && matchStatus;
    });

    const totalBooks  = MOCK_BOOKS.reduce((s, b) => s + b.copies, 0);
    const available   = MOCK_BOOKS.reduce((s, b) => s + b.available, 0);
    const borrowed    = MOCK_BOOKS.filter((b) => b.status === 'borrowed').length;

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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'کل عناوین',      value: MOCK_BOOKS.length, icon: BookOpen,    bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
                        { label: 'کل نسخه‌ها',     value: totalBooks,        icon: BookMarked,  bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200' },
                        { label: 'موجود',           value: available,         icon: CheckCircle2,bg: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-200' },
                        { label: 'امانت داده شده',  value: borrowed,          icon: Clock,       bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200' },
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
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#27ae60] transition-colors sm:w-44"
                    >
                        <option value="همه">همه وضعیت‌ها</option>
                        <option value="available">موجود</option>
                        <option value="borrowed">امانت داده شده</option>
                        <option value="reserved">رزرو شده</option>
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
                                    <th className="text-start text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">نسخه‌ها</th>
                                    <th className="text-start text-xs font-semibold text-gray-500 px-4 py-3">وضعیت</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-16 text-gray-400">
                                            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                            <p className="text-sm">هیچ کتابی یافت نشد</p>
                                        </td>
                                    </tr>
                                ) : filtered.map((book, idx) => (
                                    <tr
                                        key={book.id}
                                        onClick={() => setSelected(book)}
                                        className="border-b border-gray-100 last:border-0 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-10 rounded bg-gradient-to-br from-[#27ae60]/20 to-emerald-600/10 border border-emerald-200 flex items-center justify-center shrink-0">
                                                    <BookOpen className="w-3.5 h-3.5 text-[#27ae60]" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{book.title}</p>
                                                    <p className="text-xs text-gray-400 md:hidden">{book.author}</p>
                                                </div>
                                            </div>
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
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <span className="font-medium text-gray-800">{book.available}</span>
                                            <span className="text-gray-400">/{book.copies}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={book.status} />
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
                                <span className="font-medium text-gray-700">{MOCK_BOOKS.length}</span> عنوان
                            </p>
                            <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-2.5 py-0.5">داده‌های آزمایشی</span>
                        </div>
                    )}
                </div>
            </div>

            <HomeFooter />

            {selected && <BookDetailModal book={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}
