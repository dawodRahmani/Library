import { SectionHeader } from './section-header';
import { BookOpen, Headphones, FileText, PlayCircle } from 'lucide-react';

interface ListItem {
    title: string;
    author: string;
    date: string;
    category: string;
    gradient: string;
}

const RECENT_POSTS: ListItem[] = [
    {
        title: 'تفسیر سوره بقره — بخش اول',
        author: 'ادمین', date: '۹ حمل ۱۴۰۴',
        category: 'مقاله', gradient: 'from-teal-800 to-emerald-700',
    },
    {
        title: 'فقه الحنفی — کتاب الصلاة',
        author: 'ادمین', date: '۸ حمل ۱۴۰۴',
        category: 'کتاب', gradient: 'from-blue-800 to-indigo-700',
    },
    {
        title: 'تاریخ اسلام در ماوراءالنهر',
        author: 'ادمین', date: '۷ حمل ۱۴۰۴',
        category: 'مقاله', gradient: 'from-violet-800 to-purple-700',
    },
];

const AUDIO_ITEMS: ListItem[] = [
    {
        title: 'شرح حدیث جبریل — قسمت اول',
        author: 'ادمین', date: '۸ حمل ۱۴۰۴',
        category: 'صوت', gradient: 'from-rose-800 to-red-700',
    },
    {
        title: 'درس‌های توحید از علامه ابن‌باز',
        author: 'ادمین', date: '۶ حمل ۱۴۰۴',
        category: 'صوت', gradient: 'from-amber-800 to-orange-700',
    },
];

const VIDEOS: ListItem[] = [
    {
        title: 'اصول عقیده اهل سنت و الجماعت',
        author: 'شیخ عبدالله نوری', date: '۹ حمل ۱۴۰۴',
        category: 'ویدیو', gradient: 'from-indigo-800 to-blue-700',
    },
    {
        title: 'توحید — بنیاد اسلام',
        author: 'مفتی احمد رحمانی', date: '۸ حمل ۱۴۰۴',
        category: 'ویدیو', gradient: 'from-teal-800 to-emerald-700',
    },
    {
        title: 'شرح عقیده طحاویه',
        author: 'دکتر محمد حسینی', date: '۷ حمل ۱۴۰۴',
        category: 'ویدیو', gradient: 'from-violet-800 to-purple-700',
    },
];

const BOOKS: ListItem[] = [
    {
        title: 'مختصر صحیح البخاری',
        author: 'ادمین', date: '۹ حمل ۱۴۰۴',
        category: 'کتاب', gradient: 'from-green-800 to-teal-700',
    },
    {
        title: 'ریاض الصالحین',
        author: 'ادمین', date: '۷ حمل ۱۴۰۴',
        category: 'کتاب', gradient: 'from-cyan-800 to-blue-700',
    },
    {
        title: 'فتح الباری شرح صحیح البخاری',
        author: 'ادمین', date: '۵ حمل ۱۴۰۴',
        category: 'کتاب', gradient: 'from-slate-800 to-gray-700',
    },
];

function ContentCard({ item, icon: Icon = BookOpen }: { item: ListItem; icon?: typeof BookOpen }) {
    return (
        <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0 group">
            {/* Thumbnail */}
            <div className={`shrink-0 w-24 h-16 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center overflow-hidden`}>
                <Icon className="w-6 h-6 text-white/70" />
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
                <span className="inline-block text-[11px] bg-[#27ae60]/10 text-[#27ae60] px-2 py-0.5 rounded mb-1 font-bold">
                    {item.category}
                </span>
                <h3 className="text-[14px] font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#27ae60] transition-colors">
                    <a href="#">{item.title}</a>
                </h3>
                <div className="flex gap-2 text-[12px] text-gray-400 mt-1">
                    <span>{item.author}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                </div>
            </div>
        </div>
    );
}

function Section({ title, items, icon: Icon, href, itemIcon }: { title: string; items: ListItem[]; icon: typeof BookOpen; href?: string; itemIcon?: typeof BookOpen }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-[#27ae60]" />
                <span className="text-[#27ae60] text-sm font-bold">{title}</span>
            </div>
            <SectionHeader title={title} />
            <div>
                {items.map((item) => (
                    <ContentCard key={item.title} item={item} icon={itemIcon} />
                ))}
            </div>
            {href && (
                <a href={href} className="mt-3 flex items-center justify-center gap-1 text-[13px] text-[#27ae60] hover:text-[#1e8449] font-medium transition-colors">
                    مشاهده همه
                </a>
            )}
        </div>
    );
}

export function HomeMainColumn() {
    return (
        <div>
            <Section title="پست‌های جدید" items={RECENT_POSTS} icon={FileText} />
            <Section title="ویدیوهای جدید" items={VIDEOS} icon={PlayCircle} href="/library/videos" itemIcon={PlayCircle} />
            <Section title="صوت‌های جدید" items={AUDIO_ITEMS} icon={Headphones} />
            <Section title="کتاب‌های جدید" items={BOOKS} icon={BookOpen} />
        </div>
    );
}
