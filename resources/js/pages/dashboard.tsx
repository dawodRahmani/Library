import { Head, router, usePage } from '@inertiajs/react';
import {
    BookOpen, FileText, Headphones, Users, PlayCircle,
    BookMarked, LayoutDashboard, LogOut, Settings, ChevronDown,
    Library, Globe,
} from 'lucide-react';
import { useState } from 'react';

interface AuthUser {
    id: number;
    name: string;
    email: string;
}

interface PageProps {
    auth: { user: AuthUser };
    [key: string]: unknown;
}

const STAT_CARDS = [
    { label: 'کتاب‌های ثبت‌شده', value: '۰', icon: BookOpen,   bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    { label: 'مقاله‌ها',          value: '۰', icon: FileText,   bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200' },
    { label: 'فایل‌های صوتی',    value: '۰', icon: Headphones, bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-200' },
    { label: 'ویدیوها',           value: '۰', icon: PlayCircle, bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-200' },
    { label: 'اعضا',              value: '۰', icon: Users,      bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200' },
    { label: 'دسته‌بندی‌ها',     value: '۰', icon: BookMarked, bg: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-200' },
];

const NAV_LINKS = [
    { label: 'داشبورد',  href: '/dashboard',  icon: LayoutDashboard },
    { label: 'کاربران',  href: '/users',       icon: Users },
    { label: 'نقش‌ها',   href: '/roles',       icon: Settings },
];

const QUICK_LINKS = [
    { label: 'افزودن کتاب',      icon: BookOpen,   color: 'bg-[#27ae60] hover:bg-[#219a52]' },
    { label: 'افزودن مقاله',      icon: FileText,   color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'افزودن صوت',       icon: Headphones, color: 'bg-violet-600 hover:bg-violet-700' },
    { label: 'افزودن ویدیو',      icon: PlayCircle, color: 'bg-rose-600 hover:bg-rose-700' },
];

function AdminBar({ user }: { user: AuthUser }) {
    const [open, setOpen] = useState(false);
    const initials = user.name.trim().slice(0, 2).toUpperCase();

    const logout = () => router.post('/logout');

    return (
        <header className="bg-[#1a252f] h-[60px] flex items-center px-4 gap-4 relative z-50">
            {/* Logo + title */}
            <a href="/dashboard" className="flex items-center gap-2.5 shrink-0">
                <img src="/falogo.png" alt="کتابخانه رسالت" className="h-9 w-auto object-contain" />
                <span className="hidden sm:block text-white font-bold text-[14px]">کتابخانه رسالت</span>
            </a>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-0.5 flex-1 ms-4">
                {NAV_LINKS.map(({ label, href, icon: Icon }) => {
                    const active = typeof window !== 'undefined' && window.location.pathname === href;
                    return (
                        <a
                            key={href}
                            href={href}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                                active
                                    ? 'bg-[#27ae60] text-white'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                        </a>
                    );
                })}
            </nav>

            {/* Spacer */}
            <div className="flex-1 md:hidden" />

            {/* View site */}
            <a
                href="/"
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 text-[12px] text-white/60 hover:text-white transition-colors"
            >
                <Globe className="w-3.5 h-3.5" />
                مشاهده سایت
            </a>

            {/* User dropdown */}
            <div className="relative shrink-0">
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                    <div className="w-7 h-7 rounded-full bg-[#27ae60] flex items-center justify-center text-[11px] font-bold text-white">
                        {initials}
                    </div>
                    <span className="hidden sm:block text-[13px]">{user.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                    <div className="absolute top-full end-0 mt-2 w-44 bg-white shadow-xl rounded-lg border border-gray-100 overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-[13px] font-bold text-gray-800 truncate">{user.name}</p>
                            <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                        </div>
                        <a
                            href="/settings/profile"
                            className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Settings className="w-3.5 h-3.5" />
                            تنظیمات
                        </a>
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            خروج
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    return (
        <div dir="rtl" className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title="داشبورد — کتابخانه رسالت" />

            <AdminBar user={user} />

            <main className="max-w-[1240px] mx-auto px-4 py-8 flex flex-col gap-6">

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
                    <div className="relative z-10 flex items-center gap-4">
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
                    <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#27ae60] via-teal-400 to-emerald-300" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                    {STAT_CARDS.map(({ label, value, icon: Icon, bg, text, border }) => (
                        <div key={label} className={`rounded-xl border ${border} bg-white p-4 flex flex-col gap-3`}>
                            <div className={`w-10 h-10 rounded-lg ${bg} ${text} flex items-center justify-center`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{value}</p>
                                <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick actions */}
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <h2 className="text-[13px] font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#27ae60] rounded-full inline-block" />
                        دسترسی سریع
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {QUICK_LINKS.map(({ label, icon: Icon, color }) => (
                            <button
                                key={label}
                                className={`${color} text-white rounded-lg px-4 py-3 flex items-center gap-2 text-[13px] font-medium transition-colors`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Placeholder message */}
                <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-400 flex flex-col items-center gap-3">
                    <LayoutDashboard className="w-10 h-10 opacity-25" />
                    <p className="text-[13px]">محتوای داشبورد به زودی اضافه خواهد شد</p>
                </div>

            </main>
        </div>
    );
}
