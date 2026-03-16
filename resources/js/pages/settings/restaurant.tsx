import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface RestaurantSettings {
    name: string;
    address: string;
    phone: string;
    receiptHeader: string;
    receiptFooter: string;
    showLogo: boolean;
    showAddress: boolean;
    showPhone: boolean;
    taxRate: number;
    currencySymbol: string;
}

const defaultSettings: RestaurantSettings = {
    name: 'رستورانت برتر',
    address: 'کابل، افغانستان',
    phone: '0799123456',
    receiptHeader: '',
    receiptFooter: 'تشکر از شما! منتظر مراجعه دوباره شما هستیم.',
    showLogo: true,
    showAddress: true,
    showPhone: true,
    taxRate: 0,
    currencySymbol: '؋',
};

export default function RestaurantSettings() {
    const { t } = useTranslation();
    const [settings, setSettings] = useState<RestaurantSettings>(defaultSettings);
    const [saved, setSaved] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('settings.title'), href: '/settings/profile' },
        { title: t('settings.restaurant'), href: '/settings/restaurant' },
    ];

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: save to backend
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.restaurant')} />

            <h1 className="sr-only">{t('settings.restaurant')}</h1>

            <SettingsLayout>
                <form onSubmit={handleSave} className="space-y-8">
                    {/* Restaurant Info */}
                    <div className="space-y-6">
                        <Heading
                            variant="small"
                            title={t('settings.restaurant')}
                            description={t('settings.restaurantDesc')}
                        />

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="rest-name" className="font-medium">
                                    {t('settings.restaurantName')}
                                </Label>
                                <Input
                                    id="rest-name"
                                    value={settings.name}
                                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rest-address" className="font-medium">
                                    {t('settings.restaurantAddress')}
                                </Label>
                                <Textarea
                                    id="rest-address"
                                    value={settings.address}
                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rest-phone" className="font-medium">
                                    {t('settings.restaurantPhone')}
                                </Label>
                                <Input
                                    id="rest-phone"
                                    value={settings.phone}
                                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                    dir="ltr"
                                    className="h-10 text-left"
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Receipt Config */}
                    <div className="space-y-6">
                        <Heading
                            variant="small"
                            title={t('settings.receiptConfig')}
                        />

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="receipt-header" className="font-medium">
                                    {t('settings.receiptHeader')}
                                </Label>
                                <Textarea
                                    id="receipt-header"
                                    value={settings.receiptHeader}
                                    onChange={(e) => setSettings({ ...settings, receiptHeader: e.target.value })}
                                    rows={2}
                                    placeholder={t('settings.receiptHeader')}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="receipt-footer" className="font-medium">
                                    {t('settings.receiptFooter')}
                                </Label>
                                <Textarea
                                    id="receipt-footer"
                                    value={settings.receiptFooter}
                                    onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
                                    rows={2}
                                    placeholder={t('settings.receiptFooter')}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tax-rate" className="font-medium">
                                        {t('settings.taxRate')}
                                    </Label>
                                    <Input
                                        id="tax-rate"
                                        type="number"
                                        min={0}
                                        max={100}
                                        step={0.5}
                                        value={settings.taxRate}
                                        onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                                        dir="ltr"
                                        className="h-10 text-left"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="currency-symbol" className="font-medium">
                                        {t('settings.currencySymbol')}
                                    </Label>
                                    <Input
                                        id="currency-symbol"
                                        value={settings.currencySymbol}
                                        onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <Card className="bg-muted/30">
                                <CardContent className="pt-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id="show-logo"
                                            checked={settings.showLogo}
                                            onCheckedChange={(checked) =>
                                                setSettings({ ...settings, showLogo: checked === true })
                                            }
                                            className="border-emerald-400 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                        />
                                        <Label htmlFor="show-logo" className="cursor-pointer">
                                            {t('settings.showLogo')}
                                        </Label>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id="show-address"
                                            checked={settings.showAddress}
                                            onCheckedChange={(checked) =>
                                                setSettings({ ...settings, showAddress: checked === true })
                                            }
                                            className="border-emerald-400 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                        />
                                        <Label htmlFor="show-address" className="cursor-pointer">
                                            {t('settings.showAddress')}
                                        </Label>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id="show-phone"
                                            checked={settings.showPhone}
                                            onCheckedChange={(checked) =>
                                                setSettings({ ...settings, showPhone: checked === true })
                                            }
                                            className="border-emerald-400 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                        />
                                        <Label htmlFor="show-phone" className="cursor-pointer">
                                            {t('settings.showPhone')}
                                        </Label>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Save button */}
                    <div className="flex items-center gap-3">
                        <Button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                        >
                            {t('common.save')}
                        </Button>
                        {saved && (
                            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                                <CheckCircle2 className="size-4" />
                                {t('settings.saved')}
                            </span>
                        )}
                    </div>
                </form>
            </SettingsLayout>
        </AppLayout>
    );
}
