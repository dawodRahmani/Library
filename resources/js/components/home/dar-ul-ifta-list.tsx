import { useState } from 'react';
import { PlayCircle, Headphones, BookMarked, Clock, User, ChevronLeft } from 'lucide-react';

/* ── Types ───────────────────────────────────────────────── */
type TabKey = 'videos' | 'audio' | 'manuscripts';

interface FatwaItem {
    id: number;
    title: string;
    description: string;
    author: string;
    date: string;
    duration?: string;
    pages?: string;
    gradient: string;
}

/* ── Mock data ───────────────────────────────────────────── */
const VIDEOS: FatwaItem[] = [
    { id: 1, title: 'حکم نماز جماعت در مسجد', description: 'بیان احکام و فضایل نماز جماعت و شرایط وجوب آن از دیدگاه فقهای اهل سنت.', author: 'شیخ عبدالله نوری', date: '۹ حمل ۱۴۰۴', duration: '۲۵ دقیقه', gradient: 'from-emerald-900 to-teal-800' },
    { id: 2, title: 'مسائل زکات فطر', description: 'بررسی احکام تفصیلی زکات فطر، مقدار، وقت و مستحقین آن با دلایل از قرآن و سنت.', author: 'مفتی احمد رحمانی', date: '۸ حمل ۱۴۰۴', duration: '۳۲ دقیقه', gradient: 'from-blue-900 to-indigo-800' },
    { id: 3, title: 'حکم روزه مسافر', description: 'تفصیل احکام روزه در سفر و شرایطی که افطار جایز یا واجب می‌شود.', author: 'شیخ عبدالله نوری', date: '۷ حمل ۱۴۰۴', duration: '۱۸ دقیقه', gradient: 'from-violet-900 to-purple-800' },
    { id: 4, title: 'مسائل نکاح و طلاق', description: 'شرح مسائل مهم در باب نکاح، شرایط صحت آن و احکام طلاق از نظر فقه حنفی.', author: 'مفتی محمد حسینی', date: '۶ حمل ۱۴۰۴', duration: '۴۵ دقیقه', gradient: 'from-rose-900 to-red-800' },
    { id: 5, title: 'حکم بیمه در اسلام', description: 'بررسی فقهی انواع بیمه، حکم شرعی آن‌ها و جایگزین‌های اسلامی مشروع.', author: 'مفتی احمد رحمانی', date: '۵ حمل ۱۴۰۴', duration: '۳۸ دقیقه', gradient: 'from-amber-900 to-orange-800' },
    { id: 6, title: 'احکام تجارت آنلاین', description: 'فتوا در مورد خرید و فروش آنلاین، شرایط صحت معامله و موارد حرام در تجارت اینترنتی.', author: 'مفتی محمد حسینی', date: '۴ حمل ۱۴۰۴', duration: '۲۹ دقیقه', gradient: 'from-teal-900 to-cyan-800' },
];

const AUDIO: FatwaItem[] = [
    { id: 1, title: 'احکام طهارت و وضو', description: 'شرح مفصل احکام طهارت، انواع نجاسات و طریقه صحیح وضو با ذکر ادله.', author: 'مفتی احمد رحمانی', date: '۹ حمل ۱۴۰۴', duration: '۴۰ دقیقه', gradient: 'from-green-900 to-emerald-800' },
    { id: 2, title: 'حکم موسیقی در اسلام', description: 'بررسی جامع ادله تحریم موسیقی و انواع مجاز و غیرمجاز آن از دیدگاه فقها.', author: 'شیخ زهرا نوری', date: '۸ حمل ۱۴۰۴', duration: '۵۵ دقیقه', gradient: 'from-indigo-900 to-blue-800' },
    { id: 3, title: 'مسائل غسل و جنابت', description: 'احکام تفصیلی غسل، موجبات آن و طریقه صحیح اغتسال بر اساس سنت نبوی.', author: 'مفتی محمد حسینی', date: '۷ حمل ۱۴۰۴', duration: '۳۵ دقیقه', gradient: 'from-pink-900 to-rose-800' },
    { id: 4, title: 'حکم تصویر و عکاسی', description: 'فتوا در مورد تصویر از انسان و حیوانات، عکاسی، فیلمبرداری و استثناهای مجاز.', author: 'مفتی احمد رحمانی', date: '۶ حمل ۱۴۰۴', duration: '۴۲ دقیقه', gradient: 'from-slate-900 to-gray-800' },
    { id: 5, title: 'احکام ذبح و قربانی', description: 'شرایط صحت ذبح، حیواناتی که ذبح آن‌ها جایز است و احکام قربانی در عید الاضحی.', author: 'شیخ عبدالله نوری', date: '۵ حمل ۱۴۰۴', duration: '۳۰ دقیقه', gradient: 'from-cyan-900 to-teal-800' },
    { id: 6, title: 'حکم تبرج و حجاب', description: 'بیان وجوب حجاب شرعی برای زنان مسلمان، حدود و شروط آن با ادله قرآنی و حدیثی.', author: 'شیخ زهرا نوری', date: '۴ حمل ۱۴۰۴', duration: '۴۸ دقیقه', gradient: 'from-amber-900 to-yellow-800' },
];

