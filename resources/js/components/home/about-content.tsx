import { BookOpen, Headphones, FileText, Video, Users, Globe, Target, Heart } from 'lucide-react';

const STATS = [
    { icon: BookOpen,   value: '۳٬۵۰۰+', label: 'کتاب دیجیتال'    },
    { icon: Headphones, value: '۱٬۲۰۰+', label: 'فایل صوتی'       },
    { icon: Video,      value: '۸۰۰+',   label: 'ویدیو آموزشی'    },
    { icon: FileText,   value: '۵۰۰+',   label: 'مقاله علمی'      },
    { icon: Users,      value: '۲۵٬۰۰۰+',label: 'کاربر فعال'      },
    { icon: Globe,      value: '۴۵+',    label: 'کشور پوشش داده'  },
];

const TEAM = [
    {
        name: 'مفتی احمد رحمانی',
        role: 'مؤسس و مدیر علمی',
        bio: 'دارای دکتری علوم اسلامی از دانشگاه مدینه منوره، با بیش از ۲۰ سال سابقه تدریس و تألیف.',
        gradient: 'from-emerald-700 to-teal-600',
    },
    {
        name: 'دکتر محمد حسینی',
        role: 'سرپرست بخش تحقیقات',
        bio: 'محقق تاریخ اسلام و نسخ خطی، نویسنده ده‌ها مقاله علمی در نشریات معتبر اسلامی.',
        gradient: 'from-blue-700 to-indigo-600',
    },
    {
        name: 'شیخ عبدالله نوری',
        role: 'مسئول محتوای دینی',
        bio: 'عالم دینی و واعظ، مسئول بازبینی و تأیید محتوای علمی پیش از انتشار در کتابخانه.',
        gradient: 'from-violet-700 to-purple-600',
    },
    {
        name: 'استاد فاطمه کریمی',
        role: 'مسئول بخش تعلیمی',
        bio: 'متخصص در تعلیم و تربیت اسلامی، طراح برنامه‌های آموزشی برای نسل جوان مسلمان.',
        gradient: 'from-rose-700 to-pink-600',
    },
];

const VALUES = [
    {
        icon: Target,
        title: 'رسالت ما',
        body: 'کتابخانه رسالت با هدف فراهم‌آوری منابع علمی معتبر اسلامی به زبان دری تأسیس شده است. ما باور داریم که دسترسی آسان به دانش اسلامی حق هر مسلمان فارسی‌زبان است.',
    },
    {
        icon: Heart,
        title: 'ارزش‌های ما',
        body: 'اعتماد، صداقت علمی، و خدمت خالصانه به امت اسلامی محور همه فعالیت‌های ماست. محتوا تنها پس از بازبینی دقیق توسط علمای معتمد منتشر می‌شود.',
    },
    {
        icon: Globe,
        title: 'چشم‌انداز ما',
        body: 'تبدیل شدن به بزرگترین منبع دیجیتال علوم اسلامی به زبان دری در جهان، با پوشش همه مسلمانان فارسی‌زبان افغانستان، ایران، تاجیکستان و دیاسپورا.',
    },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-7 bg-[#27ae60] rounded-full" />
            <h2 className="text-[20px] font-bold text-gray-900">{children}</h2>
        </div>
    );
}

export function AboutContent() {
    return (
        <div className="space-y-10">
            {/* Hero banner */}
            <div className="bg-gradient-to-br from-[#1a252f] to-[#0d3320] rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #27ae60 1px, transparent 1px), radial-gradient(circle at 80% 20%, #27ae60 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                    <img src="/falogo.png" alt="کتابخانه رسالت" className="h-24 w-auto object-contain drop-shadow-xl" />
                    <div>
                        <h1 className="text-[24px] font-bold mb-2">کتابخانه رسالت</h1>
                        <p className="text-white/80 text-[14px] leading-relaxed max-w-lg">
                            مرکز دیجیتال علوم اسلامی به زبان دری — در خدمت مسلمانان فارسی‌زبان سراسر جهان از سال ۱۳۹۸ تا کنون.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div>
                <SectionTitle>کتابخانه در اعداد</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {STATS.map(({ icon: Icon, value, label }) => (
                        <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center gap-2 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-lg bg-[#27ae60]/10 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-[#27ae60]" />
                            </div>
                            <span className="text-[22px] font-bold text-gray-900">{value}</span>
                            <span className="text-[12px] text-gray-500">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mission / Values */}
            <div>
                <SectionTitle>رسالت، ارزش‌ها و چشم‌انداز</SectionTitle>
                <div className="space-y-4">
                    {VALUES.map(({ icon: Icon, title, body }) => (
                        <div key={title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-[#27ae60]/10 flex items-center justify-center mt-0.5">
                                <Icon className="w-5 h-5 text-[#27ae60]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[15px] text-gray-900 mb-1.5">{title}</h3>
                                <p className="text-[13px] text-gray-600 leading-relaxed">{body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team */}
            <div>
                <SectionTitle>تیم علمی</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {TEAM.map((member) => (
                        <div key={member.name} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                            <div className={`h-20 bg-gradient-to-br ${member.gradient} relative`} />
                            <div className="px-5 pb-5 pt-4">
                                <h3 className="font-bold text-[15px] text-gray-900 mb-0.5">{member.name}</h3>
                                <p className="text-[12px] text-[#27ae60] font-bold mb-2">{member.role}</p>
                                <p className="text-[12px] text-gray-500 leading-relaxed">{member.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
