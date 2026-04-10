import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock, Send, Facebook, Twitter, Youtube, Linkedin, Rss } from 'lucide-react';

interface ML { da: string; en: string }
interface SocialLink { platform: string; url: string; count?: string }
interface SharedProps {
    siteSettings?: {
        contact_email?:   string;
        contact_phone?:   string;
        contact_address?: ML;
        contact_hours?:   ML;
        social_links?:    SocialLink[];
    };
    [key: string]: unknown;
}

const SOCIAL_ICONS: Record<string, React.ElementType> = {
    facebook: Facebook, twitter: Twitter, youtube: Youtube, linkedin: Linkedin, rss: Rss,
};
const SOCIAL_COLORS: Record<string, string> = {
    facebook: 'bg-[#3b5998]', twitter: 'bg-[#1da1f2]',
    youtube:  'bg-[#ff0000]', linkedin: 'bg-[#0077b5]', rss: 'bg-[#f26522]',
};
const SOCIAL_LABELS: Record<string, string> = {
    facebook: 'فیسبوک', twitter: 'توییتر', youtube: 'یوتیوب', linkedin: 'لینکدین', rss: 'RSS',
};

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <span className="w-1 h-7 bg-[#27ae60] rounded-full" />
            <h2 className="text-[20px] font-bold text-gray-900">{children}</h2>
        </div>
    );
}

