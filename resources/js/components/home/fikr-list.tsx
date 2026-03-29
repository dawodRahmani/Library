import { useState } from 'react';
import { PlayCircle, Headphones, BookOpen, FileText, Clock, User, ChevronLeft, Brain } from 'lucide-react';

type TabKey = 'videos' | 'audio' | 'books' | 'articles';

interface Item {
    id: number;
    title: string;
    description: string;
    author: string;
    date: string;
    meta: string;
    gradient: string;
}

/* ── Mock data ───────────────────────────────────────────── */
const VIDEOS: Item[] = [
    { id: 1, title: 'اصول عقیده اهل سنت و الجماعت',         description: 'شرح جامع اصول عقیده اهل سنت، ارکان ایمان و اهمیت پیروی از منهج سلف صالح.',              author: 'شیخ عبدالله نوری',  date: '۱۰ حمل ۱۴۰۴', meta: '۵۵ دقیقه', gradient: 'from-indigo-900 to-blue-800' },
    { id: 2, title: 'توحید — بنیاد اسلام',                  description: 'بررسی انواع توحید (ربوبیت، الوهیت، اسماء و صفات) و اهمیت آن در زندگی مسلمان.',           author: 'مفتی احمد رحمانی', date: '۹ حمل ۱۴۰۴',  meta: '۶۰ دقیقه', gradient: 'from-teal-900 to-emerald-800' },
    { id: 3, title: 'شرک و انواع آن در جامعه امروز',        description: 'تحلیل مفهوم شرک، مصادیق آن در زندگی مدرن و راه‌های پرهیز از آن در روزگار معاصر.',         author: 'دکتر محمد حسینی', date: '۸ حمل ۱۴۰۴',  meta: '۴۸ دقیقه', gradient: 'from-amber-900 to-orange-800' },
    { id: 4, title: 'ایمان به غیب — حقایق و شبهات',         description: 'اثبات عقلی و نقلی ایمان به غیب، پاسخ به شبهات الحادی و تقویت یقین.',                    author: 'شیخ عبدالله نوری',  date: '۷ حمل ۱۴۰۴',  meta: '۵۲ دقیقه', gradient: 'from-violet-900 to-purple-800' },
    { id: 5, title: 'بدعت و سنت — تشخیص و پرهیز',           description: 'تعریف بدعت، انواع آن، حکم شرعی و راه‌های تشخیص آن از سنت نبوی.',                        author: 'مفتی احمد رحمانی', date: '۶ حمل ۱۴۰۴',  meta: '۴۵ دقیقه', gradient: 'from-rose-900 to-red-800' },
    { id: 6, title: 'تقدیر الهی و اراده انسان',             description: 'تبیین مفهوم قضا و قدر در اسلام، رابطه آن با اراده آزاد انسان و تأثیرش بر رفتار.',         author: 'دکتر محمد حسینی', date: '۵ حمل ۱۴۰۴',  meta: '۵۸ دقیقه', gradient: 'from-cyan-900 to-teal-800' },
];

