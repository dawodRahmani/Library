import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { TopBar }     from '@/components/home/top-bar';
import { MainNav }    from '@/components/home/main-nav';
import { HomeFooter } from '@/components/home/home-footer';
import { Download, ArrowRight, Newspaper } from 'lucide-react';

type Locale = 'da' | 'en' | 'ar' | 'tg';
function getLocale(lang: string): Locale {
    return (['da', 'en', 'ar', 'tg'] as const).includes(lang as Locale) ? lang as Locale : 'da';
}

interface Props {
    magazine: {
        id: number;
        number: number;
        title: string;
        read_url: string;
        download_url: string;
    };
}

export default function MagazineReader({ magazine }: Props) {
    const { i18n } = useTranslation();
    const locale = getLocale(i18n.language);

    const L = {
        back:     { da: 'بازگشت به مجله', en: 'Back to Magazine',  ar: 'العودة إلى المجلة',      tg: 'Бозгашт ба маҷалла' }[locale],
        download: { da: 'دانلود',          en: 'Download',           ar: 'تحميل',                  tg: 'Зеркашӣ' }[locale],
        reading:  { da: 'در حال مطالعه',   en: 'Reading',            ar: 'جارٍ القراءة',           tg: 'Дар ҳоли хондан' }[locale],
        issue:    { da: 'شماره',           en: 'Issue',              ar: 'العدد',                  tg: 'Рақам' }[locale],
        noViewer: { da: 'مرورگر شما از نمایش PDF پشتیبانی نمی‌کند. لطفاً فایل را دانلود کنید.', en: 'Your browser does not support PDF viewing. Please download the file.', ar: 'متصفحك لا يدعم عرض PDF. يرجى تنزيل الملف.', tg: 'Браузери шумо PDF-намоишро дастгирӣ намекунад. Лутфан файлро зеркашӣ кунед.' }[locale],
    };

    return (
        <div dir="rtl" className="min-h-screen bg-[#f0f2f5] font-sans flex flex-col">
            <Head title={`${magazine.title} — ${L.reading}`} />
            <TopBar />
            <MainNav />

            {/* Reader header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <a
                            href="/majalla"
                            className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-[#27ae60] transition-colors shrink-0"
                        >
                            <ArrowRight className="w-4 h-4" />
                            {L.back}
                        </a>
                        <span className="text-gray-300">|</span>
                        <Newspaper className="w-4 h-4 text-[#27ae60] shrink-0" />
                        <h1 className="text-[14px] font-bold text-gray-800 truncate">{magazine.title}</h1>
                        <span className="text-[13px] text-gray-400 shrink-0 hidden sm:inline">— {L.issue} {magazine.number}</span>
                    </div>
                    <a
                        href={magazine.download_url}
                        className="flex items-center gap-1.5 text-[13px] bg-[#27ae60] hover:bg-[#219a52] text-white px-3 py-1.5 rounded-lg transition-colors shrink-0"
                    >
                        <Download className="w-3.5 h-3.5" />
                        {L.download}
                    </a>
                </div>
            </div>

            {/* PDF viewer */}
            <div className="flex-1 flex flex-col">
                <iframe
                    src={magazine.read_url}
                    title={magazine.title}
                    className="flex-1 w-full border-0"
                    style={{ minHeight: 'calc(100vh - 120px)' }}
                >
                    <p className="p-6 text-center text-gray-500">{L.noViewer}</p>
                </iframe>
            </div>

            <HomeFooter />
        </div>
    );
}
