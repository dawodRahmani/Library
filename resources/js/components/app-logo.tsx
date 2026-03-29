import { useTranslation } from 'react-i18next';

export default function AppLogo() {
    const { t } = useTranslation();

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                <img src="/falogo.png" alt={t('app.name')} className="size-8 object-contain" />
            </div>
            <div className="ms-1 grid flex-1 text-start text-sm">
                <span className="truncate leading-tight font-bold text-sidebar-foreground">
                    {t('app.name')}
                </span>
            </div>
        </>
    );
}
