import { Head } from '@inertiajs/react';
import { TopBar }     from '@/components/home/top-bar';
import { MainNav }    from '@/components/home/main-nav';
import { NewsTicker } from '@/components/home/news-ticker';
import { PageHeader } from '@/components/home/page-header';
import { AudioList }  from '@/components/home/audio-list';
import { HomeSidebar } from '@/components/home/home-sidebar';
import { HomeFooter } from '@/components/home/home-footer';
import { useDir }     from '@/hooks/use-dir';

interface AudioItem {
    id: number;
    title: string;
    description: string;
    author: string;
    category: string;
    categorySlug: string;
    duration: string;
    episodes: number;
    audio_source: 'link' | 'upload';
    audio_url: string | null;
    has_file: boolean;
    file_size: number | null;
    date: string;
}

interface Category {
    slug: string;
    name: string;
}

interface PageProps {
    audios: AudioItem[];
    categories: Category[];
}

export default function Audio({ audios, categories }: PageProps) {
    const dir = useDir();
    return (
        <div dir={dir} className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title="صوت‌ها — کتابخانه رسالت" />

            <TopBar />
            <MainNav />
            <NewsTicker />

            <PageHeader
                title="صوت‌ها"
                breadcrumbs={[
                    { label: 'خانه', href: '/' },
                    { label: 'صوت‌ها' },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <AudioList
                            audios={audios}
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
