import { Head, router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import {
    Globe, Share2, Radio, FileText, ImageIcon, Info, QrCode,
    Save, Plus, Trash2, Upload, X,
    Facebook, Youtube,
    BookOpen, Headphones, Video, Users, Target, Heart,
    Star, Award, School, Library, Landmark, Lightbulb,
} from 'lucide-react';
import { Telegram, WhatsApp } from '@/components/icons/brand-icons';
import type { BreadcrumbItem } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────
interface SocialLink  { platform: string; url: string; count: string }
interface TickerItem  { da: string; en: string; ar?: string; tg?: string }
interface ML          { da: string; en: string; ar?: string; tg?: string }
interface AboutStat   { icon: string; value: string; label: ML }
interface AboutValue  { icon: string; title: ML; body: ML }
interface AboutMember { name: string; role: ML; bio: ML; gradient: string }
interface AboutHero   { title: ML; subtitle: ML }
interface AboutIntro  { title: ML; body: ML }

interface Settings {
    site_name?:        ML;
    site_tagline?:     ML;
    contact_email?:    string;
    contact_phone?:    string;
    contact_address?:  ML;
    contact_hours?:    ML;
    social_links?:     SocialLink[];
    ticker_items?:     TickerItem[];
    footer_about?:     ML;
    about_hero?:       AboutHero;
    about_stats?:      AboutStat[];
    about_stats_hidden?: boolean;
    about_intro?:      AboutIntro;
    about_intro_hidden?: boolean;
    about_values?:     AboutValue[];
    about_values_hidden?: boolean;
    about_team?:       AboutMember[];
    contact_qr_image?:  string | null;
    contact_qr_link?:   string;
    contact_qr_title?:  ML;
    contact_qr_hidden?: boolean;
}

interface SharedProps { logoUrl?: string | null; [key: string]: unknown }
interface Props { settings: Settings }

// ── Constants ─────────────────────────────────────────────────────────────────
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'تنظیمات سایت', href: '/admin/site-settings' },
];

const PLATFORM_ICONS: Record<string, React.ElementType> = {
    facebook: Facebook, telegram: Telegram, youtube: Youtube, whatsapp: WhatsApp,
};
const PLATFORM_LABELS: Record<string, string> = {
    facebook: 'فیسبوک', telegram: 'تلگرام', youtube: 'یوتیوب', whatsapp: 'واتساپ',
};

const ICON_OPTIONS = [
    { value: 'BookOpen',   label: 'کتاب',        Icon: BookOpen   },
    { value: 'Headphones', label: 'صوت',          Icon: Headphones },
    { value: 'Video',      label: 'ویدیو',        Icon: Video      },
    { value: 'FileText',   label: 'مقاله',        Icon: FileText   },
    { value: 'Users',      label: 'کاربران',      Icon: Users      },
    { value: 'Globe',      label: 'جهانی',        Icon: Globe      },
    { value: 'Target',     label: 'هدف',          Icon: Target     },
    { value: 'Heart',      label: 'قلب',          Icon: Heart      },
    { value: 'Star',       label: 'ستاره',        Icon: Star       },
    { value: 'Award',      label: 'جایزه',        Icon: Award      },
    { value: 'School',     label: 'مدرسه',        Icon: School     },
    { value: 'Library',    label: 'کتابخانه',     Icon: Library    },
    { value: 'Landmark',   label: 'بنا',          Icon: Landmark   },
    { value: 'Lightbulb',  label: 'ایده',         Icon: Lightbulb  },
];

const GRADIENT_OPTIONS = [
    { value: 'from-emerald-700 to-teal-600',  label: 'سبز'    },
    { value: 'from-blue-700 to-indigo-600',   label: 'آبی'    },
    { value: 'from-violet-700 to-purple-600', label: 'بنفش'   },
    { value: 'from-rose-700 to-pink-600',     label: 'صورتی'  },
    { value: 'from-amber-700 to-orange-600',  label: 'نارنجی' },
    { value: 'from-slate-700 to-gray-600',    label: 'خاکستری'},
];

type Tab = 'general' | 'social' | 'ticker' | 'footer' | 'about' | 'contact';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'general', label: 'عمومی',             icon: Globe    },
    { id: 'about',   label: 'درباره ما',          icon: Info     },
    { id: 'social',  label: 'شبکه‌های اجتماعی',  icon: Share2   },
    { id: 'contact', label: 'تماس با ما',          icon: QrCode   },
    { id: 'ticker',  label: 'خبرتیکر',            icon: Radio    },
    { id: 'footer',  label: 'فوتر',               icon: FileText },
];

