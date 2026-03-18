import { useRef, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
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
import { CheckCircle2, ImagePlus, Trash2 } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Props extends Record<string, unknown> {
    logoUrl: string | null;
}

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
    const { logoUrl } = usePage<Props>().props;

    const [settings, setSettings] = useState<RestaurantSettings>(defaultSettings);
    const [saved, setSaved] = useState(false);

    // Logo upload state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(logoUrl ?? null);
    const [uploading, setUploading] = useState(false);
    const [logoSaved, setLogoSaved] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('settings.title'), href: '/settings/profile' },
        { title: t('settings.restaurant'), href: '/settings/restaurant' },
    ];

    // ── Logo handlers ────────────────────────────────────────────────
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show local preview immediately
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target?.result as string);
        reader.readAsDataURL(file);

        // Upload to backend
        setUploading(true);
        const formData = new FormData();
        formData.append('logo', file);

        router.post('/settings/logo', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setLogoSaved(true);
                setUploading(false);
                setTimeout(() => setLogoSaved(false), 3000);
            },
            onError: () => setUploading(false),
        });
    }

    function handleRemoveLogo() {
        router.delete('/settings/logo', {
            preserveScroll: true,
            onSuccess: () => {
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    }

    // ── General settings save ────────────────────────────────────────
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.restaurant')} />
            <h1 className="sr-only">{t('settings.restaurant')}</h1>

            <SettingsLayout>
                <form onSubmit={handleSave} className="space-y-8">

                    {/* ── Logo Upload ─────────────────────────────── */}
                    <div className="space-y-6">
                        <Heading
                            variant="small"
                            title={t('settings.logoUpload')}
                            description={t('settings.logoUploadDesc')}
                        />

                        <div className="flex items-start gap-6">
                            {/* Preview box */}
                            <div
                                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Logo"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <ImagePlus className="h-8 w-8 text-muted-foreground/50" />
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={uploading}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <ImagePlus className="h-4 w-4 me-2" />
                                    {preview ? t('settings.logoChange') : t('settings.logoUpload')}
                                </Button>

                                {preview && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive"
                                        onClick={handleRemoveLogo}
                                    >
                                        <Trash2 className="h-4 w-4 me-2" />
                                        {t('settings.logoRemove')}
                                    </Button>
                                )}

                                {logoSaved && (
                                    <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                                        <CheckCircle2 className="size-4" />
                                        {t('settings.logoUploaded')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* ── Restaurant Info ──────────────────────────── */}
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

                    {/* ── Receipt Config ───────────────────────────── */}
                    <div className="space-y-6">
                        <Heading variant="small" title={t('settings.receiptConfig')} />

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
                                    {[
                                        { id: 'show-logo', key: 'showLogo', label: t('settings.showLogo') },
                                        { id: 'show-address', key: 'showAddress', label: t('settings.showAddress') },
                                        { id: 'show-phone', key: 'showPhone', label: t('settings.showPhone') },
                                    ].map(({ id, key, label }) => (
                                        <div key={id} className="flex items-center gap-3">
                                            <Checkbox
                                                id={id}
                                                checked={settings[key as keyof RestaurantSettings] as boolean}
                                                onCheckedChange={(checked) =>
                                                    setSettings({ ...settings, [key]: checked === true })
                                                }
                                                className="border-emerald-400 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                            />
                                            <Label htmlFor={id} className="cursor-pointer">{label}</Label>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Save */}
                    <div className="flex items-center gap-3">
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
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
