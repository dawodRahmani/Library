import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    BookOpen, Headphones, FileText, Video, Users, Globe,
    Target, Heart, Star, Award, School, Library, Landmark, Lightbulb,
} from 'lucide-react';

// ── Icon registry ─────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
    BookOpen, Headphones, FileText, Video, Users, Globe,
    Target, Heart, Star, Award, School, Library, Landmark, Lightbulb,
};
function DynIcon({ name, className }: { name: string; className?: string }) {
    const Icon = ICON_MAP[name] ?? Globe;
    return <Icon className={className} />;
}

// ── Default data (shown when DB is empty) ─────────────────────────────────────
const DEFAULT_HERO = {
    title:    { da: 'کتابخانه رسالت',  en: 'Resalat Library' },
    subtitle: {
        da: 'مرکز دیجیتال علوم اسلامی به زبان دری — در خدمت مسلمانان فارسی‌زبان سراسر جهان از سال ۱۳۹۸ تا کنون.',
        en: 'Digital centre for Islamic sciences in Dari — serving Dari-speaking Muslims worldwide since 2019.',
    },
};

const DEFAULT_STATS = [
    { icon: 'BookOpen',   value: '۳٬۵۰۰+', label: { da: 'کتاب دیجیتال',    en: 'Digital Books'    } },
    { icon: 'Headphones', value: '۱٬۲۰۰+', label: { da: 'فایل صوتی',       en: 'Audio Files'      } },
    { icon: 'Video',      value: '۸۰۰+',   label: { da: 'ویدیو آموزشی',    en: 'Videos'           } },
    { icon: 'FileText',   value: '۵۰۰+',   label: { da: 'مقاله علمی',      en: 'Articles'         } },
    { icon: 'Users',      value: '۲۵٬۰۰۰+',label: { da: 'کاربر فعال',      en: 'Active Users'     } },
    { icon: 'Globe',      value: '۴۵+',    label: { da: 'کشور پوشش داده',  en: 'Countries Covered'} },
];

const DEFAULT_VALUES = [
    {
        icon:  'Target',
        title: { da: 'رسالت ما',       en: 'Our Mission'  },
        body:  {
            da: 'کتابخانه رسالت با هدف فراهم‌آوری منابع علمی معتبر اسلامی به زبان دری تأسیس شده است.',
            en: 'Resalat Library was founded to provide authentic Islamic academic resources in the Dari language.',
        },
    },
    {
        icon:  'Heart',
        title: { da: 'ارزش‌های ما',    en: 'Our Values'   },
        body:  {
            da: 'اعتماد، صداقت علمی، و خدمت خالصانه به امت اسلامی محور همه فعالیت‌های ماست.',
            en: 'Trust, academic integrity, and sincere service to the Muslim community drive everything we do.',
        },
    },
    {
        icon:  'Globe',
        title: { da: 'چشم‌انداز ما',   en: 'Our Vision'   },
        body:  {
            da: 'تبدیل شدن به بزرگترین منبع دیجیتال علوم اسلامی به زبان دری در جهان.',
            en: 'To become the largest digital source of Islamic sciences in the Dari language in the world.',
        },
    },
];

