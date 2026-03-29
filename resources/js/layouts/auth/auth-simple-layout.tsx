import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/language-switcher';
import { login } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { BookOpen, FileText, Headphones } from 'lucide-react';

const FEATURES = [
    { icon: BookOpen,   label: 'کتابخانه' },
    { icon: FileText,   label: 'مقاله‌ها' },
    { icon: Headphones, label: 'صوت‌ها' },
];

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    const { t } = useTranslation();

    return (
        <div className="relative flex min-h-svh" dir="rtl">

            {/* ── Left branding panel ───────────────────────────── */}
            <div className="hidden lg:flex lg:w-[55%] flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0d1b2a] via-[#1a252f] to-[#0d1b2a]">

                {/* Background blobs + grid */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -start-24 w-96 h-96 rounded-full bg-[#27ae60]/15 blur-3xl" />
                    <div className="absolute bottom-0 end-0 w-[480px] h-[480px] rounded-full bg-[#1a6b3c]/20 blur-3xl" />
                    <div className="absolute top-1/2 start-1/3 w-56 h-56 rounded-full bg-teal-500/10 blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                                             linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }}
                    />
                    <div className="absolute top-[18%] end-[22%] w-2.5 h-2.5 rounded-full bg-[#27ae60]/50" />
                    <div className="absolute top-[30%] start-[18%] w-2 h-2 rounded-full bg-teal-400/50" />
                    <div className="absolute bottom-[28%] end-[28%] w-3.5 h-3.5 rounded-full bg-[#27ae60]/30" />
                    <div className="absolute bottom-[18%] start-[22%] w-2 h-2 rounded-full bg-emerald-400/40" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-8 text-center px-14 max-w-lg">
                    {/* Logo */}
                    <div className="relative">
                        <div className="absolute inset-0 blur-2xl bg-[#27ae60]/25 rounded-full scale-150" />
                        <img
                            src="/falogo.png"
                            alt={t('app.name')}
                            className="relative h-28 w-auto object-contain drop-shadow-2xl"
                        />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-white tracking-tight">
                            {t('app.name')}
                        </h1>
                        <div className="w-16 h-1 bg-gradient-to-r from-[#27ae60] via-teal-400 to-emerald-300 rounded-full mx-auto" />
                        <p className="text-white/60 text-base leading-relaxed">
                            {t('app.tagline')}
                        </p>
                    </div>

                    {/* Feature highlights */}
                    <div className="grid grid-cols-3 gap-6 mt-4 w-full">
                        {FEATURES.map(({ icon: Icon, label }) => (
                            <div key={label} className="flex flex-col items-center gap-2 text-white/60">
                                <div className="w-11 h-11 rounded-xl bg-[#27ae60]/15 border border-[#27ae60]/20 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-[#27ae60]" />
                                </div>
                                <span className="text-xs font-medium">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#27ae60] via-teal-400 to-emerald-300" />
            </div>

            {/* ── Right login form ──────────────────────────────── */}
            <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 md:p-10 relative">
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `radial-gradient(circle, #27ae60 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                    }}
                />

                {/* Language switcher */}
                <div className="absolute top-5 start-5 z-10">
                    <LanguageSwitcher />
                </div>

                <div className="relative w-full max-w-[400px]">
                    <div className="flex flex-col gap-8">

                        {/* Mobile logo */}
                        <div className="flex flex-col items-center gap-3 lg:hidden">
                            <Link href={login()} className="flex flex-col items-center gap-2">
                                <img src="/falogo.png" alt={t('app.name')} className="h-16 w-auto object-contain" />
                                <span className="text-xl font-bold text-foreground">{t('app.name')}</span>
                            </Link>
                            <div className="w-12 h-0.5 bg-[#27ae60] rounded-full" />
                        </div>

                        {/* Title */}
                        <div className="space-y-1.5 text-center lg:text-start">
                            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>

                        {children}

                        <p className="text-center text-xs text-muted-foreground/50">
                            {t('app.name')} &copy; {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