const AUDIO: Item[] = [
    { id: 1, title: 'شرح ثلاثة الأصول',                     description: 'شرح تفصیلی رساله ثلاثة الأصول شیخ محمد بن عبدالوهاب، پایه‌های عقیده اسلامی.',           author: 'شیخ عبدالله نوری',  date: '۱۰ حمل ۱۴۰۴', meta: '۹۰ دقیقه', gradient: 'from-green-900 to-emerald-800' },
    { id: 2, title: 'العقیدة الواسطیه — ابن تیمیه',         description: 'شرح صوتی کتاب العقیدة الواسطیه، یکی از مهم‌ترین متون عقیدتی اهل سنت.',                  author: 'مفتی احمد رحمانی', date: '۹ حمل ۱۴۰۴',  meta: '۱۲۰ دقیقه', gradient: 'from-blue-900 to-indigo-800' },
    { id: 3, title: 'اسماء و صفات الهی',                    description: 'بیان اسماء حسنای خداوند و صفات جلال و جمال او، با تفسیر قرآنی و حدیثی.',                author: 'دکتر محمد حسینی', date: '۸ حمل ۱۴۰۴',  meta: '۷۵ دقیقه', gradient: 'from-amber-900 to-yellow-800' },
    { id: 4, title: 'نبوت و رسالت در اسلام',                description: 'اثبات نبوت، خصوصیات پیامبران، ختم نبوت و محبت به پیامبر اکرم صلی الله علیه وسلم.',       author: 'شیخ عبدالله نوری',  date: '۷ حمل ۱۴۰۴',  meta: '۶۵ دقیقه', gradient: 'from-rose-900 to-pink-800' },
    { id: 5, title: 'آخرت — بهشت، جهنم و قیامت',           description: 'توصیف قرآنی و حدیثی از عالم آخرت، روز قیامت، بهشت و جهنم برای تقویت یقین.',            author: 'مفتی احمد رحمانی', date: '۶ حمل ۱۴۰۴',  meta: '۸۰ دقیقه', gradient: 'from-violet-900 to-indigo-800' },
    { id: 6, title: 'محبت خدا و ترس از خدا',                description: 'توازن میان خوف و رجاء در عبادت، محبت الهی و اثر آن در پاک‌سازی نفس.',                  author: 'دکتر محمد حسینی', date: '۵ حمل ۱۴۰۴',  meta: '۵۵ دقیقه', gradient: 'from-slate-900 to-gray-800' },
];

const BOOKS: Item[] = [
    { id: 1, title: 'لمعة الاعتقاد — ابن قدامه',            description: 'رساله کوتاه و جامع در عقیده اهل سنت، مناسب برای مبتدیان و آموختن پایه‌های ایمان.',       author: 'ابن قدامه',         date: '۱۰ حمل ۱۴۰۴', meta: '۸۰ صفحه',  gradient: 'from-stone-900 to-neutral-800' },
    { id: 2, title: 'شرح العقیدة الطحاویه',                  description: 'شرح مفصل متن العقیدة الطحاویه، یکی از معتبرترین متون عقیدتی در مذاهب اهل سنت.',         author: 'ابن ابی العز',      date: '۹ حمل ۱۴۰۴',  meta: '۵۵۰ صفحه', gradient: 'from-zinc-900 to-slate-800' },
    { id: 3, title: 'درء تعارض العقل والنقل',                description: 'اثر علمی ابن تیمیه در اثبات عدم تعارض عقل و نقل و رد شبهات فلاسفه.',                   author: 'ابن تیمیه',         date: '۸ حمل ۱۴۰۴',  meta: '۴۸۰ صفحه', gradient: 'from-amber-900 to-brown-800' },
    { id: 4, title: 'اعتقاد اهل السنه — الاجری',             description: 'کتاب کلاسیک در بیان معتقدات اهل سنت و الجماعت از عالم قرن چهارم هجری.',                author: 'الاجری',            date: '۷ حمل ۱۴۰۴',  meta: '۳۲۰ صفحه', gradient: 'from-green-900 to-teal-800' },
    { id: 5, title: 'مسائل الجاهلیة — محمد بن عبدالوهاب',   description: 'کتابی در بیان مسائل جاهلی که اسلام آن‌ها را ابطال کرده و اهمیت پایبندی به شریعت.',      author: 'محمد بن عبدالوهاب', date: '۶ حمل ۱۴۰۴',  meta: '۱۵۰ صفحه', gradient: 'from-blue-900 to-indigo-800' },
    { id: 6, title: 'الفرقان بین اولیاء الرحمن و اولیاء الشیطان', description: 'اثری از ابن تیمیه در تمییز اولیاء خدا از اولیاء شیطان با معیارهای قرآنی.', author: 'ابن تیمیه',         date: '۵ حمل ۱۴۰۴',  meta: '۲۰۰ صفحه', gradient: 'from-rose-900 to-red-800' },
];

