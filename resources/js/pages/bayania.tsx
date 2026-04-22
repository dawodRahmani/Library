import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopBar }      from '@/components/home/top-bar';
import { MainNav }     from '@/components/home/main-nav';
import { NewsTicker }  from '@/components/home/news-ticker';
import { PageHeader }  from '@/components/home/page-header';
import { HomeSidebar } from '@/components/home/home-sidebar';
import { HomeFooter }  from '@/components/home/home-footer';
import { useDir }      from '@/hooks/use-dir';
import { FileText, Music, Video, CalendarDays, ArrowLeft } from 'lucide-react';

type StatementType = 'text' | 'audio' | 'video';

interface StatementItem {
    id:           number;
    type:         StatementType;
    title:        string;
    body:         string;
    media_source: 'link' | 'upload' | null;
    media_url:    string | null;
    has_file:     boolean;
    file_size:    number | null;
    thumbnail:    string | null;
    published_at: string | null;
}

interface Props {
    statements: StatementItem[];
}

function formatDate(date: string | null, locale: string) {
    if (!date) return '';
    return new Date(date).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'ar' ? 'ar-SA' : 'fa-IR', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
}

function typeIcon(type: StatementType) {
    if (type === 'audio') return Music;
    if (type === 'video') return Video;
    return FileText;
}

function typeLabel(type: StatementType, locale: string) {
    const labels = {
        text:  { da: 'متن',   en: 'Text',  ar: 'نص',    tg: 'Матн'  },
        audio: { da: 'صوت',   en: 'Audio', ar: 'صوت',   tg: 'Садо'  },
        video: { da: 'ویدیو', en: 'Video', ar: 'فيديو', tg: 'Видео' },
    } as const;
    const l = (['da', 'en', 'ar', 'tg'] as const).includes(locale as 'da' | 'en' | 'ar' | 'tg')
        ? (locale as 'da' | 'en' | 'ar' | 'tg')
        : 'da';
    return labels[type][l];
}

function StatementCard({ item, locale }: { item: StatementItem; locale: string }) {
    const Icon = typeIcon(item.type);
    const tintBg = item.type === 'audio' ? 'bg-blue-50' : item.type === 'video' ? 'bg-purple-50' : 'bg-[#27ae60]/10';
    const tintFg = item.type === 'audio' ? 'text-blue-600' : item.type === 'video' ? 'text-purple-600' : 'text-[#27ae60]';
    const thumbSrc = item.thumbnail ? (item.thumbnail.startsWith('http') ? item.thumbnail : `/storage/${item.thumbnail}`) : null;

    return (
        <Link
            href={`/bayania/${item.id}`}
            className="block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-[#27ae60]/30 transition-all group"
        >
            <div className="p-5">
                <div className="flex items-start gap-4">
                    {thumbSrc ? (
                        <img
                            src={thumbSrc}
                            alt={item.title}
                            className="shrink-0 w-16 h-16 rounded-lg object-cover border border-gray-200 mt-0.5"
                        />
                    ) : (
                        <div className={`shrink-0 w-10 h-10 rounded-lg ${tintBg} flex items-center justify-center mt-0.5`}>
                            <Icon className={`w-5 h-5 ${tintFg}`} />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${tintBg} ${tintFg}`}>
                                <Icon className="w-3 h-3" />
                                {typeLabel(item.type, locale)}
                            </span>
                        </div>
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
    const locale = ['da', 'en', 'ar', 'tg'].includes(i18n.language) ? i18n.language : 'da';
    const dir = useDir();

    const urlType = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('type') : null;
    const initial = urlType === 'text' || urlType === 'audio' || urlType === 'video' ? urlType : 'all';
    const [activeType, setActiveType] = useState<StatementType | 'all'>(initial);

    const filtered = useMemo(() => {
        if (activeType === 'all') return statements;
        return statements.filter((s) => s.type === activeType);
    }, [statements, activeType]);

    function selectTab(type: StatementType | 'all') {
        setActiveType(type);
        const url = type === 'all' ? '/bayania' : `/bayania?type=${type}`;
        router.get(url, {}, { preserveState: true, preserveScroll: true, replace: true, only: ['statements'] });
    }

    const tabs: { value: StatementType | 'all'; label: string; icon?: React.ElementType }[] = [
        { value: 'all',   label: locale === 'en' ? 'All' : locale === 'ar' ? 'الكل' : locale === 'tg' ? 'Ҳама' : 'همه' },
        { value: 'text',  label: typeLabel('text',  locale), icon: FileText },
        { value: 'audio', label: typeLabel('audio', locale), icon: Music    },
        { value: 'video', label: typeLabel('video', locale), icon: Video    },
    ];

    return (
        <div dir={dir} className="min-h-screen bg-[#f0f2f5] font-sans">
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
                        {/* Type tabs */}
                        <div className="flex gap-1 mb-5 bg-white p-1 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
                            {tabs.map(({ value, label, icon: Icon }) => (
                                <button
                                    key={value}
                                    onClick={() => selectTab(value)}
                                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        activeType === value
                                            ? 'bg-[#27ae60] text-white'
                                            : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    {Icon && <Icon className="w-4 h-4" />}
                                    {label}
                                </button>
                            ))}
                        </div>

                        {filtered.length === 0 ? (
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 flex flex-col items-center gap-4 text-center text-gray-400">
                                <FileText className="w-10 h-10" />
                                <p className="text-sm">
                                    {locale === 'en' ? 'No statements published yet.' : 'هیچ بیانیه‌ای منتشر نشده است.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filtered.map((item) => (
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
