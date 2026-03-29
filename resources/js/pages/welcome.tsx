import { Head } from '@inertiajs/react';
import { TopBar }         from '@/components/home/top-bar';
import { MainNav }        from '@/components/home/main-nav';
import { NewsTicker }     from '@/components/home/news-ticker';
import { HomeHero }       from '@/components/home/home-hero';
import { HomeMainColumn } from '@/components/home/home-main-column';
import { HomeSidebar }    from '@/components/home/home-sidebar';
import { HomeFooter }     from '@/components/home/home-footer';

export default function Welcome() {
    return (
        <div dir="rtl" className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title="کتابخانه رسالت" />

            {/* ── Header ── */}
            <TopBar />
            <MainNav />
            <NewsTicker />

            {/* ── Main content ── */}
            <div className="max-w-[1240px] mx-auto px-4">
                {/* Hero featured cards */}
                <HomeHero />

                {/* Main column + Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
                    <div className="lg:col-span-2">
                        <HomeMainColumn />
                    </div>
                    <div className="lg:col-span-1">
                        <HomeSidebar />
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <HomeFooter />
        </div>
    );
}
