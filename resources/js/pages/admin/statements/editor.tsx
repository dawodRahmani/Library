import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { RichEditor } from '@/components/admin/rich-editor';
import { ArrowRight, Save, FileText, Music, Video, Upload, X, Image as ImageIcon } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

type StatementType = 'text' | 'audio' | 'video';
type MediaSource = 'link' | 'upload';

interface StatementData {
    id:           number;
    type:         StatementType;
    title:        { da: string; en?: string; ar?: string; tg?: string };
    body:         { da: string; en?: string; ar?: string; tg?: string } | null;
    media_source: MediaSource;
    media_url:    string | null;
    file_path:    string | null;
    file_size:    number | null;
    thumbnail:    string | null;
    published_at: string | null;
    is_active:    boolean;
}

interface Props { statement: StatementData | null }

export default function StatementEditor({ statement }: Props) {
    const isEdit = !!statement;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'داشبورد', href: '/dashboard' },
        { title: 'بیانیه‌ها', href: '/admin/statements' },
        { title: isEdit ? 'ویرایش بیانیه' : 'بیانیه جدید', href: '#' },
    ];

    const [form, setForm] = useState({
        type:         (statement?.type ?? 'text') as StatementType,
        title:        { da: statement?.title?.da ?? '', en: statement?.title?.en ?? '', ar: statement?.title?.ar ?? '', tg: statement?.title?.tg ?? '' },
        body:         { da: statement?.body?.da  ?? '', en: statement?.body?.en  ?? '', ar: statement?.body?.ar ?? '', tg: statement?.body?.tg ?? '' },
        media_source: (statement?.media_source ?? 'link') as MediaSource,
        media_url:    statement?.media_url ?? '',
        published_at: statement?.published_at ?? new Date().toISOString().split('T')[0],
        is_active:    statement?.is_active ?? true,
    });
    const [errors, setErrors]         = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [langTab, setLangTab]       = useState<'da' | 'en' | 'ar' | 'tg'>('da');

    const fileInputRef  = useRef<HTMLInputElement>(null);
    const thumbInputRef = useRef<HTMLInputElement>(null);
    const [newFile, setNewFile]   = useState<File | null>(null);
    const [newThumb, setNewThumb] = useState<File | null>(null);
    const [thumbPreview, setThumbPreview] = useState<string | null>(null);

    const typeOptions: { value: StatementType; label: string; icon: React.ElementType }[] = [
        { value: 'text',  label: 'متن',   icon: FileText },
        { value: 'audio', label: 'صوت',  icon: Music    },
        { value: 'video', label: 'ویدیو', icon: Video    },
    ];

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        setNewFile(f ?? null);
    }
    function onThumbChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) { setNewThumb(null); setThumbPreview(null); return; }
        setNewThumb(f);
        setThumbPreview(URL.createObjectURL(f));
    }

    function save() {
        setProcessing(true);
        const fd = new FormData();
        fd.append('type', form.type);
        (['da', 'en', 'ar', 'tg'] as const).forEach((l) => {
            fd.append(`title[${l}]`, form.title[l] ?? '');
            fd.append(`body[${l}]`,  form.body[l]  ?? '');
        });
        fd.append('media_source', form.media_source);
        fd.append('media_url',    form.media_url ?? '');
        fd.append('published_at', form.published_at ?? '');
        fd.append('is_active',    form.is_active ? '1' : '0');
        if (newFile)  fd.append('file', newFile);
        if (newThumb) fd.append('thumbnail', newThumb);

        const url = isEdit ? `/admin/statements/${statement!.id}` : '/admin/statements';
        if (isEdit) fd.append('_method', 'put');

        router.post(url, fd, {
            forceFormData: true,
            onSuccess: () => router.visit('/admin/statements'),
            onError:   (e) => setErrors(e),
            onFinish:  () => setProcessing(false),
        });
    }

    function formatBytes(bytes: number | null | undefined): string {
        if (!bytes) return '';
        const mb = bytes / (1024 * 1024);
        return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
    }

    const showMediaFields = form.type === 'audio' || form.type === 'video';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'ویرایش بیانیه' : 'بیانیه جدید'} />

            <div className="p-6 max-w-5xl" dir="rtl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <a
                            href="/admin/statements"
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </a>
                        <div>
                            <h1 className="text-xl font-bold">
                                {isEdit ? 'ویرایش بیانیه' : 'بیانیه جدید'}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                محتوا را به زبان دری و سایر زبان‌ها وارد کنید
                            </p>
                        </div>
                    </div>
                    <Button onClick={save} disabled={processing}>
                        <Save className="w-4 h-4 me-1.5" />
                        {processing ? 'در حال ذخیره...' : 'ذخیره بیانیه'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ── Main editor (2/3) ─────────────────────────── */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Type selector */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                            <Label className="text-sm font-semibold">نوع بیانیه</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {typeOptions.map(({ value, label, icon: Icon }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setForm({ ...form, type: value })}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                                            form.type === value
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm font-medium">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Language tabs */}
                        <div className="flex gap-1 border-b border-gray-200">
                            {(['da', 'en', 'ar', 'tg'] as const).map((lang) => (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={() => setLangTab(lang)}
                                    className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                                        langTab === lang
                                            ? 'border-emerald-600 text-emerald-600'
                                            : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {lang === 'da' ? 'دری' : lang === 'en' ? 'English' : lang === 'ar' ? 'العربية' : 'Тоҷикӣ'}
                                </button>
                            ))}
                        </div>

                        {/* Title */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
                            <Label className="text-sm font-semibold">
                                {langTab === 'da' ? 'عنوان بیانیه' : langTab === 'ar' ? 'عنوان البيانية' : langTab === 'tg' ? 'Унвони изҳорот' : 'Statement Title'}
                            </Label>
                            <Input
                                value={form.title[langTab]}
                                onChange={(e) => setForm({ ...form, title: { ...form.title, [langTab]: e.target.value } })}
                                placeholder={langTab === 'da' ? 'عنوان بیانیه را بنویسید...' : langTab === 'ar' ? 'اكتب عنوان البيانية...' : langTab === 'tg' ? 'Унвони изҳоротро нависед...' : 'Write the statement title...'}
                                dir={langTab === 'en' || langTab === 'tg' ? 'ltr' : 'rtl'}
                                className="text-[15px] h-11"
                            />
                            <InputError message={errors['title.da']} />
                        </div>

                        {/* Body — Rich Editor (always shown; optional for audio/video as description) */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
                            <Label className="text-sm font-semibold">
                                {form.type === 'text'
                                    ? (langTab === 'da' ? 'متن بیانیه' : langTab === 'ar' ? 'نص البيانية' : langTab === 'tg' ? 'Матни изҳорот' : 'Statement Body')
                                    : (langTab === 'da' ? 'توضیحات (اختیاری)' : langTab === 'ar' ? 'الوصف (اختياري)' : langTab === 'tg' ? 'Тавсиф (ихтиёрӣ)' : 'Description (optional)')}
                            </Label>
                            <RichEditor
                                key={langTab}
                                value={form.body[langTab] ?? ''}
                                onChange={(html) => setForm({ ...form, body: { ...form.body, [langTab]: html } })}
                                placeholder={langTab === 'da' ? 'متن را اینجا بنویسید...' : langTab === 'ar' ? 'اكتب المحتوى هنا...' : langTab === 'tg' ? 'Матнро инҷо нависед...' : 'Write the content here...'}
                                dir={langTab === 'en' || langTab === 'tg' ? 'ltr' : 'rtl'}
                            />
                        </div>

                        {/* Media fields (audio/video only) */}
                        {showMediaFields && (
                            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                                <Label className="text-sm font-semibold">
                                    {form.type === 'audio' ? 'فایل صوتی' : 'فایل ویدیویی'}
                                </Label>

                                {/* Source toggle */}
                                <div className="flex gap-2">
                                    {(['link', 'upload'] as const).map((src) => (
                                        <button
                                            key={src}
                                            type="button"
                                            onClick={() => setForm({ ...form, media_source: src })}
                                            className={`flex-1 px-4 py-2.5 text-sm rounded-lg border-2 transition-colors ${
                                                form.media_source === src
                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                                            }`}
                                        >
                                            {src === 'link' ? 'لینک خارجی' : 'آپلود فایل'}
                                        </button>
                                    ))}
                                </div>

                                {/* URL or upload */}
                                {form.media_source === 'link' ? (
                                    <div>
                                        <Label className="text-xs text-muted-foreground">لینک {form.type === 'audio' ? 'صوت' : 'ویدیو'}</Label>
                                        <Input
                                            value={form.media_url ?? ''}
                                            onChange={(e) => setForm({ ...form, media_url: e.target.value })}
                                            placeholder="https://..."
                                            dir="ltr"
                                            className="mt-1"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {form.type === 'video' ? 'مثلاً لینک یوتیوب یا فایل mp4.' : 'لینک مستقیم فایل صوتی.'}
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept={form.type === 'audio' ? 'audio/*' : 'video/*'}
                                            className="hidden"
                                            onChange={onFileChange}
                                        />
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                                <Upload className="w-4 h-4 me-1.5" />انتخاب فایل
                                            </Button>
                                            {newFile && (
                                                <span className="text-xs text-gray-600">
                                                    {newFile.name} — {formatBytes(newFile.size)}
                                                </span>
                                            )}
                                            {!newFile && statement?.file_path && (
                                                <span className="text-xs text-gray-500">
                                                    فایل فعلی موجود است {statement.file_size ? `(${formatBytes(statement.file_size)})` : ''}
                                                </span>
                                            )}
                                            {newFile && (
                                                <button type="button" onClick={() => { setNewFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                                    className="text-xs text-red-500 hover:underline">
                                                    <X className="w-3 h-3 inline" /> لغو
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">حداکثر ۵۰۰ مگابایت.</p>
                                    </div>
                                )}

                                {/* Thumbnail (optional) */}
                                <div>
                                    <Label className="text-xs text-muted-foreground">تصویر شاخص (اختیاری)</Label>
                                    <input
                                        ref={thumbInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className="hidden"
                                        onChange={onThumbChange}
                                    />
                                    <div className="flex items-start gap-3 mt-1">
                                        <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                                            {thumbPreview ? (
                                                <img src={thumbPreview} alt="" className="w-full h-full object-cover" />
                                            ) : statement?.thumbnail ? (
                                                <img src={`/storage/${statement.thumbnail}`} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <Button type="button" variant="outline" size="sm" onClick={() => thumbInputRef.current?.click()}>
                                                <Upload className="w-4 h-4 me-1.5" />انتخاب تصویر
                                            </Button>
                                            {newThumb && (
                                                <button type="button" onClick={() => { setNewThumb(null); setThumbPreview(null); if (thumbInputRef.current) thumbInputRef.current.value = ''; }}
                                                    className="ms-2 text-xs text-red-500 hover:underline">لغو</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Sidebar (1/3) ─────────────────────────────── */}
                    <div className="space-y-4">

                        {/* Publish status */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                                <span className="w-1 h-4 bg-emerald-500 rounded-full inline-block" />
                                انتشار
                            </h3>

                            {/* Published date */}
                            <div>
                                <Label className="text-xs text-muted-foreground">تاریخ انتشار</Label>
                                <Input
                                    type="date"
                                    value={form.published_at}
                                    onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                                    dir="ltr"
                                    className="mt-1"
                                />
                            </div>

                            {/* Active toggle */}
                            <div className="flex items-center justify-between py-1">
                                <Label className="text-sm">وضعیت انتشار</Label>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={form.is_active}
                                    onClick={() => setForm({ ...form, is_active: !form.is_active })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.is_active ? 'translate-x-1' : 'translate-x-6'}`} />
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground -mt-2">
                                {form.is_active ? 'بیانیه در سایت نمایش داده می‌شود' : 'بیانیه پیش‌نویس است و نمایش داده نمی‌شود'}
                            </p>

                            {/* Save button */}
                            <Button onClick={save} disabled={processing} className="w-full">
                                <Save className="w-4 h-4 me-1.5" />
                                {processing ? 'در حال ذخیره...' : (isEdit ? 'ذخیره تغییرات' : 'انتشار بیانیه')}
                            </Button>
                        </div>

                        {/* Tips */}
                        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 space-y-2">
                            <p className="text-xs font-semibold text-blue-700">راهنما</p>
                            <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
                                <li>ابتدا نوع بیانیه (متن، صوت، ویدیو) را انتخاب کنید</li>
                                <li>برای نسخه‌های زبان‌های دیگر تب مربوطه را انتخاب کنید</li>
                                <li>برای بیانیه‌های صوتی/ویدیویی می‌توانید فایل آپلود کنید یا لینک بدهید</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
