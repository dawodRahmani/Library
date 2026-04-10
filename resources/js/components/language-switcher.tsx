import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

const languages = [
    { code: 'da', label: 'دری', dir: 'rtl' },
    { code: 'en', label: 'EN', dir: 'ltr' },
    { code: 'ar', label: 'ع', dir: 'rtl' },
    { code: 'tg', label: 'ТЈ', dir: 'ltr' },
];

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const switchLanguage = (langCode: string) => {
        const lang = languages.find((l) => l.code === langCode);
        if (lang) {
            i18n.changeLanguage(langCode);
            localStorage.setItem('language', langCode);
            // Set cookie for backend locale detection
            document.cookie = `locale=${langCode}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
            document.documentElement.dir = lang.dir;
            document.documentElement.lang = langCode;
            router.reload();
        }
    };

    return (
        <div className="flex gap-1 rounded-lg border border-border/50 bg-background/80 backdrop-blur-sm p-1">
            {languages.map((lang) => (
                <Button
                    key={lang.code}
                    variant={i18n.language === lang.code ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => switchLanguage(lang.code)}
                    className={`text-xs px-3 h-7 ${
                        i18n.language === lang.code
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                            : 'hover:bg-muted'
                    }`}
                >
                    {lang.label}
                </Button>
            ))}
        </div>
    );
}
