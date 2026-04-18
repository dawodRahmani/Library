import { Head, usePage } from '@inertiajs/react';
import {
    BookOpen, FileText, Headphones, Users, PlayCircle,
    BookMarked, Library, MessageSquare, Newspaper, Plus, ArrowLeft,
    TrendingUp, Clock, Settings, Database, Image as ImageIcon, Video as VideoIcon, Download,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface AuthUser {
    id: number;
    name: string;
    email: string;
}

interface Stats {
    books: number;
    articles: number;
    audios: number;
    videos: number;
    fatwas: number;
    magazines: number;
    users: number;
    categories: number;
}

interface RecentItem {
    type: 'book' | 'article' | 'video' | 'audio' | 'fatwa';
    title: string;
    date: string;
    href: string;
}

interface PageProps {
    auth: { user: AuthUser };
    stats: Stats;
    recentActivity: RecentItem[];
    [key: string]: unknown;
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    book:    { label: 'کتاب',    icon: BookOpen,       color: 'text-emerald-600', bg: 'bg-emerald-100' },
    article: { label: 'مقاله',   icon: FileText,       color: 'text-blue-600',    bg: 'bg-blue-100' },
    video:   { label: 'ویدیو',   icon: PlayCircle,     color: 'text-rose-600',    bg: 'bg-rose-100' },
    audio:   { label: 'صوت',     icon: Headphones,     color: 'text-violet-600',  bg: 'bg-violet-100' },
    fatwa:   { label: 'فتوا',    icon: MessageSquare,  color: 'text-amber-600',   bg: 'bg-amber-100' },
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
];

function StatCard({
    label, value, icon: Icon, bg, text, border, href,
}: {
    label: string;
    value: number;
    icon: React.ElementType;
    bg: string;
    text: string;
    border: string;
    href: string;
}) {
    return (
        <a
            href={href}
            className={`rounded-xl border ${border} bg-white p-4 flex flex-col gap-3 hover:shadow-md transition-shadow group`}
        >
            <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg ${bg} ${text} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                </div>
                <ArrowLeft className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-800">{value.toLocaleString('fa-AF')}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
            </div>
        </a>
    );
}

export default function Dashboard() {
    const { auth, stats, recentActivity } = usePage<PageProps>().props;
    const user = auth.user;

    const statCards = [

        { label: 'کتاب‌های ثبت‌شده', value: stats.books,      icon: BookOpen,      bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', href: '/admin/books' },
        { label: 'مقاله‌ها',          value: stats.articles,   icon: FileText,      bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200',    href: '/admin/articles' },
        { label: 'فایل‌های صوتی',    value: stats.audios,     icon: Headphones,    bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-200',  href: '/admin/audios' },
        { label: 'ویدیوها',           value: stats.videos,     icon: PlayCircle,    bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-200',    href: '/admin/videos' },
        { label: 'فتاوی',             value: stats.fatwas,     icon: MessageSquare, bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200',   href: '/admin/fatwas' },
        { label: 'مجلات',             value: stats.magazines,  icon: Newspaper,     bg: 'bg-pink-50',    text: 'text-pink-600',    border: 'border-pink-200',    href: '/admin/magazines' },
        { label: 'اعضا',              value: stats.users,      icon: Users,         bg: 'bg-cyan-50',    text: 'text-cyan-600',    border: 'border-cyan-200',    href: '/users' },
        { label: 'دسته‌بندی‌ها',     value: stats.categories, icon: BookMarked,    bg: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-200',    href: '/admin/categories' },
    ];

    const quickActions = [
        { label: 'افزودن کتاب',   icon: BookOpen,      color: 'bg-emerald-600 hover:bg-emerald-700', href: '/admin/books' },
        { label: 'افزودن مقاله',  icon: FileText,      color: 'bg-blue-600    hover:bg-blue-700',    href: '/admin/articles' },
        { label: 'افزودن صوت',    icon: Headphones,    color: 'bg-violet-600  hover:bg-violet-700',  href: '/admin/audios' },
        { label: 'افزودن ویدیو',  icon: PlayCircle,    color: 'bg-rose-600    hover:bg-rose-700',    href: '/admin/videos' },
        { label: 'افزودن فتوا',   icon: MessageSquare, color: 'bg-amber-600   hover:bg-amber-700',   href: '/admin/fatwas' },
        { label: 'افزودن مجله',   icon: Newspaper,     color: 'bg-pink-600    hover:bg-pink-700',    href: '/admin/magazines' },
    ];

    const totalContent = stats.books + stats.articles + stats.audios + stats.videos + stats.fatwas + stats.magazines;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="داشبورد — کتابخانه رسالت" />

            <div className="flex flex-col gap-6 p-6">

                {/* Welcome banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a252f] to-[#0d3320] p-6 text-white">
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #27ae60 1px, transparent 1px)',
                            backgroundSize: '28px 28px',
                        }}
                    />
                    <div className="absolute -end-8 -top-8 w-40 h-40 rounded-full bg-[#27ae60]/20 blur-3xl" />
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#27ae60]/20 border border-[#27ae60]/40 flex items-center justify-center shrink-0">
                                <Library className="w-6 h-6 text-[#27ae60]" />
                            </div>
                            <div>
                                <h1 className="text-[18px] font-bold">
                                    خوش آمدید، {user.name}
                                </h1>
                                <p className="text-white/60 text-[13px] mt-0.5">
                                    پنل مدیریت کتابخانه رسالت — سیستم مدیریت کتابخانه دیجیتال
                                </p>
                            </div>
                        </div>
                        {/* Total content pill */}
                        <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 shrink-0">
                            <TrendingUp className="w-4 h-4 text-[#27ae60]" />
                            <div>
                                <p className="text-[11px] text-white/50">مجموع محتوا</p>
                                <p className="text-[18px] font-bold leading-none">{totalContent.toLocaleString('fa-AF')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#27ae60] via-teal-400 to-emerald-300" />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
                    {statCards.map((card) => (
                        <StatCard key={card.label} {...card} />
                    ))}
                </div>

                {/* Quick actions + Recent activity side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Quick actions */}
                    <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5">
                        <h2 className="text-[13px] font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-[#27ae60] rounded-full inline-block" />
                            دسترسی سریع
                        </h2>
                        <div className="grid grid-cols-2 gap-2.5">
                            {quickActions.map(({ label, icon: Icon, color, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    className={`${color} text-white rounded-lg px-3 py-2.5 flex items-center gap-2 text-[12px] font-medium transition-colors`}
                                >
                                    <Plus className="w-3.5 h-3.5 shrink-0" />
                                    {label}
                                </a>
                            ))}
                        </div>

                        {/* Management links */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-1.5">
                            {[
                                { label: 'مدیریت دسته‌بندی‌ها', href: '/admin/categories', icon: BookMarked },
                                { label: 'مدیریت کاربران',       href: '/users',            icon: Users },
                                { label: 'تنظیمات پروفایل',     href: '/settings/profile', icon: Settings },
                            ].map(({ label, href, icon: Icon }) => (
                                <a
                                    key={href}
                                    href={href}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] text-gray-600 hover:bg-gray-50 hover:text-[#27ae60] transition-colors"
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Recent activity */}
                    <div className="lg:col-span-3 rounded-xl border border-gray-200 bg-white p-5">
                        <h2 className="text-[13px] font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-[#27ae60] rounded-full inline-block" />
                            آخرین محتوای اضافه‌شده
                        </h2>

                        {recentActivity.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <Clock className="w-8 h-8 opacity-30 mb-2" />
                                <p className="text-[12px]">هنوز محتوایی اضافه نشده</p>
                            </div>
                        ) : (
                            <ul className="flex flex-col gap-1">
                                {recentActivity.map((item, idx) => {
                                    const cfg = TYPE_CONFIG[item.type];
                                    const Icon = cfg?.icon ?? BookOpen;
                                    return (
                                        <li key={idx}>
                                            <a
                                                href={item.href}
                                                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                                            >
                                                <div className={`w-7 h-7 rounded-md ${cfg?.bg ?? 'bg-gray-100'} ${cfg?.color ?? 'text-gray-600'} flex items-center justify-center shrink-0`}>
                                                    <Icon className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[13px] text-gray-800 truncate group-hover:text-[#27ae60] transition-colors">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400">
                                                        {cfg?.label} · {item.date}
                                                    </p>
                                                </div>
                                                <ArrowLeft className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#27ae60] shrink-0 transition-colors" />
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Backup / export */}
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <h2 className="text-[13px] font-bold text-gray-800 mb-1 flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#27ae60] rounded-full inline-block" />
                        پشتیبان‌گیری و خروجی
                    </h2>
                    <p className="text-[12px] text-gray-500 mb-4">دانلود فایل پایگاه داده، تمام تصاویر، و تمام ویدیوهای آپلودشده</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <a
                            href="/admin/backup/database"
                            className="flex items-center justify-between gap-3 p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <Database className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-gray-800">پایگاه داده</p>
                                    <p className="text-[11px] text-gray-500">database.sqlite</p>
                                </div>
                            </div>
                            <Download className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                        </a>
                        <a
                            href="/admin/backup/images"
                            className="flex items-center justify-between gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-gray-800">تصاویر</p>
                                    <p className="text-[11px] text-gray-500">همه تصاویر (ZIP)</p>
                                </div>
                            </div>
                            <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </a>
                        <a
                            href="/admin/backup/videos"
                            className="flex items-center justify-between gap-3 p-4 rounded-xl border border-gray-200 hover:border-rose-500 hover:bg-rose-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                                    <VideoIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-gray-800">ویدیوها</p>
                                    <p className="text-[11px] text-gray-500">همه ویدیوها (ZIP)</p>
                                </div>
                            </div>
                            <Download className="w-4 h-4 text-gray-400 group-hover:text-rose-600 transition-colors" />
                        </a>
                    </div>
                </div>

                {/* Content overview bar */}
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <h2 className="text-[13px] font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#27ae60] rounded-full inline-block" />
                        نمای کلی محتوا
                    </h2>
                    <div className="flex flex-col gap-3">
                        {[
                            { label: 'کتاب‌ها',    value: stats.books,     total: totalContent, color: 'bg-emerald-500' },
                            { label: 'مقاله‌ها',   value: stats.articles,  total: totalContent, color: 'bg-blue-500' },
                            { label: 'صوتی‌ها',    value: stats.audios,    total: totalContent, color: 'bg-violet-500' },
                            { label: 'ویدیوها',    value: stats.videos,    total: totalContent, color: 'bg-rose-500' },
                            { label: 'فتاوی',      value: stats.fatwas,    total: totalContent, color: 'bg-amber-500' },
                            { label: 'مجلات',      value: stats.magazines, total: totalContent, color: 'bg-pink-500' },
                        ].map(({ label, value, total, color }) => {
                            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                            return (
                                <div key={label} className="flex items-center gap-3">
                                    <p className="text-[12px] text-gray-500 w-20 text-end shrink-0">{label}</p>
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${color} rounded-full transition-all`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <p className="text-[12px] font-medium text-gray-700 w-16 shrink-0">
                                        {value.toLocaleString('fa-AF')} <span className="text-gray-400">({pct}٪)</span>
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
