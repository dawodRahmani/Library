import { PostCard, type PostCardData } from './post-card';

const MAIN_CARD: PostCardData = {
    title: 'بزرگترین کتابخانه دیجیتال اسلامی به زبان دری',
    category: 'ویژه',
    author: 'ادمین',
    date: '۹ حمل ۱۴۰۴',
    gradient: 'from-emerald-950 to-teal-900',
    size: 'large',
};

const SIDE_CARDS: PostCardData[] = [
    {
        title: 'مجموعه کتب فقهی دیجیتالی',
        category: 'کتاب‌ها',
        author: 'ادمین',
        date: '۸ حمل ۱۴۰۴',
        gradient: 'from-blue-950 to-indigo-900',
        size: 'medium',
    },
    {
        title: 'سخنرانی‌های علمی در باب عقیده',
        category: 'ویدیو',
        author: 'ادمین',
        date: '۷ حمل ۱۴۰۴',
        gradient: 'from-violet-950 to-purple-900',
        size: 'medium',
    },
    {
        title: 'صوت‌های جدید بخش ایمان',
        category: 'صوت',
        author: 'ادمین',
        date: '۶ حمل ۱۴۰۴',
        gradient: 'from-rose-950 to-red-900',
        size: 'medium',
    },
    {
        title: 'تازه‌ترین مقالات تحلیلی',
        category: 'مقاله',
        author: 'ادمین',
        date: '۵ حمل ۱۴۰۴',
        gradient: 'from-amber-950 to-yellow-900',
        size: 'medium',
    },
];

export function HomeHero() {
    return (
        <div className="py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Large featured card */}
                <div className="home-card rounded-xl overflow-hidden">
                    <PostCard card={MAIN_CARD} />
                </div>

                {/* 2×2 grid of smaller cards */}
                <div className="grid grid-cols-2 gap-4">
                    {SIDE_CARDS.map((card) => (
                        <div key={card.title} className="home-card rounded-xl overflow-hidden">
                            <PostCard card={card} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
