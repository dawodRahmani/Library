import { useState } from 'react';
import { Facebook, Twitter, Youtube, Rss, Share2, Mail, PlayCircle } from 'lucide-react';
import { SectionHeader } from './section-header';

/* ── Social Widget ───────────────────────────────────────── */
const SOCIALS = [
    { icon: Facebook,  label: 'Likes',      count: '521',    color: 'bg-[#3b5998]' },
    { icon: Twitter,   label: 'Followers',  count: '3,297',  color: 'bg-[#1da1f2]' },
    { icon: Youtube,   label: 'Subscriber', count: '596K',   color: 'bg-[#ff0000]' },
    { icon: Rss,       label: 'Subscriber', count: '1,240',  color: 'bg-[#f26522]' },
];

function SocialWidget() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-2 mb-1">
                <Share2 className="w-4 h-4 text-[#27ae60]" />
            </div>
            <SectionHeader title="در ارتباط بمانید" showNav={false} />
            <div className="grid grid-cols-2 gap-3 mt-2">
                {SOCIALS.map(({ icon: Icon, label, count, color }) => (
                    <a
                        key={label + count}
                        href="#"
                        className={`${color} text-white rounded-lg p-3 flex flex-col items-center gap-1 hover:opacity-90 transition-opacity`}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="font-bold text-base leading-none">{count}</span>
                        <span className="text-[11px] opacity-90">{label}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}

/* ── Subscribe Widget ────────────────────────────────────── */
function SubscribeWidget() {
    const [email, setEmail] = useState('');

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-[#27ae60]" />
            </div>
            <SectionHeader title="در وب‌سایت ما عضو شوید" showNav={false} />
            <p className="text-[13px] text-gray-500 mb-3 leading-relaxed">
                برای دریافت جدیدترین به‌روزرسانی‌ها، ایمیل خود را وارد کنید.
            </p>
            <div className="flex gap-2">
                <input
                    type="email"
                    placeholder="آدرس ایمیل"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#27ae60] transition-colors"
                />
                <button className="shrink-0 bg-[#27ae60] hover:bg-[#229954] text-white px-3 py-2 rounded-lg transition-colors">
                    <Mail className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

/* ── Video Widget ────────────────────────────────────────── */
const VIDEOS = [
    {
        title: 'نشید جدید — بخش ایمان',
        author: 'ادمین',
        date: '۸ حمل ۱۴۰۴',
        gradient: 'from-teal-800 to-emerald-700',
    },
    {
        title: 'درس توحید — شرح عقیده طحاویه',
        author: 'ادمین',
        date: '۷ حمل ۱۴۰۴',
        gradient: 'from-blue-800 to-indigo-700',
    },
    {
        title: 'آموزش قرائت قرآن کریم',
        author: 'ادمین',
        date: '۶ حمل ۱۴۰۴',
        gradient: 'from-violet-800 to-purple-700',
    },
];

function VideoWidget() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-2 mb-1">
                <PlayCircle className="w-4 h-4 text-[#27ae60]" />
            </div>
            <SectionHeader title="ویدیوهای یوتیوب" />
            <div className="space-y-3 mt-2">
                {VIDEOS.map((v) => (
                    <a key={v.title} href="#" className="flex gap-3 group">
                        <div className={`shrink-0 w-20 h-14 rounded-lg bg-gradient-to-br ${v.gradient} flex items-center justify-center`}>
                            <PlayCircle className="w-5 h-5 text-white/80" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[13px] font-bold text-gray-800 line-clamp-2 group-hover:text-[#27ae60] transition-colors leading-snug">
                                {v.title}
                            </h4>
                            <div className="flex gap-1.5 text-[11px] text-gray-400 mt-1">
                                <span>{v.author}</span>
                                <span>•</span>
                                <span>{v.date}</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

/* ── Sidebar assembly ────────────────────────────────────── */
export function HomeSidebar() {
    return (
        <div>
            <SocialWidget />
            <SubscribeWidget />
            <VideoWidget />
        </div>
    );
}
