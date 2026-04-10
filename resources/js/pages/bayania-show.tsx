import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { TopBar }      from '@/components/home/top-bar';
import { MainNav }     from '@/components/home/main-nav';
import { NewsTicker }  from '@/components/home/news-ticker';
import { PageHeader }  from '@/components/home/page-header';
import { HomeSidebar } from '@/components/home/home-sidebar';
import { HomeFooter }  from '@/components/home/home-footer';
import { CalendarDays, ArrowRight } from 'lucide-react';

interface StatementItem {
    id:           number;
    title:        string;
    body:         string;
    published_at: string | null;
}

interface Props {
    statement: StatementItem;
}

function formatDate(date: string | null, locale: string) {
    if (!date) return '';
    return new Date(date).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'ar' ? 'ar-SA' : 'fa-IR', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
}

export default function BayaniaShow({ statement }: Props) {
    const { i18n, t } = useTranslation();
    const locale = ['da', 'en', 'ar', 'tg'].includes(i18n.language) ? i18n.language : 'da';

    return (
        <div dir="rtl" className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title={`${statement.title} — کتابخانه رسالت`} />

            <TopBar />
            <MainNav />
            <NewsTicker />

            <PageHeader
                title={statement.title}
                breadcrumbs={[
                    { label: t('nav.home', 'خانه'), href: '/' },
                    { label: t('nav.statements', 'بیانیه‌ها'), href: '/bayania' },
                    { label: statement.title },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {/* Back link */}
                        <Link
                            href="/bayania"
                            className="inline-flex items-center gap-1.5 text-sm text-[#27ae60] hover:underline"
                        >
                            <ArrowRight className="w-4 h-4" />
                            {t('nav.statements', 'بیانیه‌ها')}
                        </Link>

                        {/* Statement card */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
                            <h1 className="text-xl font-bold text-gray-900 leading-snug">
                                {statement.title}
                            </h1>

                            {statement.published_at && (
                                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                                    <CalendarDays className="w-4 h-4" />
                                    <span>{formatDate(statement.published_at, locale)}</span>
                                </div>
                            )}

                            {statement.body ? (
                                <div
                                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed border-t border-gray-100 pt-5"
                                    dangerouslySetInnerHTML={{ __html: statement.body }}
                                />
                            ) : (
                                <p className="text-gray-400 text-sm border-t border-gray-100 pt-5">
                                    {locale === 'en' ? 'No content available.' : locale === 'ar' ? 'لا يوجد محتوى.' : 'محتوایی موجود نیست.'}
                                </p>
                            )}
                        </div>
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
