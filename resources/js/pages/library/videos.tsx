import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { TopBar }     from '@/components/home/top-bar';
import { MainNav }    from '@/components/home/main-nav';
import { NewsTicker } from '@/components/home/news-ticker';
import { PageHeader } from '@/components/home/page-header';
import { HomeFooter } from '@/components/home/home-footer';
import { PlayCircle, Search, Play, Clock, Eye, Filter, MonitorPlay } from 'lucide-react';

type VideoStatus = 'available' | 'restricted' | 'archived';

interface VideoItem {
    id: number;
    title: string;
    instructor: string;
    category: string;
    duration: string;
    views: number;
    year: number;
    status: VideoStatus;
    gradient: string;
    description: string;
}

const CATEGORY_SLUG_MAP: Record<string, string> = {
    aqeedah: 'عقیده و منهج',
    advice: 'پند و موعظه',
    jihad: 'جهاد و استشهاد',
    politics: 'سیاست',
    analysis: 'تحلیل و سخن روز',
    history: 'تاریخ',
};

const MOCK_VIDEOS: VideoItem[] = [
    { id: 1,  title: 'تفسیر سوره فاتحه',                   instructor: 'شیخ عبدالله نوری',   category: 'عقیده و منهج',      duration: '1:12:00', views: 4200, year: 2024, status: 'available',   gradient: 'from-emerald-800 to-teal-700',    description: 'شرح و تفسیر جامع سوره مبارکه فاتحه با استناد به کتب معتبر تفسیری' },
    { id: 2,  title: 'اصول عقیده اهل سنت',                 instructor: 'مفتی احمد رحمانی',   category: 'عقیده و منهج',      duration: '1:45:30', views: 3800, year: 2024, status: 'available',   gradient: 'from-indigo-800 to-blue-700',     description: 'شرح ارکان ایمان و اصول عقیده اهل سنت و الجماعت' },
    { id: 3,  title: 'احکام نماز — فقه حنفی',              instructor: 'مفتی احمد رحمانی',   category: 'پند و موعظه',       duration: '2:10:00', views: 5100, year: 2023, status: 'available',   gradient: 'from-violet-800 to-purple-700',   description: 'شرح احکام نماز از دیدگاه فقه حنفی با دلایل فقهی' },
    { id: 4,  title: 'سیره نبوی — مکه و مدینه',            instructor: 'دکتر محمد حسینی',    category: 'تاریخ',             duration: '2:30:00', views: 6200, year: 2024, status: 'available',   gradient: 'from-amber-800 to-orange-700',    description: 'بررسی زندگی پیامبر اکرم در دوران مکی و مدنی' },
    { id: 5,  title: 'علم حدیث برای مبتدیان',              instructor: 'شیخ عبدالله نوری',   category: 'عقیده و منهج',      duration: '1:55:00', views: 2900, year: 2023, status: 'available',   gradient: 'from-cyan-800 to-teal-700',       description: 'آشنایی با اصول علم حدیث، انواع حدیث و اصطلاحات محدثان' },
    { id: 6,  title: 'شرح اربعین نووی',                    instructor: 'مفتی احمد رحمانی',   category: 'پند و موعظه',       duration: '3:20:00', views: 7800, year: 2024, status: 'available',   gradient: 'from-green-800 to-emerald-700',   description: 'شرح کامل چهل حدیث امام نووی، پایه‌های اسلام' },
    { id: 7,  title: 'آموزش قرائت قرآن — روایت حفص',       instructor: 'قاری محمد امین',     category: 'عقیده و منهج',      duration: '4:00:00', views: 9500, year: 2023, status: 'available',   gradient: 'from-yellow-800 to-amber-700',    description: 'آموزش گام‌به‌گام تلاوت صحیح قرآن کریم با روایت حفص از عاصم' },
    { id: 8,  title: 'تاریخ اسلام در خراسان',              instructor: 'دکتر محمد حسینی',    category: 'تاریخ',             duration: '1:40:00', views: 3400, year: 2023, status: 'available',   gradient: 'from-stone-800 to-zinc-700',      description: 'مروری بر تاریخ ورود و گسترش اسلام در خراسان بزرگ' },
    { id: 9,  title: 'زکات و احکام آن',                    instructor: 'مفتی احمد رحمانی',   category: 'سیاست',             duration: '1:25:00', views: 2600, year: 2024, status: 'available',   gradient: 'from-lime-800 to-green-700',      description: 'احکام فقهی زکات، نصاب، مستحقان و روش محاسبه' },
    { id: 10, title: 'اخلاق اسلامی در زندگی روزمره',       instructor: 'شیخ عبدالله نوری',   category: 'پند و موعظه',       duration: '1:10:00', views: 4700, year: 2024, status: 'available',   gradient: 'from-rose-800 to-pink-700',       description: 'کاربرد ارزش‌های اخلاق اسلامی در تعاملات روزانه' },
    { id: 11, title: 'غزوات پیامبر اکرم',                  instructor: 'دکتر محمد حسینی',    category: 'جهاد و استشهاد',    duration: '2:50:00', views: 3100, year: 2022, status: 'restricted', gradient: 'from-red-800 to-rose-700',        description: 'بررسی غزوات مهم پیامبر و درس‌های آن‌ها' },
    { id: 12, title: 'تفسیر سوره بقره — بخش اول',          instructor: 'شیخ عبدالله نوری',   category: 'عقیده و منهج',      duration: '3:45:00', views: 8200, year: 2023, status: 'available',   gradient: 'from-teal-800 to-cyan-700',       description: 'تفسیر دقیق آیات ابتدایی سوره بقره با نگاه تفسیری' },
    { id: 13, title: 'فلسفه اسلامی و عقل',                 instructor: 'دکتر محمد حسینی',    category: 'تحلیل و سخن روز',   duration: '2:00:00', views: 1800, year: 2022, status: 'archived',   gradient: 'from-slate-800 to-gray-700',      description: 'رابطه فلسفه اسلامی با عقل و وحی در تفکر اسلامی' },
    { id: 14, title: 'آداب دعا و ذکر',                     instructor: 'شیخ عبدالله نوری',   category: 'پند و موعظه',       duration: '0:55:00', views: 5600, year: 2024, status: 'available',   gradient: 'from-blue-800 to-indigo-700',     description: 'آداب دعا، اوقات مستجاب الدعوه و اذکار مأثور' },
    { id: 15, title: 'احکام روزه — رمضان کریم',            instructor: 'مفتی احمد رحمانی',   category: 'جهاد و استشهاد',    duration: '1:30:00', views: 11000, year: 2024, status: 'available',  gradient: 'from-purple-800 to-violet-700',   description: 'احکام فقهی روزه رمضان، مفطرات، کفارات و قضا' },
];

