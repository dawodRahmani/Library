import { useTranslation } from 'react-i18next';
import { UtensilsCrossed, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function KioskHeader() {
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'da' ? 'en' : 'da';
        i18n.changeLanguage(newLang);
        document.documentElement.dir = newLang === 'da' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLang;
    };

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b bg-card">
            <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
                    <UtensilsCrossed className="size-6" />
                </div>
                <div>
                    <h1 className="text-xl font-bold">{t('kiosk.welcome')}</h1>
                    <p className="text-sm text-muted-foreground">{t('kiosk.subtitle')}</p>
                </div>
            </div>
            <Button
                variant="outline"
                size="lg"
                onClick={toggleLanguage}
                className="gap-2 text-base"
            >
                <Globe className="size-5" />
                {i18n.language === 'da' ? 'English' : 'دری'}
            </Button>
        </header>
    );
}
