import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { ChevronDown, Globe } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const languages = [
    { code: 'da', label: 'دری', dir: 'rtl' },
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'tg', label: 'Тоҷикӣ', dir: 'ltr' },
];

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const current = languages.find((l) => l.code === i18n.language) ?? languages[0];

    const switchLanguage = (langCode: string) => {
        const lang = languages.find((l) => l.code === langCode);
        if (lang) {
            i18n.changeLanguage(langCode);
            localStorage.setItem('language', langCode);
            document.cookie = `locale=${langCode}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
            document.documentElement.dir = lang.dir;
            document.documentElement.lang = langCode;
            router.reload();
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1.5 h-8 px-3 text-xs border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-muted"
                >
                    <Globe className="h-3.5 w-3.5 opacity-70" />
                    <span>{current.label}</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[130px]">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => switchLanguage(lang.code)}
                        className={`cursor-pointer text-sm ${
                            i18n.language === lang.code
                                ? 'bg-emerald-50 text-emerald-700 font-medium dark:bg-emerald-950/40 dark:text-emerald-400'
                                : ''
                        }`}
                    >
                        {lang.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
