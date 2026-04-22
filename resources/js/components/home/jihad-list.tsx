import { useState } from 'react';
import { PlayCircle, Headphones, BookOpen, Clock, User, ChevronLeft, Shield } from 'lucide-react';

type TabKey = 'videos' | 'audio' | 'books';

interface Item {
    id: number;
    title: string;
    description: string;
    author: string;
    date: string;
    meta: string; // duration / pages / read-time
    gradient: string;
}

/* ── Mock data ───────────────────────────────────────────── */
const VIDEOS: Item[] = [
    { id: 1, title: 'فضیلت جهاد در راه خدا',              description: 'بیان فضائل جهاد از قرآن کریم و سنت نبوی و جایگاه مجاهدان نزد خداوند.',                        author: 'شیخ عبدالله نوری',  date: '۹ حمل ۱۴۰۴',  meta: '۴۵ دقیقه', gradient: 'from-emerald-900 to-teal-800' },
    { id: 2, title: 'شهادت در اسلام — مفهوم و فضیلت',     description: 'شرح مفهوم شهادت در اسلام، شرایط آن و فضایل کسانی که در راه خدا شهید می‌شوند.',             author: 'مفتی احمد رحمانی', date: '۸ حمل ۱۴۰۴',  meta: '۵۸ دقیقه', gradient: 'from-rose-900 to-red-800' },
    { id: 3, title: 'غزوه بدر — درس‌های ماندگار',          description: 'بررسی تاریخی و روحانی غزوه بدر، اولین نبرد مسلحانه اسلام و درس‌هایی که برای امروز دارد.',    author: 'دکتر محمد حسینی', date: '۷ حمل ۱۴۰۴',  meta: '۶۲ دقیقه', gradient: 'from-amber-900 to-orange-800' },
    { id: 4, title: 'سیره صحابه در جهاد',                  description: 'روایت‌هایی از شجاعت و فداکاری صحابه کرام در میادین جهاد و دفاع از دین اسلام.',              author: 'شیخ عبدالله نوری',  date: '۶ حمل ۱۴۰۴',  meta: '۵۰ دقیقه', gradient: 'from-blue-900 to-indigo-800' },
    { id: 5, title: 'جهاد النفس — بزرگترین جهاد',          description: 'تبیین مفهوم جهاد نفس، مراحل آن و روش‌های عملی برای مبارزه با نفس امّاره.',                 author: 'مفتی احمد رحمانی', date: '۵ حمل ۱۴۰۴',  meta: '۴۲ دقیقه', gradient: 'from-violet-900 to-purple-800' },
    { id: 6, title: 'غزوه احد — عبرت‌ها و درس‌ها',         description: 'تحلیل رویداد غزوه احد، علل شکست اولیه و درس‌های آن برای مسلمانان امروز.',                   author: 'دکتر محمد حسینی', date: '۴ حمل ۱۴۰۴',  meta: '۵۵ دقیقه', gradient: 'from-teal-900 to-cyan-800' },
];

const AUDIO: Item[] = [
    { id: 1, title: 'احکام جهاد از دیدگاه فقه اسلامی',    description: 'شرح مفصل احکام فقهی جهاد، انواع آن، شرایط وجوب و موانع آن بر اساس فقه اهل سنت.',           author: 'مفتی احمد رحمانی', date: '۹ حمل ۱۴۰۴',  meta: '۷۰ دقیقه', gradient: 'from-green-900 to-emerald-800' },
    { id: 2, title: 'زندگینامه خالد بن ولید',              description: 'روایت زندگی سردار بزرگ اسلام خالد بن ولید، فتوحات او و نقشش در گسترش اسلام.',               author: 'شیخ زهرا نوری',   date: '۸ حمل ۱۴۰۴',  meta: '۶۵ دقیقه', gradient: 'from-indigo-900 to-blue-800' },
    { id: 3, title: 'شهدای صدر اسلام',                     description: 'داستان شهدای اولیه اسلام، مقاومت آن‌ها در برابر آزار و شکنجه و نقش آن‌ها در تاریخ.',        author: 'دکتر محمد حسینی', date: '۷ حمل ۱۴۰۴',  meta: '۵۵ دقیقه', gradient: 'from-rose-900 to-pink-800' },
    { id: 4, title: 'جهاد علمی — قلم و بیان',              description: 'بررسی مفهوم جهاد علمی، اهمیت نشر علم اسلامی و نقش دانشمندان در دفاع از دین.',               author: 'مفتی احمد رحمانی', date: '۶ حمل ۱۴۰۴',  meta: '۴۸ دقیقه', gradient: 'from-amber-900 to-yellow-800' },
    { id: 5, title: 'حماسه فتح مکه',                       description: 'روایت صوتی فتح مکه مکرمه، بزرگترین پیروزی اسلام و درس‌های عبرت‌آموز آن.',                   author: 'شیخ عبدالله نوری',  date: '۵ حمل ۱۴۰۴',  meta: '۶۰ دقیقه', gradient: 'from-cyan-900 to-teal-800' },
    { id: 6, title: 'صبر و ثبات قدم در راه حق',            description: 'بیان اهمیت صبر در مسیر حق، داستان صابران از میان صحابه و تابعین.',                          author: 'شیخ زهرا نوری',   date: '۴ حمل ۱۴۰۴',  meta: '۴۵ دقیقه', gradient: 'from-slate-900 to-gray-800' },
];

