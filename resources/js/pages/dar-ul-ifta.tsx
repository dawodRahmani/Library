import { Head } from '@inertiajs/react';
import { TopBar }          from '@/components/home/top-bar';
import { MainNav }         from '@/components/home/main-nav';
import { NewsTicker }      from '@/components/home/news-ticker';
import { PageHeader }      from '@/components/home/page-header';
import { DarUlIftaList }   from '@/components/home/dar-ul-ifta-list';
import { HomeSidebar }     from '@/components/home/home-sidebar';
import { HomeFooter }      from '@/components/home/home-footer';

interface FatwaItem {
    id: number;
    title: string;
    description: string;
    author: string;
    category: string;
    categorySlug: string;
    date: string;
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
    return (
        <div dir="rtl" className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title="دارالافتاء — کتابخانه رسالت" />

            <TopBar />
            <MainNav />
            <NewsTicker />

            <PageHeader
                title="دارالافتاء"
                breadcrumbs={[
                    { label: 'خانه', href: '/' },
                    { label: 'دارالافتاء' },
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
