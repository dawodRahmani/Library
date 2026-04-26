import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { TopBar }          from '@/components/home/top-bar';
import { MainNav }         from '@/components/home/main-nav';
import { NewsTicker }      from '@/components/home/news-ticker';
import { PageHeader }      from '@/components/home/page-header';
import { ContactContent }  from '@/components/home/contact-content';
import { HomeSidebar }     from '@/components/home/home-sidebar';
import { HomeFooter }      from '@/components/home/home-footer';
import { useDir }          from '@/hooks/use-dir';

export default function Contact() {
    const dir = useDir();
    const { t } = useTranslation();
    const contactTitle = t('nav.contact');

    return (
        <div dir={dir} className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title={`${contactTitle} — ${t('pageTitles.siteName')}`} />

            <TopBar />
            <MainNav />
            <NewsTicker />

            <PageHeader
                title={contactTitle}
                breadcrumbs={[
                    { label: t('nav.home'), href: '/' },
                    { label: contactTitle },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <ContactContent />
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