const DEFAULT_TEAM: TeamMember[] = [
    { name: 'مفتی احمد رحمانی',  role: { da: 'مؤسس و مدیر علمی',        en: 'Founder & Scientific Director'     }, bio: { da: 'دارای دکتری علوم اسلامی از دانشگاه مدینه منوره.', en: 'PhD in Islamic Sciences from Madinah University.' }, gradient: 'from-emerald-700 to-teal-600'   },
    { name: 'دکتر محمد حسینی',   role: { da: 'سرپرست بخش تحقیقات',       en: 'Head of Research'                   }, bio: { da: 'محقق تاریخ اسلام و نسخ خطی.',               en: 'Researcher in Islamic history and manuscripts.'   }, gradient: 'from-blue-700 to-indigo-600'    },
    { name: 'شیخ عبدالله نوری',  role: { da: 'مسئول محتوای دینی',        en: 'Religious Content Manager'         }, bio: { da: 'عالم دینی و واعظ، مسئول بازبینی محتوا.',     en: 'Islamic scholar responsible for content review.'  }, gradient: 'from-violet-700 to-purple-600'  },
    { name: 'استاد فاطمه کریمی', role: { da: 'مسئول بخش تعلیمی',         en: 'Education Department Lead'         }, bio: { da: 'متخصص در تعلیم و تربیت اسلامی.',             en: 'Specialist in Islamic education programmes.'      }, gradient: 'from-rose-700 to-pink-600'      },
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface ML       { da: string; en: string }
interface Stat     { icon: string; value: string; label: ML }
interface Value    { icon: string; title: ML; body: ML }
interface TeamMember { name: string; role: ML; bio: ML; gradient: string }
interface AboutHero  { title: ML; subtitle: ML }
interface SharedProps {
    siteSettings?: {
        about_hero?:   AboutHero;
        about_stats?:  Stat[];
        about_values?: Value[];
        about_team?:   TeamMember[];
    };
    [key: string]: unknown;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-7 bg-[#27ae60] rounded-full" />
            <h2 className="text-[20px] font-bold text-gray-900">{children}</h2>
        </div>
    );
}

export function AboutContent() {
    const { i18n, t } = useTranslation();
    const locale = ['da', 'en', 'ar', 'tg'].includes(i18n.language) ? i18n.language : 'da';

    const settings = usePage<SharedProps>().props.siteSettings ?? {};

    const hero    = settings.about_hero   ?? DEFAULT_HERO;
    const stats   = settings.about_stats  ?? DEFAULT_STATS;
    const values  = settings.about_values ?? DEFAULT_VALUES;
    const team    = settings.about_team   ?? DEFAULT_TEAM;

    const l = (ml: ML) => ml[locale] || ml.da || ml.en || '';

    return (
        <div className="space-y-10">
            {/* Hero banner */}
            <div className="bg-gradient-to-br from-[#1a252f] to-[#0d3320] rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #27ae60 1px, transparent 1px), radial-gradient(circle at 80% 20%, #27ae60 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                    <img src="/falogo.png" alt="کتابخانه رسالت" className="h-24 w-auto object-contain drop-shadow-xl" />
                    <div>
                        <h1 className="text-[24px] font-bold mb-2">{l(hero.title)}</h1>
                        <p className="text-white/80 text-[14px] leading-relaxed max-w-lg">{l(hero.subtitle)}</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            {stats.length > 0 && (
                <div>
                    <SectionTitle>{t('about.statsTitle', 'کتابخانه در اعداد')}</SectionTitle>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {stats.map((s, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center gap-2 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-lg bg-[#27ae60]/10 flex items-center justify-center">
                                    <DynIcon name={s.icon} className="w-5 h-5 text-[#27ae60]" />
                                </div>
                                <span className="text-[22px] font-bold text-gray-900">{s.value}</span>
                                <span className="text-[12px] text-gray-500">{l(s.label)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Mission / Values */}
            {values.length > 0 && (
                <div>
                    <SectionTitle>{t('about.valuesTitle', 'رسالت، ارزش‌ها و چشم‌انداز')}</SectionTitle>
                    <div className="space-y-4">
                        {values.map((v, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex gap-4">
                                <div className="shrink-0 w-10 h-10 rounded-lg bg-[#27ae60]/10 flex items-center justify-center mt-0.5">
                                    <DynIcon name={v.icon} className="w-5 h-5 text-[#27ae60]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[15px] text-gray-900 mb-1.5">{l(v.title)}</h3>
                                    <p className="text-[13px] text-gray-600 leading-relaxed">{l(v.body)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Team */}
            {team.length > 0 && (
                <div>
                    <SectionTitle>{t('about.teamTitle', 'تیم علمی')}</SectionTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {team.map((member, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                <div className={`h-20 bg-gradient-to-br ${member.gradient} relative`} />
                                <div className="px-5 pb-5 pt-4">
                                    <h3 className="font-bold text-[15px] text-gray-900 mb-0.5">{member.name}</h3>
                                    <p className="text-[12px] text-[#27ae60] font-bold mb-2">{l(member.role)}</p>
                                    <p className="text-[12px] text-gray-500 leading-relaxed">{l(member.bio)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
