import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { SearchBar } from '@/components/home/search-bar';

interface NavChild {
    label: string;
    href: string;
    children?: NavChild[];
}
interface NavItem {
    label: string;
    href?: string;
    children?: NavChild[];
}

function SubmenuChild({ child }: { child: NavChild }) {
    const [open, setOpen] = useState(false);
    const hasChildren = !!(child.children && child.children.length > 0);

    if (!hasChildren) {
        return (
            <a
                href={child.href}
                className="block px-4 py-2.5 text-[13px] text-gray-700 hover:bg-[#f0faf5] hover:text-[#27ae60] border-b border-gray-100 last:border-0 transition-colors"
            >
                {child.label}
            </a>
        );
    }

    return (
        <div className="border-b border-gray-100 last:border-0">
            <div className="flex items-center">
                <a
                    href={child.href}
                    className="flex-1 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-[#f0faf5] hover:text-[#27ae60] transition-colors"
                >
                    {child.label}
                </a>
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setOpen((v) => !v); }}
                    className={`pe-3 py-2.5 text-gray-400 hover:text-[#27ae60] transition-colors ${open ? 'text-[#27ae60]' : ''}`}
                    aria-label="toggle submenu"
                    aria-expanded={open}
                >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
            </div>
            {open && (
                <div className="bg-[#f8fafc] border-t border-gray-100">
                    {child.children!.map((sub) => (
                        <a
                            key={sub.label}
                            href={sub.href}
                            className="flex items-center gap-2 ps-8 pe-4 py-2 text-[12px] text-gray-600 hover:bg-[#f0faf5] hover:text-[#27ae60] border-b border-gray-100 last:border-0 transition-colors"
                        >
                            <span className="w-1 h-1 rounded-full bg-[#27ae60] shrink-0" />
                            {sub.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

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
            <div className="flex items-center">
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
                <div className="absolute top-full end-0 min-w-[220px] bg-white shadow-xl rounded-b-md z-50 border-t-2 border-[#27ae60] overflow-hidden">
                    {item.children.map((child) => (
                        <SubmenuChild key={child.label} child={child} />
                    ))}
                </div>
            )}
        </li>
    );
}

function MobileSubChild({ child, onNavigate }: { child: NavChild; onNavigate: () => void }) {
    const [open, setOpen] = useState(false);
    const hasChildren = !!(child.children && child.children.length > 0);

    if (!hasChildren) {
        return (
            <a
                href={child.href}
                onClick={onNavigate}
                className="flex items-center gap-2 px-7 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 text-[13px] border-b border-white/5 last:border-0 transition-colors"
            >
                <span className="w-1 h-1 rounded-full bg-[#27ae60] shrink-0" />
                {child.label}
            </a>
        );
    }

    return (
        <>
            <div className="flex items-center border-b border-white/5">
                <a
                    href={child.href}
                    onClick={onNavigate}
                    className="flex-1 flex items-center gap-2 px-7 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 text-[13px] transition-colors"
                >
                    <span className="w-1 h-1 rounded-full bg-[#27ae60] shrink-0" />
                    {child.label}
                </a>
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="px-4 py-2.5 text-white/40 hover:text-white transition-colors"
                    aria-label="toggle subsubmenu"
                >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </button>
            </div>
            {open && (
                <div className="bg-white/5">
                    {child.children!.map((sub) => (
                        <a
                            key={sub.label}
                            href={sub.href}
                            onClick={onNavigate}
                            className="flex items-center gap-2 ps-12 pe-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 text-[12px] border-b border-white/5 last:border-0 transition-colors"
                        >
                            <span className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
                            {sub.label}
                        </a>
                    ))}
                </div>
            )}
        </>
    );
}

function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
    const [open, setOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;

    return (
        <div className="border-b border-white/5">
            <div className="flex items-center">
                <a
                    href={item.href ?? '#'}
                    onClick={onNavigate}
                    className="flex-1 px-4 py-3 text-white/90 hover:text-white text-[14px] transition-colors"
                >
                    {item.label}
                </a>
                {hasChildren && (
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="px-4 py-3 text-white/50 hover:text-white transition-colors"
                        aria-label="toggle submenu"
                    >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                    </button>
                )}
            </div>
            {hasChildren && open && (
                <div className="bg-white/5 border-t border-white/5">
                    {item.children!.map((child) => (
                        <MobileSubChild key={child.label} child={child} onNavigate={onNavigate} />
                    ))}
                </div>
            )}
        </div>
    );
}

interface NavCategory {
    slug: string;
    name: string;
}

interface SharedProps {
    navCategories?: {
        books: NavCategory[];
        videos: NavCategory[];
        audios: NavCategory[];
        fatwas: NavCategory[];
    };
    [key: string]: unknown;
}

export function MainNav() {
    const [sticky, setSticky] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { t } = useTranslation();
    const { navCategories } = usePage<SharedProps>().props;

    const cats = navCategories ?? { books: [], videos: [], audios: [], fatwas: [] };

    const typeLabels = {
        text:  t('content.types.text',  'متن'),
        audio: t('content.types.audio', 'صوت'),
        video: t('content.types.video', 'ویدیو'),
    };

    useEffect(() => {
        const onScroll = () => setSticky(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const getNavItems = (): NavItem[] => [
        { label: t('nav.home'), href: '/' },
        {
            label: t('nav.library'),
            href: '/library',
            children: cats.books.map((c) => ({
                label: c.name,
                href: `/library?category=${c.slug}`,
            })),
        },
        {
            label: t('nav.darUlIfta'),
            href: '/dar-ul-ifta',
            children: cats.fatwas.map((c) => ({
                label: c.name,
                href: `/dar-ul-ifta?category=${c.slug}`,
                children: [
                    { label: typeLabels.text,  href: `/dar-ul-ifta?category=${c.slug}&type=text`  },
                    { label: typeLabels.audio, href: `/dar-ul-ifta?category=${c.slug}&type=audio` },
                    { label: typeLabels.video, href: `/dar-ul-ifta?category=${c.slug}&type=video` },
                ],
            })),
        },
        {
            label: t('nav.videos'),
            href: '/library/videos',
            children: cats.videos.map((c) => ({
                label: c.name,
                href: `/library/videos?category=${c.slug}`,
            })),
        },
        {
            label: t('nav.audio'),
            href: '/audio',
            children: cats.audios.map((c) => ({
                label: c.name,
                href: `/audio?category=${c.slug}`,
            })),
        },
        {
            label: t('nav.statements'),
            href: '/bayania',
            children: [
                { label: t('statementsType.text',  'متن'),   href: '/bayania?type=text'  },
                { label: t('statementsType.audio', 'صوت'),   href: '/bayania?type=audio' },
                { label: t('statementsType.video', 'ویدیو'), href: '/bayania?type=video' },
            ],
        },
        { label: t('nav.magazine'), href: '/majalla' },
        { label: t('nav.about'), href: '/about' },
        { label: t('nav.contact'), href: '/contact' },
    ];

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
                        {getNavItems().map((item) => (
                            <DropdownItem key={item.label} item={item} />
                        ))}
                    </ul>

                    {/* Desktop search */}
                    <div className="hidden lg:block shrink-0">
                        <SearchBar />
                    </div>

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
                    <div className="lg:hidden border-t border-white/10 pb-4 max-h-[80vh] overflow-y-auto">
                        {/* Mobile search */}
                        <div className="px-3 py-3 border-b border-white/10">
                            <SearchBar />
                        </div>
                        {getNavItems().map((item) => (
                            <MobileNavItem
                                key={item.label}
                                item={item}
                                onNavigate={() => setMobileOpen(false)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
