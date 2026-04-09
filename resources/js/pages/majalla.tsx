import { Head } from '@inertiajs/react';
import { TopBar }      from '@/components/home/top-bar';
import { MainNav }     from '@/components/home/main-nav';
import { NewsTicker }  from '@/components/home/news-ticker';
import { PageHeader }  from '@/components/home/page-header';
import { MajallaList } from '@/components/home/majalla-list';
import { HomeSidebar } from '@/components/home/home-sidebar';
import { HomeFooter }  from '@/components/home/home-footer';

interface MagazineItem {
    id: number;
    number: number;
    title: string;
    theme: string;
    year: string;
    articleCount: number;
    description: string;
    featured: boolean;
    articles: string[];
    cover_image?: string;
    has_file: boolean;
    file_size: number | null;
    date: string;
}

interface PageProps {
    magazines: MagazineItem[];
}

export default function Majalla({ magazines }: PageProps) {
    return (
        <div dir="rtl" className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title="مجله — کتابخانه رسالت" />

            <TopBar />
            <MainNav />
            <NewsTicker />

            <PageHeader
                title="مجله"
                breadcrumbs={[
                    { label: 'خانه', href: '/' },
                    { label: 'مجله' },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <MajallaList magazines={magazines} />
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