const CATEGORIES = ['همه', 'عقیده و منهج', 'پند و موعظه', 'جهاد و استشهاد', 'سیاست', 'تحلیل و سخن روز', 'تاریخ'];

const STATUS_CONFIG: Record<VideoStatus, { label: string; className: string }> = {
    available:  { label: 'در دسترس', className: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
    restricted: { label: 'محدود',    className: 'bg-amber-100 text-amber-700 border border-amber-200' },
    archived:   { label: 'آرشیو',    className: 'bg-slate-100 text-slate-600 border border-slate-200' },
};

function VideoCard({ video }: { video: VideoItem }) {
    const { label, className } = STATUS_CONFIG[video.status];

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
            {/* Thumbnail */}
            <div className={`relative h-36 bg-gradient-to-br ${video.gradient} flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-white ms-0.5" />
                </div>
                <span className="absolute bottom-2 end-2 bg-black/50 text-white text-[11px] font-mono px-1.5 py-0.5 rounded">
                    {video.duration}
                </span>
                <span className={`absolute top-2 start-2 text-[11px] font-medium px-2 py-0.5 rounded-full ${className}`}>
                    {label}
                </span>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-1.5">
                <h3 className="font-bold text-[14px] text-gray-900 leading-snug line-clamp-2 group-hover:text-[#27ae60] transition-colors">
                    {video.title}
                </h3>
                <p className="text-[12px] text-gray-500 line-clamp-1">{video.description}</p>
                <div className="flex items-center justify-between mt-1">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <MonitorPlay className="w-3.5 h-3.5" />
                        {video.instructor}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Eye className="w-3 h-3" />
                        {video.views.toLocaleString()}
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                        {video.category}
                    </span>
                    <span className="text-[11px] text-gray-400">{video.year}</span>
                </div>
            </div>
        </div>
    );
}

export default function VideosIndex() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('همه');
    const [statusFilter, setStatusFilter] = useState('همه');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('category');
        if (slug && CATEGORY_SLUG_MAP[slug]) {
            setCategory(CATEGORY_SLUG_MAP[slug]);
        }
    }, []);

    const filtered = MOCK_VIDEOS.filter((v) => {
        const matchSearch = v.title.includes(search) || v.instructor.includes(search) || v.category.includes(search);
        const matchCategory = category === 'همه' || v.category === category;
        const matchStatus =
            statusFilter === 'همه' ||
            (statusFilter === 'available'  && v.status === 'available')  ||
            (statusFilter === 'restricted' && v.status === 'restricted') ||
            (statusFilter === 'archived'   && v.status === 'archived');
        return matchSearch && matchCategory && matchStatus;
    });

    const totalViews = MOCK_VIDEOS.reduce((s, v) => s + v.views, 0);
    const available  = MOCK_VIDEOS.filter((v) => v.status === 'available').length;
    const totalMins  = MOCK_VIDEOS.reduce((s, v) => {
        const [h, m] = v.duration.split(':').map(Number);
        return s + h * 60 + m;
    }, 0);

    return (
        <div dir="rtl" className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title="ویدیوها — کتابخانه رسالت" />
            <TopBar />
            <MainNav />
            <NewsTicker />

            <PageHeader
                title="ویدیوها"
                breadcrumbs={[
                    { label: 'خانه', href: '/' },
                    { label: 'کتابخانه', href: '/library' },
                    { label: 'ویدیوها' },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-4 py-8 flex flex-col gap-6">

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'کل ویدیوها',   value: MOCK_VIDEOS.length,              icon: PlayCircle, bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-200' },
                        { label: 'مجموع بازدید', value: totalViews.toLocaleString(),      icon: Eye,        bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200' },
                        { label: 'در دسترس',     value: available,                        icon: Play,       bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
                        { label: 'مجموع مدت',   value: `${Math.floor(totalMins/60)}h ${totalMins%60}m`, icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
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
                            placeholder="جستجو بر اساس عنوان، استاد یا دسته‌بندی..."
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
                        <option value="available">در دسترس</option>
                        <option value="restricted">محدود</option>
                        <option value="archived">آرشیو</option>
                    </select>
                </div>

                {/* Video grid */}
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-12 flex flex-col items-center gap-3 text-gray-400">
                        <Filter className="w-10 h-10 opacity-30" />
                        <p>هیچ ویدیویی یافت نشد</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                )}

                {filtered.length > 0 && (
                    <div className="flex items-center justify-between px-1">
                        <p className="text-xs text-gray-400">
                            نمایش <span className="font-medium text-gray-700">{filtered.length}</span> از{' '}
                            <span className="font-medium text-gray-700">{MOCK_VIDEOS.length}</span> ویدیو
                        </p>
                        <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-2.5 py-0.5">داده‌های آزمایشی</span>
                    </div>
                )}
            </div>

            <HomeFooter />
        </div>
    );
}