const BOOKS: Item[] = [
    { id: 1, title: 'الجهاد في سبیل الله — ابن قدامه',    description: 'کتاب کلاسیک در احکام و فضائل جهاد از امام ابن قدامه، یکی از برجسته‌ترین فقهای حنبلی.',      author: 'ابن قدامه',         date: '۹ حمل ۱۴۰۴',  meta: '۲۸۰ صفحه', gradient: 'from-stone-900 to-neutral-800' },
    { id: 2, title: 'زاد المعاد — ابن قیم الجوزیه',       description: 'بخش‌هایی از کتاب زاد المعاد مربوط به غزوات پیامبر اکرم و احکام جهاد.',                      author: 'ابن قیم الجوزیه',  date: '۸ حمل ۱۴۰۴',  meta: '۴۵۰ صفحه', gradient: 'from-zinc-900 to-slate-800' },
    { id: 3, title: 'فقه السیره النبویه',                  description: 'کتابی جامع در سیره نبوی با تمرکز بر غزوات، سرایا و احکام جهاد در عهد نبوت.',                  author: 'محمد غزالی',        date: '۷ حمل ۱۴۰۴',  meta: '۳۸۰ صفحه', gradient: 'from-amber-900 to-orange-800' },
    { id: 4, title: 'صور من حیاة الصحابه',                 description: 'تصاویری از زندگی صحابه کرام، شجاعت‌ها، فداکاری‌ها و ایثارشان در راه خدا.',                  author: 'عبدالرحمن عزام',    date: '۶ حمل ۱۴۰۴',  meta: '۳۲۰ صفحه', gradient: 'from-green-900 to-teal-800' },
    { id: 5, title: 'أسد الله خالد بن الولید',             description: 'زندگینامه مفصل خالد بن ولید، فرمانده بی‌شکست اسلام و نبردهای تاریخی او.',                    author: 'محمود شیث خطاب',   date: '۵ حمل ۱۴۰۴',  meta: '۴۲۰ صفحه', gradient: 'from-blue-900 to-indigo-800' },
    { id: 6, title: 'الشهید في سبیل الله',                 description: 'رساله‌ای در فضیلت شهادت، احکام شهید و حقوق آن‌ها بر اساس قرآن و سنت.',                       author: 'شیخ عبدالله نوری',  date: '۴ حمل ۱۴۰۴',  meta: '۱۶۰ صفحه', gradient: 'from-rose-900 to-red-800' },
];

const TABS: { key: TabKey; label: string; icon: typeof PlayCircle; data: Item[] }[] = [
    { key: 'videos',   label: 'ویدیوها',  icon: PlayCircle, data: VIDEOS   },
    { key: 'audio',    label: 'صوت‌ها',   icon: Headphones, data: AUDIO    },
    { key: 'books',    label: 'کتاب‌ها',  icon: BookOpen,   data: BOOKS    },
];

const TAB_ICONS = { videos: PlayCircle, audio: Headphones, books: BookOpen };

function ItemCard({ item, type }: { item: Item; type: TabKey }) {
    const Icon = TAB_ICONS[type];
    const cta = { videos: 'تماشا', audio: 'گوش دادن', books: 'دانلود' }[type];

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
            <div className={`h-36 bg-gradient-to-br ${item.gradient} relative flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                <div className="relative z-10 w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="absolute top-3 end-3 bg-black/40 text-white text-[11px] px-2 py-0.5 rounded">
                    {item.meta}
                </span>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-[14px] text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#27ae60] transition-colors">
                    <a href="#">{item.title}</a>
                </h3>
                <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">
                    {item.description}
                </p>
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{item.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.date}</span>
                </div>
            </div>

            <a href="#" className="flex items-center justify-between px-4 py-2.5 bg-[#f0faf5] text-[#27ae60] text-[12px] font-bold hover:bg-[#27ae60] hover:text-white transition-colors border-t border-gray-100">
                <span>{cta}</span>
                <ChevronLeft className="w-3.5 h-3.5" />
            </a>
        </div>
    );
}

export function JihadList() {
    const [active, setActive] = useState<TabKey>('videos');
    const current = TABS.find((t) => t.key === active)!;

    return (
        <div>
            {/* Header stat */}
            <div className="flex items-center gap-3 mb-5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#27ae60]/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#27ae60]" />
                </div>
                <div>
                    <p className="text-[13px] font-bold text-gray-800">جهاد و شهادت</p>
                    <p className="text-[11px] text-gray-400">ویدیو، صوت، کتاب و مقاله</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-white rounded-xl border border-gray-100 shadow-sm p-1.5">
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setActive(key)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition-all ${
                            active === key
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
                    <ItemCard key={item.id} item={item} type={active} />
                ))}
            </div>
        </div>
    );
}
