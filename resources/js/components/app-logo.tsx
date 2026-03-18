import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { t } = useTranslation();
    const { logoUrl } = usePage<{ logoUrl?: string | null }>().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden shadow-sm">
                {logoUrl ? (
                    <img src={logoUrl} alt={t('app.name')} className="size-8 object-cover" />
                ) : (
                    <AppLogoIcon size="sm" className="size-8" />
                )}
            </div>
            <div className="ms-1 grid flex-1 text-start text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-sidebar-foreground">
                    {t('app.name')}
                </span>
            </div>
        </>
    );
}
