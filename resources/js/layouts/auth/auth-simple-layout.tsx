import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLogoIcon from '@/components/app-logo-icon';
import { LanguageSwitcher } from '@/components/language-switcher';
import { login } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { t } = useTranslation();

    return (
        <div className="relative flex min-h-svh">
            {/* Left side - Branding panel with gradient */}
            <div className="hidden lg:flex lg:w-[55%] flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
                {/* Animated decorative shapes */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Large blurred circles */}
                    <div className="absolute -top-20 -start-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
                    <div className="absolute bottom-0 end-0 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-3xl" />
                    <div className="absolute top-1/2 start-1/2 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl" />

                    {/* Grid pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }}
                    />

                    {/* Floating shapes */}
                    <div className="absolute top-[15%] end-[20%] w-3 h-3 rounded-full bg-indigo-400/60" />
                    <div className="absolute top-[25%] start-[15%] w-2 h-2 rounded-full bg-violet-400/60" />
                    <div className="absolute bottom-[30%] end-[30%] w-4 h-4 rounded-full bg-indigo-300/40" />
                    <div className="absolute bottom-[20%] start-[25%] w-2.5 h-2.5 rounded-full bg-amber-400/40" />
                    <div className="absolute top-[60%] end-[10%] w-2 h-2 rounded-full bg-violet-300/50" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-8 text-center px-12 max-w-lg">
                    {/* Logo with glow effect */}
                    <div className="relative">
                        <div className="absolute inset-0 blur-2xl bg-indigo-400/30 rounded-full scale-150" />
                        <AppLogoIcon size="lg" className="relative size-28 drop-shadow-2xl" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold text-white tracking-tight">
                            {t('app.name')}
                        </h1>
                        <div className="w-16 h-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-400 rounded-full mx-auto" />
                        <p className="text-indigo-100/80 text-lg leading-relaxed">
                            {t('app.tagline')}
                        </p>
                    </div>

                    {/* Feature highlights */}
                    <div className="grid grid-cols-3 gap-6 mt-8 w-full">
                        <div className="flex flex-col items-center gap-2 text-indigo-100/70">
                            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium">داشبورد</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-indigo-100/70">
                            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium">فرمایشات</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-indigo-100/70">
                            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium">گزارشات</span>
                        </div>
                    </div>
                </div>

                {/* Bottom decorative bar */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-400 via-violet-500 to-amber-400" />
            </div>

            {/* Right side - Login form */}
            <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 md:p-10 relative">
                {/* Subtle background texture */}
                <div className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `radial-gradient(circle, #4f46e5 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                    }}
                />

                {/* Language switcher */}
                <div className="absolute top-5 end-5 z-10">
                    <LanguageSwitcher />
                </div>

                <div className="relative w-full max-w-[400px]">
                    <div className="flex flex-col gap-8">
                        {/* Logo — visible on mobile only */}
                        <div className="flex flex-col items-center gap-4 lg:hidden">
                            <Link
                                href={login()}
                                className="flex flex-col items-center gap-3"
                            >
                                <AppLogoIcon size="lg" className="size-20" />
                                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                    {t('app.name')}
                                </span>
                            </Link>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-400 rounded-full" />
                        </div>

                        {/* Title & description */}
                        <div className="space-y-2 text-center lg:text-start">
                            <h2 className="text-2xl font-bold text-foreground">
                                {title}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>

                        {children}

                        {/* Footer branding */}
                        <div className="text-center mt-6 space-y-1">
                            <p className="text-xs text-muted-foreground/60">
                                {t('app.name')} &copy; {new Date().getFullYear()}
                            </p>
                            <p className="text-[11px] text-muted-foreground/50">
                                Developed by <span className="font-medium">Hadaf e Bartar ICT</span>
                            </p>
                            <p className="text-[10px] text-muted-foreground/40">
                                0789409014 | 070 880 5207
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