export function ContactContent() {
    const { i18n } = useTranslation();
    const locale   = ['da', 'en', 'ar', 'tg'].includes(i18n.language) ? i18n.language : 'da';

    const settings    = usePage<SharedProps>().props.siteSettings ?? {};
    const flashSuccess = (usePage().props.flash as Record<string, string> | undefined)?.success;

    const l = (ml: ML | undefined) => ml ? (ml[locale] || ml.da || ml.en || '') : '';

    const contactItems = [
        settings.contact_address ? {
            icon: MapPin,
            title: locale === 'en' ? 'Address' : 'آدرس',
            lines: [l(settings.contact_address)],
        } : null,
        settings.contact_phone ? {
            icon: Phone,
            title: locale === 'en' ? 'Phone' : 'تلفن',
            lines: [settings.contact_phone],
        } : null,
        settings.contact_email ? {
            icon: Mail,
            title: locale === 'en' ? 'Email' : 'ایمیل',
            lines: [settings.contact_email],
        } : null,
        settings.contact_hours ? {
            icon: Clock,
            title: locale === 'en' ? 'Working Hours' : 'ساعات کاری',
            lines: [l(settings.contact_hours)],
        } : null,
    ].filter(Boolean) as { icon: React.ElementType; title: string; lines: string[] }[];

    const socials = (settings.social_links ?? []).filter(s => s.url && s.url !== '#');

    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        name:    '',
        email:   '',
        subject: '',
        message: '',
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const isEn = locale === 'en';

    type FieldKey = 'name' | 'email' | 'subject' | 'message';

    function validate(field: FieldKey, value: string): string {
        const trimmed = value.trim();
        if (field === 'name') {
            if (!trimmed) return isEn ? 'Name is required.' : 'نام الزامی است.';
            if (trimmed.length < 2) return isEn ? 'Name must be at least 2 characters.' : 'نام باید حداقل ۲ کاراکتر باشد.';
            if (trimmed.length > 80) return isEn ? 'Name is too long.' : 'نام بیش از حد طولانی است.';
            if (/[<>{}\[\]\\|]/.test(trimmed)) return isEn ? 'Name contains invalid characters.' : 'نام شامل کاراکترهای غیرمجاز است.';
        }
        if (field === 'email') {
            if (!trimmed) return isEn ? 'Email is required.' : 'ایمیل الزامی است.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return isEn ? 'Enter a valid email address.' : 'آدرس ایمیل معتبر وارد کنید.';
        }
        if (field === 'subject') {
            if (!trimmed) return isEn ? 'Subject is required.' : 'موضوع الزامی است.';
            if (trimmed.length < 3) return isEn ? 'Subject must be at least 3 characters.' : 'موضوع باید حداقل ۳ کاراکتر باشد.';
            if (trimmed.length > 150) return isEn ? 'Subject is too long.' : 'موضوع بیش از حد طولانی است.';
        }
        if (field === 'message') {
            if (!trimmed) return isEn ? 'Message is required.' : 'پیام الزامی است.';
            if (trimmed.length < 10) return isEn ? 'Message must be at least 10 characters.' : 'پیام باید حداقل ۱۰ کاراکتر باشد.';
            if (trimmed.length > 2000) return isEn ? 'Message is too long (max 2000 characters).' : 'پیام بیش از حد طولانی است (حداکثر ۲۰۰۰ کاراکتر).';
            if (/(https?:\/\/|www\.)/i.test(trimmed)) return isEn ? 'Links are not allowed in messages.' : 'لینک در پیام مجاز نیست.';
            const uniqueChars = new Set(trimmed.replace(/\s/g, '')).size;
            if (uniqueChars < 4) return isEn ? 'Message appears to be spam.' : 'پیام شما به اسپم شباهت دارد.';
        }
        return '';
    }

    function clientErrors() {
        const fields: FieldKey[] = ['name', 'email', 'subject', 'message'];
        const errs: Partial<Record<FieldKey, string>> = {};
        for (const f of fields) {
            const msg = validate(f, data[f]);
            if (msg) errs[f] = msg;
        }
        return errs;
    }

    const clientErrs = clientErrors();
    const hasClientErrors = Object.keys(clientErrs).length > 0;

    function touch(field: FieldKey) {
        setTouched((prev) => ({ ...prev, [field]: true }));
    }

    function fieldError(field: FieldKey): string {
        return (touched[field] ? clientErrs[field] : '') || errors[field] || '';
    }

    const submitted = wasSuccessful || !!flashSuccess;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setTouched({ name: true, email: true, subject: true, message: true });
        if (hasClientErrors) return;
        post('/contact', { onSuccess: () => reset() });
    }

    return (
        <div className="space-y-8">
            {/* Contact info cards */}
            {contactItems.length > 0 && (
                <div>
                    <SectionTitle>{locale === 'en' ? 'Contact Information' : 'اطلاعات تماس'}</SectionTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {contactItems.map(({ icon: Icon, title, lines }) => (
                            <div key={title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4 hover:shadow-md transition-shadow">
                                <div className="shrink-0 w-10 h-10 rounded-lg bg-[#27ae60]/10 flex items-center justify-center mt-0.5">
                                    <Icon className="w-5 h-5 text-[#27ae60]" />
                                </div>
                                <div>
                                    <p className="font-bold text-[13px] text-gray-900 mb-1">{title}</p>
                                    {lines.filter(Boolean).map((line, i) => (
                                        <p key={i} className="text-[12px] text-gray-500 leading-relaxed">{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Contact form */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <SectionTitle>{locale === 'en' ? 'Send a Message' : 'ارسال پیام'}</SectionTitle>

                {submitted ? (
                    <div className="flex flex-col items-center gap-3 py-10 text-center">
                        <div className="w-14 h-14 rounded-full bg-[#27ae60]/10 flex items-center justify-center">
                            <Send className="w-6 h-6 text-[#27ae60]" />
                        </div>
                        <p className="font-bold text-[16px] text-gray-800">
                            {locale === 'en' ? 'Message sent!' : 'پیام شما ارسال شد!'}
                        </p>
                        <p className="text-[13px] text-gray-500">
                            {locale === 'en' ? 'We will get back to you soon.' : 'به زودی با شما تماس خواهیم گرفت.'}
                        </p>
                        <button
                            onClick={() => reset()}
                            className="mt-2 text-[13px] text-[#27ae60] hover:underline"
                        >
                            {locale === 'en' ? 'Send another message' : 'ارسال پیام دیگر'}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                                    {isEn ? 'Full Name' : 'نام و نام خانوادگی'} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => { setData('name', e.target.value); touch('name'); }}
                                    onBlur={() => touch('name')}
                                    placeholder={isEn ? 'Your name' : 'نام شما'}
                                    className={`w-full border rounded-lg px-3 py-2.5 text-[13px] focus:outline-none transition-colors ${fieldError('name') ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#27ae60]'}`}
                                />
                                {fieldError('name') && <p className="text-red-500 text-[11px] mt-1">{fieldError('name')}</p>}
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                                    {isEn ? 'Email' : 'ایمیل'} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.email}
                                    onChange={(e) => { setData('email', e.target.value); touch('email'); }}
                                    onBlur={() => touch('email')}
                                    placeholder="email@example.com"
                                    className={`w-full border rounded-lg px-3 py-2.5 text-[13px] focus:outline-none transition-colors ${fieldError('email') ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#27ae60]'}`}
                                    dir="ltr"
                                />
                                {fieldError('email') && <p className="text-red-500 text-[11px] mt-1">{fieldError('email')}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                                {isEn ? 'Subject' : 'موضوع'} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.subject}
                                onChange={(e) => { setData('subject', e.target.value); touch('subject'); }}
                                onBlur={() => touch('subject')}
                                placeholder={isEn ? 'Message subject' : 'موضوع پیام'}
                                className={`w-full border rounded-lg px-3 py-2.5 text-[13px] focus:outline-none transition-colors ${fieldError('subject') ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#27ae60]'}`}
                            />
                            {fieldError('subject') && <p className="text-red-500 text-[11px] mt-1">{fieldError('subject')}</p>}
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                                {isEn ? 'Message' : 'پیام'} <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={5}
                                value={data.message}
                                onChange={(e) => { setData('message', e.target.value); touch('message'); }}
                                onBlur={() => touch('message')}
                                placeholder={isEn ? 'Write your message...' : 'پیام خود را بنویسید...'}
                                className={`w-full border rounded-lg px-3 py-2.5 text-[13px] focus:outline-none transition-colors resize-none ${fieldError('message') ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#27ae60]'}`}
                            />
                            <div className="flex items-start justify-between mt-1">
                                {fieldError('message')
                                    ? <p className="text-red-500 text-[11px]">{fieldError('message')}</p>
                                    : <span />
                                }
                                <span className={`text-[11px] ${data.message.length > 1800 ? 'text-red-400' : 'text-gray-400'}`}>
                                    {data.message.length}/2000
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 bg-[#27ae60] hover:bg-[#219a52] disabled:opacity-60 text-white font-bold text-[13px] px-6 py-2.5 rounded-lg transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            {processing
                                ? (isEn ? 'Sending...' : 'در حال ارسال...')
                                : (isEn ? 'Send Message' : 'ارسال پیام')
                            }
                        </button>
                    </form>
                )}
            </div>

            {/* Social links */}
            {socials.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <SectionTitle>{locale === 'en' ? 'Social Media' : 'شبکه‌های اجتماعی'}</SectionTitle>
                    <div className="flex flex-wrap gap-3">
                        {socials.map((s) => {
                            const Icon  = SOCIAL_ICONS[s.platform]  ?? Send;
                            const color = SOCIAL_COLORS[s.platform] ?? 'bg-gray-600';
                            const label = SOCIAL_LABELS[s.platform] ?? s.platform;
                            return (
                                <a
                                    key={s.platform}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2.5 ${color} text-white text-[13px] font-bold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
