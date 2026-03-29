import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { TopBar }        from '@/components/home/top-bar';
import { MainNav }       from '@/components/home/main-nav';
import { NewsTicker }    from '@/components/home/news-ticker';
import { PageHeader }    from '@/components/home/page-header';
import { ArticlesList }  from '@/components/home/articles-list';
import { HomeSidebar }   from '@/components/home/home-sidebar';
import { HomeFooter }    from '@/components/home/home-footer';

export default function Articles() {
    const [activeCategory, setActiveCategory] = useState('همه');

    return (
        <div dir="rtl" className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title="مقاله‌ها — کتابخانه رسالت" />

            <TopBar />
            <MainNav />
            <NewsTicker />

            <PageHeader
                title="مقاله‌ها"
                breadcrumbs={[
                    { label: 'خانه', href: '/' },
                    { label: 'مقاله‌ها' },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <ArticlesList
                            activeCategory={activeCategory}
                            onCategoryChange={setActiveCategory}
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