const ARTICLES: Item[] = [
    { id: 1, title: 'عقیده سلفی — منهج و روش',              description: 'تعریف منهج سلفی، اصول آن و تفاوت آن با انحرافات عقیدتی در دنیای امروز.',                  author: 'دکتر محمد حسینی', date: '۱۰ حمل ۱۴۰۴', meta: '۱۵ دقیقه', gradient: 'from-emerald-900 to-green-800' },
    { id: 2, title: 'الحادیت جدید و پاسخ اسلامی',           description: 'نقد الحاد نوین، شبهات رایج آن و پاسخ‌های عقلی و نقلی اسلام به این تحدیات.',             author: 'مفتی احمد رحمانی', date: '۹ حمل ۱۴۰۴',  meta: '۱۸ دقیقه', gradient: 'from-blue-900 to-cyan-800' },
    { id: 3, title: 'تصوف — نقد و بررسی',                   description: 'بررسی تاریخ تصوف، انحرافات آن از تعالیم اسلامی و تفاوت آن با زهد مشروع.',              author: 'شیخ عبدالله نوری',  date: '۸ حمل ۱۴۰۴',  meta: '۲۰ دقیقه', gradient: 'from-violet-900 to-purple-800' },
    { id: 4, title: 'عقل و وحی در اسلام',                   description: 'رابطه عقل و وحی در معرفت اسلامی، محدوده عقل و جایگاه نص در حل مسائل عقیدتی.',           author: 'دکتر محمد حسینی', date: '۷ حمل ۱۴۰۴',  meta: '۱۴ دقیقه', gradient: 'from-amber-900 to-stone-800' },
    { id: 5, title: 'حقوق بشر از دیدگاه اسلام',             description: 'مقایسه حقوق بشر اسلامی با اعلامیه جهانی، نقاط مشترک و تفاوت‌های اساسی.',               author: 'مفتی احمد رحمانی', date: '۶ حمل ۱۴۰۴',  meta: '۱۶ دقیقه', gradient: 'from-teal-900 to-emerald-800' },
    { id: 6, title: 'هویت اسلامی در دنیای مدرن',            description: 'چگونگی حفظ هویت اسلامی در برابر چالش‌های مدرنیسم، سکولاریسم و فرهنگ غربی.',            author: 'شیخ زهرا نوری',   date: '۵ حمل ۱۴۰۴',  meta: '۱۲ دقیقه', gradient: 'from-rose-900 to-pink-800' },
];

const TABS: { key: TabKey; label: string; icon: typeof PlayCircle; data: Item[] }[] = [
    { key: 'videos',   label: 'ویدیوها',  icon: PlayCircle, data: VIDEOS   },
    { key: 'audio',    label: 'صوت‌ها',   icon: Headphones, data: AUDIO    },
    { key: 'books',    label: 'کتاب‌ها',  icon: BookOpen,   data: BOOKS    },
    { key: 'articles', label: 'مقاله‌ها', icon: FileText,   data: ARTICLES },
];

const TAB_ICONS = { videos: PlayCircle, audio: Headphones, books: BookOpen, articles: FileText };

function ItemCard({ item, type }: { item: Item; type: TabKey }) {
    const Icon = TAB_ICONS[type];
    const cta = { videos: 'تماشا', audio: 'گوش دادن', books: 'دانلود', articles: 'خواندن' }[type];

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

export function FikrList() {
    const [active, setActive] = useState<TabKey>('videos');
    const current = TABS.find((t) => t.key === active)!;

    return (
        <div>
            {/* Header stat */}
            <div className="flex items-center gap-3 mb-5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#27ae60]/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-[#27ae60]" />
                </div>
                <div>
                    <p className="text-[13px] font-bold text-gray-800">فکر و عقیده</p>
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
