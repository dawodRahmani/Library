import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { ChefHat, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KitchenHeaderProps {
    activeCount: number;
}

export function KitchenHeader({ activeCount }: KitchenHeaderProps) {
    const { t } = useTranslation();

    return (
        <header className="flex items-center justify-between bg-background border-b px-6 py-3">
            <div className="flex items-center gap-3">
                <ChefHat className="h-8 w-8" />
                <h1 className="text-2xl font-bold">{t('kitchen.title')}</h1>
                <span className="text-sm text-muted-foreground">
                    ({t('kitchen.totalOrders')}: {activeCount})
                </span>
            </div>
            <Button
                variant="outline"
                size="lg"
                onClick={() => router.visit('/dashboard')}
            >
                <LogOut className="h-5 w-5 me-2" />
                {t('kitchen.exitKitchen')}
            </Button>
        </header>
    );
}
