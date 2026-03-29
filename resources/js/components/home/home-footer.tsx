import { Facebook, Twitter, Youtube, Linkedin, Rss } from 'lucide-react';

/* ── Sitemap links ───────────────────────────────────────── */
const SITEMAP = [
    { label: 'خانه', href: '/' },
    { label: 'کتابخانه', href: '/library' },
    { label: 'ویدیوها', href: '/library/videos' },
    { label: 'صوت‌ها', href: '/audio' },
    { label: 'مقاله‌ها', href: '/articles' },
    { label: 'تماس با ما', href: '/contact' },
];

const RECENT_BOOKS = [
    'مختصر صحیح البخاری',
    'ریاض الصالحین',
    'فتح الباری شرح البخاری',
    'تفسیر ابن کثیر',
];

const RECENT_ARTICLES = [
    'تفسیر سوره بقره — بخش اول',
    'فقه الحنفی — کتاب الصلاة',
    'تاریخ اسلام در ماوراءالنهر',
    'شرح حدیث جبریل',
];

const SOCIAL_LINKS = [
    { icon: Facebook,  href: '#', color: 'hover:bg-[#3b5998]' },
    { icon: Twitter,   href: '#', color: 'hover:bg-[#1da1f2]' },
    { icon: Youtube,   href: '#', color: 'hover:bg-[#ff0000]' },
    { icon: Linkedin,  href: '#', color: 'hover:bg-[#0077b5]' },
    { icon: Rss,       href: '#', color: 'hover:bg-[#f26522]' },
];

/* ── Widget column ───────────────────────────────────────── */
function FooterWidget({ title, icon, children }: {
    title: string;
    icon?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10 relative">
                <div className="absolute bottom-[-1px] end-0 w-16 h-[1px] bg-[#27ae60]" />
                <h3 className="text-white font-bold text-[15px] flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#27ae60] rounded-full inline-block" />
                    {title}
                </h3>
                {icon && <span className="text-gray-500 text-sm">{icon}</span>}
            </div>
            {children}
        </div>
    );
}

/* ── Footer ──────────────────────────────────────────────── */
export function HomeFooter() {
    return (
        <footer>
            {/* Main footer */}
            <div className="bg-[#1a252f] pt-10 pb-6">
                <div className="max-w-[1240px] mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                        {/* About */}
                        <FooterWidget title="درباره ما">
                            <p className="text-gray-400 text-[13px] leading-loose line-clamp-6">
                                کتابخانه رسالت یک مرکز دیجیتال برای نشر و آموزش علوم اسلامی به زبان دری است. هدف ما فراهم‌آوری منابع علمی معتبر برای همه مسلمانان فارسی‌زبان می‌باشد.
                            </p>
                        </FooterWidget>

                        {/* Sitemap */}
                        <FooterWidget title="نقشه سایت">
                            <ul className="space-y-2">
                                {SITEMAP.map((item) => (
                                    <li key={item.label}>
                                        <a
                                            href={item.href}
                                            className="text-gray-400 text-[13px] hover:text-[#27ae60] transition-colors flex items-center gap-2"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-[#27ae60] shrink-0" />
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </FooterWidget>

                        {/* Recent books */}
                        <FooterWidget title="کتاب‌های جدید">
                            <ul className="space-y-2">
                                {RECENT_BOOKS.map((title) => (
                                    <li key={title}>
                                        <a
                                            href="#"
                                            className="text-gray-400 text-[13px] hover:text-[#27ae60] transition-colors flex items-center gap-2 line-clamp-1"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-[#27ae60] shrink-0" />
                                            {title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </FooterWidget>

                        {/* Recent articles */}
                        <FooterWidget title="مقاله‌ها">
                            <ul className="space-y-2">
                                {RECENT_ARTICLES.map((title) => (
                                    <li key={title}>
                                        <a
                                            href="#"
                                            className="text-gray-400 text-[13px] hover:text-[#27ae60] transition-colors flex items-center gap-2 line-clamp-1"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-[#27ae60] shrink-0" />
                                            {title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </FooterWidget>
                    </div>
                </div>
            </div>

            {/* Copyright bar */}
            <div className="bg-[#0d1117] py-4">
                <div className="max-w-[1240px] mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
                    {/* Copyright */}
                    <p className="text-gray-500 text-[13px]">
                        &copy; {new Date().getFullYear()}{' '}
                        <a href="/" className="text-[#27ae60] hover:text-[#2ecc71] transition-colors">
                            کتابخانه رسالت
                        </a>
                        . تمامی حقوق محفوظ است.
                    </p>

                    {/* Links */}
                    <div className="flex items-center gap-4 text-gray-500 text-[12px]">
                        {['خانه', 'سوالات متداول', 'پشتیبانی'].map((l) => (
                            <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
                        ))}
                    </div>

                    {/* Social icons */}
                    <div className="flex items-center gap-1.5">
                        {SOCIAL_LINKS.map(({ icon: Icon, href, color }) => (
                            <a
                                key={href + color}
                                href={href}
                                className={`w-7 h-7 flex items-center justify-center rounded bg-white/5 text-gray-400 hover:text-white transition-all ${color}`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
