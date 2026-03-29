import { Head } from '@inertiajs/react';
import { TopBar }     from '@/components/home/top-bar';
import { MainNav }    from '@/components/home/main-nav';
import { NewsTicker } from '@/components/home/news-ticker';
import { PageHeader } from '@/components/home/page-header';
import { FikrList }   from '@/components/home/fikr-list';
import { HomeSidebar } from '@/components/home/home-sidebar';
import { HomeFooter } from '@/components/home/home-footer';

export default function Fikr() {
    return (
        <div dir="rtl" className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title="فکر و عقیده — کتابخانه رسالت" />

            <TopBar />
            <MainNav />
            <NewsTicker />

            <PageHeader
                title="فکر و عقیده"
                breadcrumbs={[
                    { label: 'خانه', href: '/' },
                    { label: 'فکر و عقیده' },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <FikrList />
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
