import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ML { da?: string; en?: string; ar?: string; tg?: string }
interface SharedProps {
    siteSettings?: {
        contact_qr_image?: string | null;
        contact_qr_link?:  string;
        contact_qr_title?: ML;
        contact_qr_hidden?: boolean;
    };
    [key: string]: unknown;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <span className="w-1 h-7 bg-[#27ae60] rounded-full" />
            <h2 className="text-[20px] font-bold text-gray-900">{children}</h2>
        </div>
    );
}

export function ContactContent() {
    const { t, i18n } = useTranslation();
    const locale   = ['da', 'en', 'ar', 'tg'].includes(i18n.language) ? i18n.language : 'da';

    const settings    = usePage<SharedProps>().props.siteSettings ?? {};
    const flashSuccess = (usePage().props.flash as Record<string, string> | undefined)?.success;

    const qrHidden  = !!settings.contact_qr_hidden;
    const qrImage   = settings.contact_qr_image ?? '';
    const qrLink    = (settings.contact_qr_link ?? '').trim();
    const qrTitleML = settings.contact_qr_title;
    const qrTitle   = qrTitleML ? (qrTitleML[locale as keyof ML] || qrTitleML.da || qrTitleML.en || '') : '';
    const showQr    = !qrHidden && (qrImage || qrLink);

    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        name:    '',
        email:   '',
        subject: '',
        message: '',
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({});

    type FieldKey = 'name' | 'email' | 'subject' | 'message';

    function validate(field: FieldKey, value: string): string {
        const trimmed = value.trim();
        if (field === 'name') {
            if (!trimmed) return t('contact.errors.nameRequired');
            if (trimmed.length < 2) return t('contact.errors.nameMin');
            if (trimmed.length > 80) return t('contact.errors.nameMax');
            if (/[<>{}\[\]\\|]/.test(trimmed)) return t('contact.errors.nameInvalid');
        }
        if (field === 'email') {
            if (!trimmed) return t('contact.errors.emailRequired');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return t('contact.errors.emailInvalid');
        }
        if (field === 'subject') {
            if (!trimmed) return t('contact.errors.subjectRequired');
            if (trimmed.length < 3) return t('contact.errors.subjectMin');
            if (trimmed.length > 150) return t('contact.errors.subjectMax');
        }
        if (field === 'message') {
            if (!trimmed) return t('contact.errors.messageRequired');
            if (trimmed.length < 10) return t('contact.errors.messageMin');
            if (trimmed.length > 2000) return t('contact.errors.messageMax');
            if (/(https?:\/\/|www\.)/i.test(trimmed)) return t('contact.errors.messageNoLinks');
            const uniqueChars = new Set(trimmed.replace(/\s/g, '')).size;
            if (uniqueChars < 4) return t('contact.errors.messageSpam');
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
            {/* Contact form */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <SectionTitle>{t('contact.sendMessage')}</SectionTitle>

                {submitted ? (
                    <div className="flex flex-col items-center gap-3 py-10 text-center">
                        <div className="w-14 h-14 rounded-full bg-[#27ae60]/10 flex items-center justify-center">
                            <Send className="w-6 h-6 text-[#27ae60]" />
                        </div>
                        <p className="font-bold text-[16px] text-gray-800">
                            {t('contact.messageSent')}
                        </p>
                        <p className="text-[13px] text-gray-500">
                            {t('contact.willGetBack')}
                        </p>
                        <button
                            onClick={() => reset()}
                            className="mt-2 text-[13px] text-[#27ae60] hover:underline"
                        >
                            {t('contact.sendAnother')}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                                    {t('contact.fullName')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => { setData('name', e.target.value); touch('name'); }}
                                    onBlur={() => touch('name')}
                                    placeholder={t('contact.namePlaceholder')}
                                    className={`w-full border rounded-lg px-3 py-2.5 text-[13px] focus:outline-none transition-colors ${fieldError('name') ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#27ae60]'}`}
                                />
                                {fieldError('name') && <p className="text-red-500 text-[11px] mt-1">{fieldError('name')}</p>}
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                                    {t('contact.email')} <span className="text-red-500">*</span>
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
                                {t('contact.subject')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.subject}
                                onChange={(e) => { setData('subject', e.target.value); touch('subject'); }}
                                onBlur={() => touch('subject')}
                                placeholder={t('contact.subjectPlaceholder')}
                                className={`w-full border rounded-lg px-3 py-2.5 text-[13px] focus:outline-none transition-colors ${fieldError('subject') ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#27ae60]'}`}
                            />
                            {fieldError('subject') && <p className="text-red-500 text-[11px] mt-1">{fieldError('subject')}</p>}
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                                {t('contact.message')} <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={5}
                                value={data.message}
                                onChange={(e) => { setData('message', e.target.value); touch('message'); }}
                                onBlur={() => touch('message')}
                                placeholder={t('contact.messagePlaceholder')}
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
                            {processing ? t('contact.sending') : t('contact.send')}
                        </button>
                    </form>
                )}
            </div>

            {/* QR code */}
            {showQr && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    {qrTitle && <SectionTitle>{qrTitle}</SectionTitle>}
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-white border border-gray-200 rounded-xl">
                            {qrImage ? (
                                <img
                                    src={`/storage/${qrImage}`}
                                    alt={qrTitle || 'QR code'}
                                    className="w-48 h-48 object-contain"
                                />
                            ) : (
                                <QRCodeSVG value={qrLink} size={192} level="M" />
                            )}
                        </div>
                        {!qrImage && qrLink && (
                            <a
                                href={qrLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[12px] text-[#27ae60] hover:underline break-all"
                                dir="ltr"
                            >
                                {qrLink}
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
