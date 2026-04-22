import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { TopBar }          from '@/components/home/top-bar';
import { MainNav }         from '@/components/home/main-nav';
import { NewsTicker }      from '@/components/home/news-ticker';
import { PageHeader }      from '@/components/home/page-header';
import { DarUlIftaList }   from '@/components/home/dar-ul-ifta-list';
import { HomeSidebar }     from '@/components/home/home-sidebar';
import { HomeFooter }      from '@/components/home/home-footer';
import { useDir }          from '@/hooks/use-dir';

type Locale = 'da' | 'en' | 'ar' | 'tg';
function getLocale(lang: string): Locale {
    return (['da', 'en', 'ar', 'tg'] as const).includes(lang as Locale) ? lang as Locale : 'da';
}

interface FatwaItem {
    id: number;
    title: string;
    description: string;
    body: string;
    author: string;
    category: string;
    categorySlug: string;
    date: string;
    thumbnail: string | null;
    type: 'text' | 'audio' | 'video';
    media_source: 'link' | 'upload' | null;
    media_url: string | null;
    has_file: boolean;
    stream_url: string | null;
}

interface Category {
    slug: string;
    name: string;
}

interface PageProps {
    fatwas: FatwaItem[];
    categories: Category[];
}

export default function DarUlIfta({ fatwas, categories }: PageProps) {
    const { i18n } = useTranslation();
    const locale = getLocale(i18n.language);
    const dir = useDir();

    const L = {
        pageTitle: { da: 'دارالإفتاء', en: 'Dar ul-Ifta', ar: 'دار الإفتاء', tg: 'Дорул-ифто' }[locale],
        home:      { da: 'خانه',        en: 'Home',        ar: 'الرئيسية',     tg: 'Хона' }[locale],
    };

    return (
        <div dir={dir} className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title={`${L.pageTitle} — کتابخانه رسالت`} />

            <TopBar />
            <MainNav />
            <NewsTicker />

            <PageHeader
                title={L.pageTitle}
                breadcrumbs={[
                    { label: L.home, href: '/' },
                    { label: L.pageTitle },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <DarUlIftaList
                            fatwas={fatwas}
                            categories={categories}
                        />
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