// ── Default about data ────────────────────────────────────────────────────────
const DEF_ABOUT_HERO: AboutHero = {
    title:    { da: 'کتابخانه رسالت',  en: 'Resalat Library', ar: 'مكتبة رسالت' },
    subtitle: { da: 'مرکز دیجیتال علوم اسلامی به زبان دری.', en: 'Digital centre for Islamic sciences in Dari.', ar: 'مركز رقمي لعلوم إسلامية باللغة الدرية.' },
};
const DEF_ABOUT_STATS: AboutStat[] = [
    { icon: 'BookOpen',   value: '۳٬۵۰۰+', label: { da: 'کتاب دیجیتال',   en: 'Digital Books',     ar: 'كتب رقمية'       } },
    { icon: 'Headphones', value: '۱٬۲۰۰+', label: { da: 'فایل صوتی',      en: 'Audio Files',       ar: 'ملفات صوتية'     } },
    { icon: 'Video',      value: '۸۰۰+',   label: { da: 'ویدیو آموزشی',   en: 'Videos',            ar: 'مقاطع فيديو'     } },
    { icon: 'FileText',   value: '۵۰۰+',   label: { da: 'مقاله علمی',     en: 'Articles',          ar: 'مقالات علمية'    } },
    { icon: 'Users',      value: '۲۵٬۰۰۰+',label: { da: 'کاربر فعال',     en: 'Active Users',      ar: 'مستخدم نشط'      } },
    { icon: 'Globe',      value: '۴۵+',    label: { da: 'کشور پوشش داده', en: 'Countries Covered',  ar: 'دولة مشمولة'     } },
];
const DEF_ABOUT_VALUES: AboutValue[] = [
    { icon: 'Target', title: { da: 'رسالت ما',     en: 'Our Mission', ar: 'رسالتنا'   }, body: { da: '', en: '', ar: '' } },
    { icon: 'Heart',  title: { da: 'ارزش‌های ما',  en: 'Our Values',  ar: 'قيمنا'     }, body: { da: '', en: '', ar: '' } },
    { icon: 'Globe',  title: { da: 'چشم‌انداز ما', en: 'Our Vision',  ar: 'رؤيتنا'    }, body: { da: '', en: '', ar: '' } },
];
const DEF_ABOUT_TEAM: AboutMember[] = [];
const DEF_ABOUT_INTRO: AboutIntro = {
    title: { da: '', en: '', ar: '', tg: '' },
    body:  { da: '', en: '', ar: '', tg: '' },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function SiteSettingsIndex({ settings }: Props) {
    const { logoUrl } = usePage<SharedProps>().props;

    const [tab, setTab]           = useState<Tab>('general');
    const [errors, setErrors]     = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    // Logo
    const logoInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview]     = useState<string | null>(null);
    const [logoProcessing, setLogoProcessing] = useState(false);

    // General
    const [general, setGeneral] = useState({
        site_name:       { da: settings.site_name?.da        ?? '', en: settings.site_name?.en        ?? '', ar: settings.site_name?.ar        ?? '' },
        site_tagline:    { da: settings.site_tagline?.da     ?? '', en: settings.site_tagline?.en     ?? '', ar: settings.site_tagline?.ar     ?? '' },
        contact_email:   settings.contact_email   ?? '',
        contact_phone:   settings.contact_phone   ?? '',
        contact_address: { da: settings.contact_address?.da  ?? '', en: settings.contact_address?.en  ?? '', ar: settings.contact_address?.ar  ?? '' },
        contact_hours:   { da: settings.contact_hours?.da    ?? '', en: settings.contact_hours?.en    ?? '', ar: settings.contact_hours?.ar    ?? '' },
    });

    // Social
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
        const existing = settings.social_links ?? [];
        const order = ['facebook', 'telegram', 'youtube', 'whatsapp'] as const;
        return order.map((p) => {
            const found = existing.find((s) => s.platform === p);
            return found ?? { platform: p, url: '#', count: '' };
        });
    });

    // Ticker
    const [tickerItems, setTickerItems] = useState<TickerItem[]>(
        settings.ticker_items ?? [{ da: '', en: '', ar: '', tg: '' }]
    );

    // Footer
    const [footerAbout, setFooterAbout] = useState<ML>({
        da: settings.footer_about?.da ?? '',
        en: settings.footer_about?.en ?? '',
        ar: settings.footer_about?.ar ?? '',
        tg: settings.footer_about?.tg ?? '',
    });

    // About
    const [aboutHero, setAboutHero] = useState<AboutHero>(settings.about_hero ?? DEF_ABOUT_HERO);
    const [aboutStats, setAboutStats]   = useState<AboutStat[]>(settings.about_stats   ?? DEF_ABOUT_STATS);
    const [aboutStatsHidden, setAboutStatsHidden] = useState<boolean>(!!settings.about_stats_hidden);
    const [aboutIntro, setAboutIntro] = useState<AboutIntro>(settings.about_intro ?? DEF_ABOUT_INTRO);
    const [aboutIntroHidden, setAboutIntroHidden] = useState<boolean>(!!settings.about_intro_hidden);
    const [aboutValues, setAboutValues] = useState<AboutValue[]>(settings.about_values ?? DEF_ABOUT_VALUES);
    const [aboutValuesHidden, setAboutValuesHidden] = useState<boolean>(!!settings.about_values_hidden);
    const [aboutTeam, setAboutTeam]     = useState<AboutMember[]>(settings.about_team   ?? DEF_ABOUT_TEAM);

    // Contact QR
    const [contactQrLink, setContactQrLink]     = useState<string>(settings.contact_qr_link ?? '');
    const [contactQrTitle, setContactQrTitle]   = useState<ML>(settings.contact_qr_title ?? { da: '', en: '', ar: '', tg: '' });
    const [contactQrHidden, setContactQrHidden] = useState<boolean>(!!settings.contact_qr_hidden);
    const qrInputRef = useRef<HTMLInputElement>(null);
    const [qrPreview, setQrPreview]     = useState<string | null>(null);
    const [qrProcessing, setQrProcessing] = useState(false);

    // ── Save ──────────────────────────────────────────────────────────────────
    function save() {
        setProcessing(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: any = {
            ...general,
            social_links:  socialLinks,
            ticker_items:  tickerItems,
            footer_about:  footerAbout,
            about_hero:    aboutHero,
            about_stats:   aboutStats,
            about_stats_hidden: aboutStatsHidden,
            about_intro:   aboutIntro,
            about_intro_hidden: aboutIntroHidden,
            about_values:  aboutValues,
            about_values_hidden: aboutValuesHidden,
            about_team:    aboutTeam,
            contact_qr_link:   contactQrLink,
            contact_qr_title:  contactQrTitle,
            contact_qr_hidden: contactQrHidden,
        };
        router.post('/admin/site-settings', payload, {
            onError:  (e) => setErrors(e),
            onFinish: () => setProcessing(false),
        });
    }

    // ── Logo ──────────────────────────────────────────────────────────────────
    function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoPreview(URL.createObjectURL(file));
    }
    function uploadLogo() {
        const file = logoInputRef.current?.files?.[0];
        if (!file) return;
        setLogoProcessing(true);
        const form = new FormData();
        form.append('logo', file);
        router.post('/admin/site-settings/logo', form, {
            forceFormData: true,
            onSuccess: () => setLogoPreview(null),
            onFinish:  () => setLogoProcessing(false),
        });
    }
    function removeLogo() {
        if (!confirm('آیا مطمئن هستید که می‌خواهید لوگو را حذف کنید؟')) return;
        router.delete('/admin/site-settings/logo');
    }

    // ── Contact QR image ──────────────────────────────────────────────────────
    function onQrChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setQrPreview(URL.createObjectURL(file));
    }
    function uploadQr() {
        const file = qrInputRef.current?.files?.[0];
        if (!file) return;
        setQrProcessing(true);
        const form = new FormData();
        form.append('image', file);
        router.post('/admin/site-settings/contact-qr', form, {
            forceFormData: true,
            onSuccess: () => setQrPreview(null),
            onFinish:  () => setQrProcessing(false),
        });
    }
    function removeQr() {
        if (!confirm('آیا مطمئن هستید که می‌خواهید تصویر QR را حذف کنید؟')) return;
        router.delete('/admin/site-settings/contact-qr');
    }

    // ── Ticker helpers ────────────────────────────────────────────────────────
    function addTicker()  { setTickerItems([...tickerItems, { da: '', en: '', ar: '', tg: '' }]); }
    function removeTicker(i: number) { setTickerItems(tickerItems.filter((_, idx) => idx !== i)); }
    function updateTicker(i: number, field: 'da' | 'en' | 'ar' | 'tg', val: string) {
        setTickerItems(tickerItems.map((t, idx) => idx === i ? { ...t, [field]: val } : t));
    }

    // ── Social helpers ────────────────────────────────────────────────────────
    function updateSocial(i: number, field: keyof SocialLink, val: string) {
        setSocialLinks(socialLinks.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
    }

    // ── About stat helpers ────────────────────────────────────────────────────
    function addStat()    { setAboutStats([...aboutStats, { icon: 'BookOpen', value: '', label: { da: '', en: '', ar: '' } }]); }
    function removeStat(i: number) { setAboutStats(aboutStats.filter((_, idx) => idx !== i)); }
    function updateStat(i: number, patch: Partial<AboutStat>) {
        setAboutStats(aboutStats.map((s, idx) => idx === i ? { ...s, ...patch } : s));
    }
    function updateStatLabel(i: number, field: 'da' | 'en' | 'ar', val: string) {
        setAboutStats(aboutStats.map((s, idx) => idx === i ? { ...s, label: { ...s.label, [field]: val } } : s));
    }

    // ── About value helpers ───────────────────────────────────────────────────
    function addValue()   { setAboutValues([...aboutValues, { icon: 'Target', title: { da: '', en: '', ar: '' }, body: { da: '', en: '', ar: '' } }]); }
    function removeValue(i: number) { setAboutValues(aboutValues.filter((_, idx) => idx !== i)); }
    function updateValue(i: number, patch: Partial<AboutValue>) {
        setAboutValues(aboutValues.map((v, idx) => idx === i ? { ...v, ...patch } : v));
    }
    function updateValueML(i: number, field: 'title' | 'body', lang: 'da' | 'en' | 'ar', val: string) {
        setAboutValues(aboutValues.map((v, idx) => idx === i ? { ...v, [field]: { ...v[field], [lang]: val } } : v));
    }

    // ── About team helpers ────────────────────────────────────────────────────
    function addTeam()    { setAboutTeam([...aboutTeam, { name: '', role: { da: '', en: '', ar: '' }, bio: { da: '', en: '', ar: '' }, gradient: GRADIENT_OPTIONS[0].value }]); }
    function removeTeam(i: number) { setAboutTeam(aboutTeam.filter((_, idx) => idx !== i)); }
    function updateTeam(i: number, patch: Partial<AboutMember>) {
        setAboutTeam(aboutTeam.map((m, idx) => idx === i ? { ...m, ...patch } : m));
    }
    function updateTeamML(i: number, field: 'role' | 'bio', lang: 'da' | 'en' | 'ar', val: string) {
        setAboutTeam(aboutTeam.map((m, idx) => idx === i ? { ...m, [field]: { ...m[field], [lang]: val } } : m));
    }

    const currentLogo = logoPreview ?? logoUrl ?? null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="تنظیمات سایت" />
            <div className="p-6 space-y-5 max-w-4xl" dir="rtl">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">تنظیمات سایت</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">محتوای سایت را از اینجا مدیریت کنید</p>
                    </div>
                    <Button onClick={save} disabled={processing}>
                        <Save className="w-4 h-4 me-1.5" />
                        {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                                tab === id
                                    ? 'border-emerald-600 text-emerald-600'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* ── Tab: General ──────────────────────────────────────────── */}
                {tab === 'general' && (
                    <div className="space-y-6">
                        <Section title="لوگوی سایت">
                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                                        {currentLogo ? (
                                            <img src={currentLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <div className="text-center text-gray-400">
                                                <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                                                <span className="text-xs">بدون لوگو</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        لوگو در نوار بالا، فوتر و صفحات سایت نمایش داده می‌شود.
                                        فرمت‌های مجاز: PNG، JPG، WebP (حداکثر ۲ مگابایت).
                                    </p>
                                    <input ref={logoInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onLogoChange} />
                                    <div className="flex flex-wrap gap-2">
                                        <Button type="button" variant="outline" size="sm" onClick={() => logoInputRef.current?.click()}>
                                            <Upload className="w-4 h-4 me-1.5" />انتخاب فایل
                                        </Button>
                                        {logoPreview && (
                                            <Button type="button" size="sm" onClick={uploadLogo} disabled={logoProcessing}>
                                                <Save className="w-4 h-4 me-1.5" />
                                                {logoProcessing ? 'در حال آپلود...' : 'ذخیره لوگو'}
                                            </Button>
                                        )}
                                        {logoPreview && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => { setLogoPreview(null); if (logoInputRef.current) logoInputRef.current.value = ''; }}>
                                                <X className="w-4 h-4 me-1.5" />لغو
                                            </Button>
                                        )}
                                        {logoUrl && !logoPreview && (
                                            <Button type="button" variant="destructive" size="sm" onClick={removeLogo}>
                                                <Trash2 className="w-4 h-4 me-1.5" />حذف لوگو
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section title="هویت سایت">
                            <ThreeLang label="نام سایت" da={general.site_name.da} en={general.site_name.en} ar={general.site_name.ar ?? ''}
                                onDa={(v) => setGeneral({ ...general, site_name: { ...general.site_name, da: v } })}
                                onEn={(v) => setGeneral({ ...general, site_name: { ...general.site_name, en: v } })}
                                onAr={(v) => setGeneral({ ...general, site_name: { ...general.site_name, ar: v } })} />
                            <ThreeLang label="شعار سایت (tagline)" da={general.site_tagline.da} en={general.site_tagline.en} ar={general.site_tagline.ar ?? ''}
                                onDa={(v) => setGeneral({ ...general, site_tagline: { ...general.site_tagline, da: v } })}
                                onEn={(v) => setGeneral({ ...general, site_tagline: { ...general.site_tagline, en: v } })}
                                onAr={(v) => setGeneral({ ...general, site_tagline: { ...general.site_tagline, ar: v } })} />
                        </Section>

                        <Section title="اطلاعات تماس">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>ایمیل</Label>
                                    <Input value={general.contact_email} onChange={(e) => setGeneral({ ...general, contact_email: e.target.value })} placeholder="info@example.com" dir="ltr" />
                                </div>
                                <div>
                                    <Label>شماره تلفن</Label>
                                    <Input value={general.contact_phone} onChange={(e) => setGeneral({ ...general, contact_phone: e.target.value })} placeholder="+93 ..." dir="ltr" />
                                </div>
                            </div>
                            <ThreeLang label="آدرس" da={general.contact_address.da} en={general.contact_address.en} ar={general.contact_address.ar ?? ''}
                                onDa={(v) => setGeneral({ ...general, contact_address: { ...general.contact_address, da: v } })}
                                onEn={(v) => setGeneral({ ...general, contact_address: { ...general.contact_address, en: v } })}
                                onAr={(v) => setGeneral({ ...general, contact_address: { ...general.contact_address, ar: v } })} />
                            <ThreeLang label="ساعات کاری" da={general.contact_hours.da} en={general.contact_hours.en} ar={general.contact_hours.ar ?? ''}
                                onDa={(v) => setGeneral({ ...general, contact_hours: { ...general.contact_hours, da: v } })}
                                onEn={(v) => setGeneral({ ...general, contact_hours: { ...general.contact_hours, en: v } })}
                                onAr={(v) => setGeneral({ ...general, contact_hours: { ...general.contact_hours, ar: v } })} />
                        </Section>
                    </div>
                )}

                {/* ── Tab: About ────────────────────────────────────────────── */}
                {tab === 'about' && (
                    <div className="space-y-6">

                        {/* Hero */}
                        <Section title="بنر معرفی (Hero)">
                            <ThreeLang label="عنوان" da={aboutHero.title.da} en={aboutHero.title.en} ar={aboutHero.title.ar ?? ''} tg={aboutHero.title.tg ?? ''}
                                onDa={(v) => setAboutHero({ ...aboutHero, title: { ...aboutHero.title, da: v } })}
                                onEn={(v) => setAboutHero({ ...aboutHero, title: { ...aboutHero.title, en: v } })}
                                onAr={(v) => setAboutHero({ ...aboutHero, title: { ...aboutHero.title, ar: v } })}
                                onTg={(v) => setAboutHero({ ...aboutHero, title: { ...aboutHero.title, tg: v } })} />
                            <div className="space-y-2">
                                <Label>توضیحات کوتاه</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">دری</p>
                                        <Textarea rows={3} value={aboutHero.subtitle.da} dir="rtl"
                                            onChange={(e) => setAboutHero({ ...aboutHero, subtitle: { ...aboutHero.subtitle, da: e.target.value } })} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">English</p>
                                        <Textarea rows={3} value={aboutHero.subtitle.en} dir="ltr"
                                            onChange={(e) => setAboutHero({ ...aboutHero, subtitle: { ...aboutHero.subtitle, en: e.target.value } })} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">العربية</p>
                                        <Textarea rows={3} value={aboutHero.subtitle.ar ?? ''} dir="rtl"
                                            onChange={(e) => setAboutHero({ ...aboutHero, subtitle: { ...aboutHero.subtitle, ar: e.target.value } })} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Тоҷикӣ</p>
                                        <Textarea rows={3} value={aboutHero.subtitle.tg ?? ''} dir="ltr"
                                            onChange={(e) => setAboutHero({ ...aboutHero, subtitle: { ...aboutHero.subtitle, tg: e.target.value } })} />
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Stats */}
                        <Section title="آمار و ارقام">
                            <p className="text-sm text-muted-foreground -mt-2 mb-3">در بخش «کتابخانه در اعداد» نمایش داده می‌شود.</p>
                            <label className="flex items-start gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={aboutStatsHidden}
                                    onChange={(e) => setAboutStatsHidden(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 accent-amber-600"
                                />
                                <div className="flex-1">
                                    <span className="text-sm font-medium text-gray-800">مخفی کردن بخش «کتابخانه در اعداد»</span>
                                    <p className="text-xs text-muted-foreground mt-0.5">با فعال کردن این گزینه، عنوان و تمام آمار از صفحه درباره ما پنهان می‌شود.</p>
                                </div>
                            </label>
                            <div className="space-y-3">
                                {aboutStats.map((s, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground font-medium">آمار {i + 1}</span>
                                            <button type="button" onClick={() => removeStat(i)} className="text-red-400 hover:text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <Label className="text-xs">آیکون</Label>
                                                <IconSelect value={s.icon} onChange={(v) => updateStat(i, { icon: v })} />
                                            </div>
                                            <div>
                                                <Label className="text-xs">عدد / مقدار</Label>
                                                <Input value={s.value} onChange={(e) => updateStat(i, { value: e.target.value })} placeholder="مثال: ۳٬۵۰۰+" dir="rtl" />
                                            </div>
                                            <div className="sm:col-span-1" />
                                        </div>
                                        <ThreeLang label="برچسب" da={s.label.da} en={s.label.en} ar={s.label.ar ?? ''}
                                            onDa={(v) => updateStatLabel(i, 'da', v)}
                                            onEn={(v) => updateStatLabel(i, 'en', v)}
                                            onAr={(v) => updateStatLabel(i, 'ar', v)} />
                                    </div>
                                ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addStat} className="mt-2">
                                <Plus className="w-4 h-4 me-1.5" />افزودن آمار
                            </Button>
                        </Section>

                        {/* Intro (custom section before Values) */}
                        <Section title="بخش معرفی دلخواه (قبل از رسالت)">
                            <p className="text-sm text-muted-foreground -mt-2 mb-3">یک عنوان و پاراگراف دلخواه که قبل از بخش رسالت در صفحه درباره ما نمایش داده می‌شود.</p>
                            <label className="flex items-start gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={aboutIntroHidden}
                                    onChange={(e) => setAboutIntroHidden(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 accent-amber-600"
                                />
                                <div className="flex-1">
                                    <span className="text-sm font-medium text-gray-800">مخفی کردن این بخش</span>
                                    <p className="text-xs text-muted-foreground mt-0.5">با فعال کردن این گزینه، عنوان و متن از صفحه درباره ما پنهان می‌شود.</p>
                                </div>
                            </label>
                            <ThreeLang label="عنوان" da={aboutIntro.title.da} en={aboutIntro.title.en} ar={aboutIntro.title.ar ?? ''} tg={aboutIntro.title.tg ?? ''}
                                onDa={(v) => setAboutIntro({ ...aboutIntro, title: { ...aboutIntro.title, da: v } })}
                                onEn={(v) => setAboutIntro({ ...aboutIntro, title: { ...aboutIntro.title, en: v } })}
                                onAr={(v) => setAboutIntro({ ...aboutIntro, title: { ...aboutIntro.title, ar: v } })}
                                onTg={(v) => setAboutIntro({ ...aboutIntro, title: { ...aboutIntro.title, tg: v } })} />
                            <div className="space-y-2">
                                <Label>متن پاراگراف</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">دری</p>
                                        <Textarea rows={4} value={aboutIntro.body.da} dir="rtl"
                                            onChange={(e) => setAboutIntro({ ...aboutIntro, body: { ...aboutIntro.body, da: e.target.value } })} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">English</p>
                                        <Textarea rows={4} value={aboutIntro.body.en} dir="ltr"
                                            onChange={(e) => setAboutIntro({ ...aboutIntro, body: { ...aboutIntro.body, en: e.target.value } })} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">العربية</p>
                                        <Textarea rows={4} value={aboutIntro.body.ar ?? ''} dir="rtl"
                                            onChange={(e) => setAboutIntro({ ...aboutIntro, body: { ...aboutIntro.body, ar: e.target.value } })} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Тоҷикӣ</p>
                                        <Textarea rows={4} value={aboutIntro.body.tg ?? ''} dir="ltr"
                                            onChange={(e) => setAboutIntro({ ...aboutIntro, body: { ...aboutIntro.body, tg: e.target.value } })} />
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Values */}
                        <Section title="رسالت، ارزش‌ها و چشم‌انداز">
                            <p className="text-sm text-muted-foreground -mt-2 mb-3">کارت‌های معرفی در صفحه درباره ما.</p>
                            <label className="flex items-start gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={aboutValuesHidden}
                                    onChange={(e) => setAboutValuesHidden(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 accent-amber-600"
                                />
                                <div className="flex-1">
                                    <span className="text-sm font-medium text-gray-800">مخفی کردن بخش «رسالت، ارزش‌ها و چشم‌انداز»</span>
                                    <p className="text-xs text-muted-foreground mt-0.5">با فعال کردن این گزینه، عنوان و تمام کارت‌ها از صفحه درباره ما پنهان می‌شود.</p>
                                </div>
                            </label>
                            <div className="space-y-4">
                                {aboutValues.map((v, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground font-medium">کارت {i + 1}</span>
                                            <button type="button" onClick={() => removeValue(i)} className="text-red-400 hover:text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div>
                                            <Label className="text-xs">آیکون</Label>
                                            <IconSelect value={v.icon} onChange={(val) => updateValue(i, { icon: val })} />
                                        </div>
                                        <ThreeLang label="عنوان" da={v.title.da} en={v.title.en} ar={v.title.ar ?? ''}
                                            onDa={(val) => updateValueML(i, 'title', 'da', val)}
                                            onEn={(val) => updateValueML(i, 'title', 'en', val)}
                                            onAr={(val) => updateValueML(i, 'title', 'ar', val)} />
                                        <div className="space-y-2">
                                            <Label className="text-xs">متن</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">دری</p>
                                                    <Textarea rows={3} value={v.body.da} dir="rtl"
                                                        onChange={(e) => updateValueML(i, 'body', 'da', e.target.value)} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">English</p>
                                                    <Textarea rows={3} value={v.body.en} dir="ltr"
                                                        onChange={(e) => updateValueML(i, 'body', 'en', e.target.value)} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">العربية</p>
                                                    <Textarea rows={3} value={v.body.ar ?? ''} dir="rtl"
                                                        onChange={(e) => updateValueML(i, 'body', 'ar', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addValue} className="mt-2">
                                <Plus className="w-4 h-4 me-1.5" />افزودن کارت
                            </Button>
                        </Section>

                        {/* Team */}
                        <Section title="تیم علمی">
                            <p className="text-sm text-muted-foreground -mt-2 mb-3">اعضای تیم که در صفحه درباره ما نمایش داده می‌شوند.</p>
                            <div className="space-y-4">
                                {aboutTeam.map((m, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground font-medium">عضو {i + 1}</span>
                                            <button type="button" onClick={() => removeTeam(i)} className="text-red-400 hover:text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-xs">نام</Label>
                                                <Input value={m.name} onChange={(e) => updateTeam(i, { name: e.target.value })} placeholder="نام کامل..." dir="rtl" />
                                            </div>
                                            <div>
                                                <Label className="text-xs">رنگ کارت</Label>
                                                <GradientSelect value={m.gradient} onChange={(v) => updateTeam(i, { gradient: v })} />
                                            </div>
                                        </div>
                                        <ThreeLang label="سمت / نقش" da={m.role.da} en={m.role.en} ar={m.role.ar ?? ''}
                                            onDa={(v) => updateTeamML(i, 'role', 'da', v)}
                                            onEn={(v) => updateTeamML(i, 'role', 'en', v)}
                                            onAr={(v) => updateTeamML(i, 'role', 'ar', v)} />
                                        <div className="space-y-2">
                                            <Label className="text-xs">بیوگرافی</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">دری</p>
                                                    <Textarea rows={3} value={m.bio.da} dir="rtl"
                                                        onChange={(e) => updateTeamML(i, 'bio', 'da', e.target.value)} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">English</p>
                                                    <Textarea rows={3} value={m.bio.en} dir="ltr"
                                                        onChange={(e) => updateTeamML(i, 'bio', 'en', e.target.value)} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">العربية</p>
                                                    <Textarea rows={3} value={m.bio.ar ?? ''} dir="rtl"
                                                        onChange={(e) => updateTeamML(i, 'bio', 'ar', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addTeam} className="mt-2">
                                <Plus className="w-4 h-4 me-1.5" />افزودن عضو
                            </Button>
                        </Section>
                    </div>
                )}

                {/* ── Tab: Social ───────────────────────────────────────────── */}
                {tab === 'social' && (
                    <Section title="لینک‌های شبکه‌های اجتماعی">
                        <p className="text-sm text-muted-foreground -mt-2 mb-2">
                            این اطلاعات در سایدبار، فوتر و نوار بالا نمایش داده می‌شوند.
                        </p>
                        <div className="space-y-4">
                            {socialLinks.map((s, i) => {
                                const Icon = PLATFORM_ICONS[s.platform] ?? Globe;
                                const label = PLATFORM_LABELS[s.platform] ?? s.platform;
                                return (
                                    <div key={s.platform} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="sm:col-span-1 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                                <Icon className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <span className="text-sm font-medium">{label}</span>
                                        </div>
                                        <div className="sm:col-span-3">
                                            <Label className="text-xs">لینک</Label>
                                            <Input value={s.url} onChange={(e) => updateSocial(i, 'url', e.target.value)} placeholder="https://..." dir="ltr" />
                                        </div>
                                        <div className="sm:col-span-1">
                                            <Label className="text-xs">تعداد دنبال‌کننده</Label>
                                            <Input value={s.count} onChange={(e) => updateSocial(i, 'count', e.target.value)} placeholder="مثال: 1.2K" dir="ltr" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Section>
                )}

                {/* ── Tab: Contact (QR) ─────────────────────────────────────── */}
                {tab === 'contact' && (
                    <Section title="کد QR صفحه تماس">
                        <p className="text-sm text-muted-foreground -mt-2 mb-3">
                            می‌توانید یک تصویر QR آپلود کنید یا یک لینک وارد کنید تا از روی آن QR ساخته شود. اگر تصویر آپلود شده باشد، به جای لینک نمایش داده می‌شود.
                        </p>

                        <label className="flex items-start gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer">
                            <input
                                type="checkbox"
                                checked={contactQrHidden}
                                onChange={(e) => setContactQrHidden(e.target.checked)}
                                className="mt-0.5 w-4 h-4 accent-amber-600"
                            />
                            <div className="flex-1">
                                <span className="text-sm font-medium text-gray-800">مخفی کردن این بخش در صفحه تماس</span>
                                <p className="text-xs text-muted-foreground mt-0.5">با فعال کردن این گزینه، بخش QR از صفحه تماس پنهان می‌شود.</p>
                            </div>
                        </label>

                        {/* Title */}
                        <ThreeLang label="عنوان (اختیاری)" da={contactQrTitle.da} en={contactQrTitle.en} ar={contactQrTitle.ar ?? ''} tg={contactQrTitle.tg ?? ''}
                            onDa={(v) => setContactQrTitle({ ...contactQrTitle, da: v })}
                            onEn={(v) => setContactQrTitle({ ...contactQrTitle, en: v })}
                            onAr={(v) => setContactQrTitle({ ...contactQrTitle, ar: v })}
                            onTg={(v) => setContactQrTitle({ ...contactQrTitle, tg: v })} />

                        {/* Link */}
                        <div>
                            <Label>لینک (برای ساخت خودکار QR)</Label>
                            <Input
                                value={contactQrLink}
                                onChange={(e) => setContactQrLink(e.target.value)}
                                placeholder="https://..."
                                dir="ltr"
                            />
                            <p className="text-xs text-muted-foreground mt-1">این لینک در صورتی که تصویر آپلود نشود، به QR تبدیل می‌شود.</p>
                        </div>

                        {/* Image upload */}
                        <div className="mt-4">
                            <Label>تصویر QR (اختیاری)</Label>
                            <p className="text-xs text-muted-foreground mb-2">در صورت آپلود، این تصویر به جای QR تولیدشده نمایش داده می‌شود. فرمت‌های مجاز: PNG، JPG، WebP (حداکثر ۲ مگابایت).</p>
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                                    {qrPreview ? (
                                        <img src={qrPreview} alt="QR preview" className="w-full h-full object-contain p-2" />
                                    ) : settings.contact_qr_image ? (
                                        <img src={`/storage/${settings.contact_qr_image}`} alt="QR" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <QrCode className="w-8 h-8 mx-auto mb-1" />
                                            <span className="text-xs">بدون تصویر</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <input ref={qrInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onQrChange} />
                                    <div className="flex flex-wrap gap-2">
                                        <Button type="button" variant="outline" size="sm" onClick={() => qrInputRef.current?.click()}>
                                            <Upload className="w-4 h-4 me-1.5" />انتخاب فایل
                                        </Button>
                                        {qrPreview && (
                                            <Button type="button" size="sm" onClick={uploadQr} disabled={qrProcessing}>
                                                <Save className="w-4 h-4 me-1.5" />
                                                {qrProcessing ? 'در حال آپلود...' : 'ذخیره تصویر'}
                                            </Button>
                                        )}
                                        {qrPreview && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => { setQrPreview(null); if (qrInputRef.current) qrInputRef.current.value = ''; }}>
                                                <X className="w-4 h-4 me-1.5" />لغو
                                            </Button>
                                        )}
                                        {settings.contact_qr_image && !qrPreview && (
                                            <Button type="button" variant="destructive" size="sm" onClick={removeQr}>
                                                <Trash2 className="w-4 h-4 me-1.5" />حذف تصویر
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Section>
                )}

                {/* ── Tab: Ticker ───────────────────────────────────────────── */}
                {tab === 'ticker' && (
                    <Section title="آیتم‌های خبرتیکر">
                        <p className="text-sm text-muted-foreground -mt-2 mb-3">این متن‌ها در نوار متحرک زیر منو نمایش داده می‌شوند.</p>
                        <div className="space-y-3">
                            {tickerItems.map((item, i) => (
                                <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground font-medium">آیتم {i + 1}</span>
                                        <button type="button" onClick={() => removeTicker(i)} className="text-red-400 hover:text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div>
                                        <Label className="text-xs">دری</Label>
                                        <Input value={item.da} onChange={(e) => updateTicker(i, 'da', e.target.value)} placeholder="متن به زبان دری..." dir="rtl" />
                                    </div>
                                    <div>
                                        <Label className="text-xs">English</Label>
                                        <Input value={item.en} onChange={(e) => updateTicker(i, 'en', e.target.value)} placeholder="Text in English..." dir="ltr" />
                                    </div>
                                    <div>
                                        <Label className="text-xs">العربية</Label>
                                        <Input value={item.ar ?? ''} onChange={(e) => updateTicker(i, 'ar', e.target.value)} placeholder="النص بالعربية..." dir="rtl" />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Тоҷикӣ</Label>
                                        <Input value={item.tg ?? ''} onChange={(e) => updateTicker(i, 'tg', e.target.value)} placeholder="Матн бо забони тоҷикӣ..." dir="ltr" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={addTicker} className="mt-2">
                            <Plus className="w-4 h-4 me-1.5" />افزودن آیتم
                        </Button>
                        <InputError message={errors.ticker_items} />
                    </Section>
                )}

                {/* ── Tab: Footer ───────────────────────────────────────────── */}
                {tab === 'footer' && (
                    <Section title="متن «درباره ما» در فوتر">
                        <p className="text-sm text-muted-foreground -mt-2 mb-3">این متن در ستون اول فوتر سایت نمایش داده می‌شود.</p>
                        <div className="space-y-4">
                            <div>
                                <Label>دری</Label>
                                <Textarea value={footerAbout.da} onChange={(e) => setFooterAbout({ ...footerAbout, da: e.target.value })} rows={5} placeholder="توضیحات به زبان دری..." dir="rtl" />
                            </div>
                            <div>
                                <Label>English</Label>
                                <Textarea value={footerAbout.en} onChange={(e) => setFooterAbout({ ...footerAbout, en: e.target.value })} rows={5} placeholder="Description in English..." dir="ltr" />
                            </div>
                            <div>
                                <Label>العربية</Label>
                                <Textarea value={footerAbout.ar ?? ''} onChange={(e) => setFooterAbout({ ...footerAbout, ar: e.target.value })} rows={5} placeholder="الوصف بالعربية..." dir="rtl" />
                            </div>
                            <div>
                                <Label>Тоҷикӣ</Label>
                                <Textarea value={footerAbout.tg ?? ''} onChange={(e) => setFooterAbout({ ...footerAbout, tg: e.target.value })} rows={5} placeholder="Тавсиф бо забони тоҷикӣ..." dir="ltr" />
                            </div>
                        </div>
                    </Section>
                )}

                {/* Bottom save */}
                <div className="flex justify-end pt-2">
                    <Button onClick={save} disabled={processing}>
                        <Save className="w-4 h-4 me-1.5" />
                        {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}

// ── Helper components ─────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                <span className="w-1 h-4 bg-emerald-500 rounded-full inline-block" />
                {title}
            </h3>
            {children}
        </div>
    );
}

function ThreeLang({ label, da, en, ar, tg, onDa, onEn, onAr, onTg }: { label: string; da: string; en: string; ar: string; tg?: string; onDa: (v: string) => void; onEn: (v: string) => void; onAr: (v: string) => void; onTg?: (v: string) => void }) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">دری</p>
                    <Input value={da} onChange={(e) => onDa(e.target.value)} placeholder="..." dir="rtl" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">English</p>
                    <Input value={en} onChange={(e) => onEn(e.target.value)} placeholder="..." dir="ltr" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">العربية</p>
                    <Input value={ar} onChange={(e) => onAr(e.target.value)} placeholder="..." dir="rtl" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Тоҷикӣ</p>
                    <Input value={tg ?? ''} onChange={(e) => onTg?.(e.target.value)} placeholder="..." dir="ltr" />
                </div>
            </div>
        </div>
    );
}

function IconSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <div className="flex flex-wrap gap-1.5 mt-1">
            {ICON_OPTIONS.map(({ value: v, label, Icon }) => (
                <button
                    key={v}
                    type="button"
                    title={label}
                    onClick={() => onChange(v)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                        value === v
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
                    }`}
                >
                    <Icon className="w-4 h-4" />
                </button>
            ))}
        </div>
    );
}

function GradientSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <div className="flex flex-wrap gap-1.5 mt-1">
            {GRADIENT_OPTIONS.map(({ value: v, label }) => (
                <button
                    key={v}
                    type="button"
                    title={label}
                    onClick={() => onChange(v)}
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${v} border-2 transition-all ${
                        value === v ? 'border-gray-800 scale-110' : 'border-transparent'
                    }`}
                />
            ))}
        </div>
    );
}
