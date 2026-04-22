import { Head } from '@inertiajs/react';
import { TopBar }        from '@/components/home/top-bar';
import { MainNav }       from '@/components/home/main-nav';
import { NewsTicker }    from '@/components/home/news-ticker';
import { PageHeader }    from '@/components/home/page-header';
import { AboutContent }  from '@/components/home/about-content';
import { HomeSidebar }   from '@/components/home/home-sidebar';
import { HomeFooter }    from '@/components/home/home-footer';
import { useDir }        from '@/hooks/use-dir';

export default function About() {
    const dir = useDir();
    return (
        <div dir={dir} className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title="درباره ما — کتابخانه رسالت" />

            <TopBar />
            <MainNav />
            <NewsTicker />

            <PageHeader
                title="درباره ما"
                breadcrumbs={[
                    { label: 'خانه', href: '/' },
                    { label: 'درباره ما' },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <AboutContent />
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
