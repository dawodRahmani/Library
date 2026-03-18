import { useTranslation } from 'react-i18next';
import { Globe, MapPin } from 'lucide-react';
import i18n from '@/i18n';

interface MenuHeaderProps {
    tableNumber?: number | null;
}

export function MenuHeader({ tableNumber }: MenuHeaderProps) {
    const { t } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'da' ? 'en' : 'da';
        i18n.changeLanguage(newLang);
        localStorage.setItem('language', newLang);
        document.documentElement.dir = newLang === 'da' ? 'rtl' : 'ltr';
    };

    return (
        <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur-md dark:bg-card/95 shadow-sm">
            <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 gap-3">
                {/* Logo + info */}
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-purple-600 text-white shadow-md">
                        <span className="text-sm font-bold">TR</span>
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-base font-bold text-foreground leading-tight truncate">
                            {t('app.name')}
                        </h1>
                        {tableNumber ? (
                            <div className="flex items-center gap-1 mt-0.5">
                                <MapPin className="size-3 text-emerald-500 shrink-0" />
                                <p className="text-xs text-muted-foreground">
                                    {t('digitalMenu.table')} {tableNumber}
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground">{t('digitalMenu.browseMenu')}</p>
                        )}
                    </div>
                </div>

                {/* Language toggle */}
                <button
                    onClick={toggleLanguage}
                    className="shrink-0 flex items-center gap-1.5 rounded-xl border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                    <Globe className="size-3.5" />
                    {i18n.language === 'da' ? 'EN' : 'دری'}
                </button>
            </div>
        </header>
    );
}
