import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

interface NavChild {
    label: string;
    href: string;
}
interface NavItem {
    label: string;
    href?: string;
    children?: NavChild[];
}

const NAV_ITEMS: NavItem[] = [
    { label: 'خانه', href: '/' },
    {
        label: 'کتابخانه',
        href: '/library',
        children: [
            { label: 'عقیده و منهج', href: '/library?category=aqeedah' },
            { label: 'جهاد و استشهاد', href: '/library?category=jihad' },
            { label: 'مقاله‌ها', href: '/library?category=articles' },
            { label: 'سیاست', href: '/library?category=politics' },
            { label: 'تاریخ', href: '/library?category=history' },
            { label: 'کتاب‌های گوناگون', href: '/library?category=various' },
        ],
    },
    {
        label: 'دارالإفتاء',
        href: '/dar-ul-ifta',
        children: [
            { label: 'توحید و عقیده', href: '/dar-ul-ifta?category=tawheed' },
            { label: 'جهاد و استشهاد', href: '/dar-ul-ifta?category=jihad' },
            { label: 'قضایای سیاسی', href: '/dar-ul-ifta?category=political' },
            { label: 'احکام شرعی عام', href: '/dar-ul-ifta?category=rulings' },
            { label: 'بیانیه‌ها', href: '/dar-ul-ifta?category=statements' },
        ],
    },
    {
        label: 'ویدیوها',
        href: '/library/videos',
        children: [
            { label: 'عقیده و منهج', href: '/library/videos?category=aqeedah' },
            { label: 'پند و موعظه', href: '/library/videos?category=advice' },
            { label: 'جهاد و استشهاد', href: '/library/videos?category=jihad' },
            { label: 'سیاست', href: '/library/videos?category=politics' },
            { label: 'تحلیل و سخن روز', href: '/library/videos?category=analysis' },
            { label: 'تاریخ', href: '/library/videos?category=history' },
        ],
    },
    {
        label: 'صوتی‌ها',
        href: '/audio',
        children: [
            { label: 'عقیده و منهج', href: '/audio?category=aqeedah' },
            { label: 'پند و موعظه', href: '/audio?category=advice' },
            { label: 'جهاد و استشهاد', href: '/audio?category=jihad' },
            { label: 'سیاست', href: '/audio?category=politics' },
            { label: 'تحلیل و سخن روز', href: '/audio?category=analysis' },
            { label: 'تاریخ', href: '/audio?category=history' },
            { label: 'نشید و ترانه', href: '/audio?category=nasheed' },
        ],
    },
    { label: 'بیانیه‌ها', href: '/dar-ul-ifta?category=statements' },
    { label: 'مجله', href: '/majalla' },
    { label: 'درباره ما', href: '/about' },
    { label: 'تماس با ما', href: '/contact' },
];

function DropdownItem({ item }: { item: NavItem }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    if (!item.children) {
        return (
            <li>
                <a
                    href={item.href ?? '#'}
                    className="block px-3 py-1 text-white/90 hover:text-white text-[14px] transition-colors"
                >
                    {item.label}
                </a>
            </li>
        );
    }

    return (
        <li ref={ref} className="relative">
            <div
                className="flex items-center"
                onMouseEnter={() => setOpen(true)}
            >
                <a
                    href={item.href ?? '#'}
                    className="px-3 py-1 text-white/90 hover:text-white text-[14px] transition-colors"
                >
                    {item.label}
                </a>
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="pe-2 py-1 text-white/70 hover:text-white transition-colors"
                >
                    <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
            </div>
            {open && (
                <div
                    className="absolute top-full end-0 min-w-[190px] bg-white shadow-xl rounded-b-md z-50 border-t-2 border-[#27ae60] overflow-hidden"
                    onMouseLeave={() => setOpen(false)}
                >
                    {item.children.map((child) => (
                        <a
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-2.5 text-[13px] text-gray-700 hover:bg-[#f0faf5] hover:text-[#27ae60] border-b border-gray-100 last:border-0 transition-colors"
                        >
                            {child.label}
                        </a>
                    ))}
                </div>
            )}
        </li>
    );
}

export function MainNav() {
    const [sticky, setSticky] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setSticky(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav
            className={`bg-[#1a252f] z-50 transition-shadow ${sticky ? 'sticky top-0 shadow-2xl shadow-black/40' : ''}`}
        >
            <div className="max-w-[1240px] mx-auto px-4">
                <div className="flex items-center justify-between h-[68px]">
                    {/* Logo */}
                    <a href="/" className="shrink-0">
                        <img src="/falogo.png" alt="کتابخانه رسالت" className="h-[56px] w-auto object-contain" />
                    </a>

                    {/* Desktop nav */}
                    <ul className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
                        {NAV_ITEMS.map((item) => (
                            <DropdownItem key={item.label} item={item} />
                        ))}
                    </ul>

                    {/* Mobile toggle */}
                    <button
                        className="lg:hidden text-white p-2"
                        onClick={() => setMobileOpen((v) => !v)}
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="lg:hidden border-t border-white/10 pb-4">
                        {NAV_ITEMS.map((item) => (
                            <div key={item.label}>
                                <a
                                    href={item.href ?? '#'}
                                    className="block px-3 py-2.5 text-white/90 hover:text-white text-[14px] border-b border-white/5"
                                >
                                    {item.label}
                                </a>
                                {item.children?.map((child) => (
                                    <a
                                        key={child.label}
                                        href={child.href}
                                        className="block px-6 py-2 text-gray-400 hover:text-white text-[13px] border-b border-white/5"
                                    >
                                        {child.label}
                                    </a>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
