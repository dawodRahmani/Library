import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { TopBar }     from '@/components/home/top-bar';
import { MainNav }    from '@/components/home/main-nav';
import { HomeFooter } from '@/components/home/home-footer';
import { useDir }     from '@/hooks/use-dir';
import { Download, ArrowRight, BookOpen } from 'lucide-react';

type Locale = 'da' | 'en' | 'ar' | 'tg';
function getLocale(lang: string): Locale {
    return (['da', 'en', 'ar', 'tg'] as const).includes(lang as Locale) ? lang as Locale : 'da';
}

interface Props {
    book: {
        id: number;
        title: string;
        author: string;
        file_type: string | null;
        is_external: boolean;
        read_url: string;
        download_url: string;
    };
}

export default function BookReader({ book }: Props) {
    const { i18n } = useTranslation();
    const locale = getLocale(i18n.language);
    const dir = useDir();

    const L = {
        back:     { da: 'بازگشت به کتابخانه', en: 'Back to Library',   ar: 'العودة إلى المكتبة',     tg: 'Бозгашт ба китобхона' }[locale],
        download: { da: 'دانلود',              en: 'Download',           ar: 'تحميل',                  tg: 'Зеркашӣ' }[locale],
        reading:  { da: 'در حال مطالعه',       en: 'Reading',            ar: 'جارٍ القراءة',           tg: 'Дар ҳоли хондан' }[locale],
        noViewer: { da: 'مرورگر شما از نمایش PDF پشتیبانی نمی‌کند. لطفاً فایل را دانلود کنید.', en: 'Your browser does not support PDF viewing. Please download the file.', ar: 'متصفحك لا يدعم عرض PDF. يرجى تنزيل الملف.', tg: 'Браузери шумо PDF-намоишро дастгирӣ намекунад. Лутфан файлро зеркашӣ кунед.' }[locale],
    };

    return (
        <div dir={dir} className="min-h-screen bg-[#f0f2f5] font-sans flex flex-col">
            <Head title={`${book.title} — ${L.reading}`} />
            <TopBar />
            <MainNav />

            {/* Reader header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <a
                            href="/library"
                            className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-[#27ae60] transition-colors shrink-0"
                        >
                            <ArrowRight className="w-4 h-4" />
                            {L.back}
                        </a>
                        <span className="text-gray-300">|</span>
                        <BookOpen className="w-4 h-4 text-[#27ae60] shrink-0" />
                        <h1 className="text-[14px] font-bold text-gray-800 truncate">{book.title}</h1>
                        {book.author && (
                            <span className="text-[13px] text-gray-400 shrink-0 hidden sm:inline">— {book.author}</span>
                        )}
                    </div>
                    <a
                        href={book.download_url}
                        className="flex items-center gap-1.5 text-[13px] bg-[#27ae60] hover:bg-[#219a52] text-white px-3 py-1.5 rounded-lg transition-colors shrink-0"
                    >
                        <Download className="w-3.5 h-3.5" />
                        {L.download}
                    </a>
                </div>
            </div>

            {/* PDF viewer */}
            <div className="flex-1 flex flex-col">
                {book.is_external ? (
                    /* External URL — open in new tab with a nice redirect page */
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
                        <BookOpen className="w-16 h-16 text-[#27ae60]/30" />
                        <p className="text-gray-500 text-sm">
                            {locale === 'da' ? 'این کتاب در یک سایت خارجی قرار دارد' : 'This book is hosted on an external site'}
                        </p>
                        <a
                            href={book.read_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-[#27ae60] hover:bg-[#219a52] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
                        >
                            {locale === 'da' ? 'باز کردن در تب جدید' : 'Open in new tab'}
                        </a>
                    </div>
                ) : (
                    <iframe
                        src={book.read_url}
                        title={book.title}
                        className="flex-1 w-full border-0"
                        style={{ minHeight: 'calc(100vh - 120px)' }}
                    >
                        <p className="p-6 text-center text-gray-500">{L.noViewer}</p>
                    </iframe>
                )}
            </div>

            <HomeFooter />
        </div>
    );
}