const MANUSCRIPTS: FatwaItem[] = [
    { id: 1, title: 'مجموعه فتاوای ابن تیمیه', description: 'نسخه خطی کمیاب از مجموعه فتاوای شیخ الاسلام ابن تیمیه، کتابت شده در قرن هشتم هجری.', author: 'ابن تیمیه', date: '۹ حمل ۱۴۰۴', pages: '۳۸۰ صفحه', gradient: 'from-amber-900 to-stone-800' },
    { id: 2, title: 'الفقه الاکبر — ابوحنیفه', description: 'نسخه دست‌نویس از کتاب الفقه الاکبر امام ابوحنیفه نعمان بن ثابت رحمه الله.', author: 'امام ابوحنیفه', date: '۸ حمل ۱۴۰۴', pages: '۱۲۰ صفحه', gradient: 'from-stone-900 to-neutral-800' },
    { id: 3, title: 'رسالة في أحكام الجهاد', description: 'رساله فقهی نادر در احکام جهاد، نوشته شده توسط یکی از علمای قرن دهم هجری.', author: 'مجهول', date: '۷ حمل ۱۴۰۴', pages: '۹۵ صفحه', gradient: 'from-neutral-900 to-zinc-800' },
    { id: 4, title: 'شرح مختصر خلیل', description: 'نسخه خطی از شرح مختصر خلیل، از مهم‌ترین متون فقهی مذهب مالکی.', author: 'خلیل بن اسحاق', date: '۶ حمل ۱۴۰۴', pages: '۵۶۰ صفحه', gradient: 'from-zinc-900 to-slate-800' },
    { id: 5, title: 'الأم — امام شافعی', description: 'نسخه قدیمی از کتاب الأم امام شافعی، از جامع‌ترین کتب فقه شافعی.', author: 'امام شافعی', date: '۵ حمل ۱۴۰۴', pages: '۸۲۰ صفحه', gradient: 'from-brown-900 to-amber-900' },
    { id: 6, title: 'المغنی — ابن قدامه', description: 'نسخه دست‌نویس از کتاب المغنی که یکی از مراجع اصلی فقه حنبلی به شمار می‌رود.', author: 'ابن قدامه', date: '۴ حمل ۱۴۰۴', pages: '۴۴۰ صفحه', gradient: 'from-orange-900 to-amber-800' },
];

const TABS: { key: TabKey; label: string; icon: typeof PlayCircle; data: FatwaItem[] }[] = [
    { key: 'videos',      label: 'ویدیوها',        icon: PlayCircle,  data: VIDEOS },
    { key: 'audio',       label: 'صوت‌ها',         icon: Headphones,  data: AUDIO },
    { key: 'manuscripts', label: 'نسخه‌های خطی',  icon: BookMarked,  data: MANUSCRIPTS },
];

/* ── Card ────────────────────────────────────────────────── */
function FatwaCard({ item, type }: { item: FatwaItem; type: TabKey }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
            {/* Thumbnail */}
            <div className={`h-36 bg-gradient-to-br ${item.gradient} relative flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                {type === 'videos'      && <PlayCircle  className="relative z-10 w-12 h-12 text-white/60 group-hover:text-white/90 transition-colors" />}
                {type === 'audio'       && <Headphones  className="relative z-10 w-12 h-12 text-white/60 group-hover:text-white/90 transition-colors" />}
                {type === 'manuscripts' && <BookMarked  className="relative z-10 w-12 h-12 text-white/60 group-hover:text-white/90 transition-colors" />}
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-[14px] text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#27ae60] transition-colors">
                    <a href="#">{item.title}</a>
                </h3>
                <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">
                    {item.description}
                </p>
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {item.author}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.duration ?? item.pages}
                    </span>
                </div>
            </div>

            {/* CTA */}
            <a href="#" className="flex items-center justify-between px-4 py-2.5 bg-[#f0faf5] text-[#27ae60] text-[12px] font-bold hover:bg-[#27ae60] hover:text-white transition-colors border-t border-gray-100">
                <span>{type === 'manuscripts' ? 'مشاهده نسخه' : type === 'audio' ? 'گوش دادن' : 'تماشا'}</span>
                <ChevronLeft className="w-3.5 h-3.5" />
            </a>
        </div>
    );
}

/* ── Main export ─────────────────────────────────────────── */
export function DarUlIftaList() {
    const [activeTab, setActiveTab] = useState<TabKey>('videos');
    const current = TABS.find((t) => t.key === activeTab)!;

    return (
        <div>
            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-white rounded-xl border border-gray-100 shadow-sm p-1.5">
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition-all ${
                            activeTab === key
                                ? 'bg-[#27ae60] text-white shadow-sm'
                                : 'text-gray-500 hover:text-[#27ae60]'
                        }`}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {current.data.map((item) => (
                    <FatwaCard key={item.id} item={item} type={activeTab} />
                ))}
            </div>
        </div>
    );
}
