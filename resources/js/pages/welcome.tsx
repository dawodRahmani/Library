import { Head } from '@inertiajs/react';
import { TopBar }         from '@/components/home/top-bar';
import { MainNav }        from '@/components/home/main-nav';
import { NewsTicker }     from '@/components/home/news-ticker';
import { HomeHero, type HeroItem } from '@/components/home/home-hero';
import { HomeMainColumn } from '@/components/home/home-main-column';
import { HomeSidebar }    from '@/components/home/home-sidebar';
import { HomeFooter }     from '@/components/home/home-footer';

export type { HeroItem };

interface RecentVideo {
    id: number;
    title: string;
    instructor: string;
    thumbnail: string | null;
    video_url: string | null;
    video_source: string;
    youtube_id: string | null;
    duration: string | null;
}

interface ContentItem {
    id: number;
    title: string;
    author: string;
    date: string;
    cover_image?: string | null;
    thumbnail?: string | null;
}

interface PageProps {
    heroItems: HeroItem[];
    recentVideos: RecentVideo[];
    recentArticles: ContentItem[];
    recentAudios: ContentItem[];
    recentBooks: ContentItem[];
}

export default function Welcome({ heroItems, recentVideos, recentArticles, recentAudios, recentBooks }: PageProps) {
    return (
        <div dir="rtl" className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title="کتابخانه رسالت" />
            <TopBar />
            <MainNav />
            <NewsTicker />
            <div className="max-w-[1240px] mx-auto px-4">
                <HomeHero heroItems={heroItems} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
                    <div className="lg:col-span-2">
                        <HomeMainColumn
                            recentVideos={recentVideos}
                            recentArticles={recentArticles}
                            recentAudios={recentAudios}
                            recentBooks={recentBooks}
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
