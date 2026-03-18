import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { QrCode, Printer } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import type { RestaurantTable } from '@/data/mock/types';

interface Props extends Record<string, unknown> { tables: RestaurantTable[] }

export default function QrCodesPage() {
    const { t } = useTranslation();
    const { tables } = usePage<Props>().props;
    const [baseUrl, setBaseUrl] = useState(window.location.origin);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('sidebar.dashboard'), href: '/dashboard' },
        { title: t('sidebar.tables'), href: '/tables' },
        { title: t('tables.qrCodes'), href: '/tables/qr-codes' },
    ];

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('tables.qrCodes')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-purple-600 text-white shadow-md">
                            <QrCode className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{t('tables.qrCodes')}</h1>
                            <p className="text-sm text-muted-foreground">
                                {t('tables.qrCodesDesc')}
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={handlePrint}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        <Printer className="size-4 me-2" />
                        {t('tables.printQrCodes')}
                    </Button>
                </div>

                {/* QR Code Grid */}
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {tables.map((table) => {
                        const menuUrl = `${baseUrl}/digital-menu?table=${table.number}`;
                        // Using a public QR code API for display
                        const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(menuUrl)}&bgcolor=ffffff&color=059669`;

                        return (
                            <Card key={table.id} className="border-border/50 shadow-sm text-center">
                                <CardContent className="flex flex-col items-center gap-3 p-6">
                                    {/* QR Code Image */}
                                    <div className="rounded-xl border-2 border-emerald-100 bg-white p-3 dark:border-emerald-800">
                                        <img
                                            src={qrImageUrl}
                                            alt={`QR Code - ${t('tables.table')} ${table.number}`}
                                            className="size-40"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Table info */}
                                    <div>
                                        <h3 className="text-lg font-bold">
                                            {table.name || `${t('tables.table')} ${table.number}`}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {table.capacity} {t('tables.seats')}
                                        </p>
                                    </div>

                                    {/* URL */}
                                    <p className="text-[10px] text-muted-foreground break-all" dir="ltr">
                                        {menuUrl}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
