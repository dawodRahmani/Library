import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { TopBar }      from '@/components/home/top-bar';
import { MainNav }     from '@/components/home/main-nav';
import { NewsTicker }  from '@/components/home/news-ticker';
import { PageHeader }  from '@/components/home/page-header';
import { HomeSidebar } from '@/components/home/home-sidebar';
import { HomeFooter }  from '@/components/home/home-footer';
import { FileText, CalendarDays, ArrowLeft } from 'lucide-react';

interface StatementItem {
    id:           number;
    title:        string;
    body:         string;
    published_at: string | null;
}

interface Props {
    statements: StatementItem[];
}

function formatDate(date: string | null, locale: string) {
    if (!date) return '';
    return new Date(date).toLocaleDateString(locale === 'en' ? 'en-US' : 'fa-IR', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
}

function StatementCard({ item, locale }: { item: StatementItem; locale: string }) {
    return (
        <Link
            href={`/bayania/${item.id}`}
            className="block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-[#27ae60]/30 transition-all group"
        >
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-[#27ae60]/10 flex items-center justify-center mt-0.5">
                        <FileText className="w-5 h-5 text-[#27ae60]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[15px] text-gray-900 leading-snug mb-2 group-hover:text-[#27ae60] transition-colors">
                            {item.title}
                        </h3>
                        {item.published_at && (
                            <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                                <CalendarDays className="w-3.5 h-3.5" />
                                <span>{formatDate(item.published_at, locale)}</span>
                            </div>
                        )}
                    </div>
                    <ArrowLeft className="shrink-0 w-4 h-4 text-gray-300 group-hover:text-[#27ae60] transition-colors mt-1" />
                </div>
            </div>
        </Link>
    );
}

export default function Bayania({ statements }: Props) {
    const { i18n, t } = useTranslation();
    const locale = ['da', 'en', 'ar'].includes(i18n.language) ? i18n.language : 'da';

    return (
        <div dir="rtl" className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title={`${t('nav.statements', 'بیانیه‌ها')} — کتابخانه رسالت`} />

            <TopBar />
            <MainNav />
            <NewsTicker />

            <PageHeader
                title={t('nav.statements', 'بیانیه‌ها')}
                breadcrumbs={[
                    { label: t('nav.home', 'خانه'), href: '/' },
                    { label: t('nav.statements', 'بیانیه‌ها') },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {statements.length === 0 ? (
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 flex flex-col items-center gap-4 text-center text-gray-400">
                                <FileText className="w-10 h-10" />
                                <p className="text-sm">
                                    {locale === 'en' ? 'No statements published yet.' : 'هیچ بیانیه‌ای منتشر نشده است.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {statements.map((item) => (
                                    <StatementCard key={item.id} item={item} locale={locale} />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-1">
                        <HomeSidebar />
                    </div>
                </div>
            </div>

            <HomeFooter />
        </div>
    );
}
