import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { TopBar }        from '@/components/home/top-bar';
import { MainNav }       from '@/components/home/main-nav';
import { NewsTicker }    from '@/components/home/news-ticker';
import { PageHeader }    from '@/components/home/page-header';
import { ArticlesList }  from '@/components/home/articles-list';
import { HomeSidebar }   from '@/components/home/home-sidebar';
import { HomeFooter }    from '@/components/home/home-footer';

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content?: string;
    author: string;
    category: string;
    categorySlug: string;
    readTime: string;
    cover_image?: string | null;
    date: string;
}

interface Category {
    slug: string;
    name: string;
}

interface PageProps {
    articles: Article[];
    categories: Category[];
}

type Locale = 'da' | 'en' | 'ar' | 'tg';
function getLocale(lang: string): Locale {
    return (['da', 'en', 'ar', 'tg'] as const).includes(lang as Locale) ? lang as Locale : 'da';
}

export default function Articles({ articles, categories }: PageProps) {
    const { i18n } = useTranslation();
    const locale = getLocale(i18n.language);

    const L = {
        pageTitle: { da: 'مقاله‌ها', en: 'Articles', ar: 'المقالات', tg: 'Мақолаҳо' }[locale],
        home:      { da: 'خانه',     en: 'Home',     ar: 'الرئيسية', tg: 'Хона' }[locale],
    };

    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const slug = params.get('category');
            if (slug && categories.some(c => c.slug === slug)) {
                setActiveCategory(slug);
            }
        }
    }, [categories]);

    return (
        <div dir="rtl" className="min-h-screen bg-[#f0f2f5] font-sans">
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
                        <ArticlesList
                            articles={articles}
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
