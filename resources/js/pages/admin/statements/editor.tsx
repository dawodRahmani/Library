import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { RichEditor } from '@/components/admin/rich-editor';
import { ArrowRight, Save } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface StatementData {
    id:           number;
    title:        { da: string; en?: string; ar?: string; tg?: string };
    body:         { da: string; en?: string; ar?: string; tg?: string } | null;
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
        title:        { da: statement?.title?.da ?? '', en: statement?.title?.en ?? '', ar: statement?.title?.ar ?? '', tg: statement?.title?.tg ?? '' },
        body:         { da: statement?.body?.da  ?? '', en: statement?.body?.en  ?? '', ar: statement?.body?.ar ?? '', tg: statement?.body?.tg ?? '' },
        published_at: statement?.published_at ?? new Date().toISOString().split('T')[0],
        is_active:    statement?.is_active ?? true,
    });
    const [errors, setErrors]         = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [langTab, setLangTab]       = useState<'da' | 'en' | 'ar' | 'tg'>('da');

    function save() {
        setProcessing(true);
        const url = isEdit ? `/admin/statements/${statement!.id}` : '/admin/statements';
        router[isEdit ? 'put' : 'post'](url, form, {
            onSuccess: () => router.visit('/admin/statements'),
            onError:   (e) => setErrors(e),
            onFinish:  () => setProcessing(false),
        });
    }

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
                                محتوا را به زبان دری و انگلیسی وارد کنید
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

                        {/* Body — Rich Editor */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
                            <Label className="text-sm font-semibold">
                                {langTab === 'da' ? 'متن بیانیه' : langTab === 'ar' ? 'نص البيانية' : langTab === 'tg' ? 'Матни изҳорот' : 'Statement Body'}
                            </Label>
                            <RichEditor
                                key={langTab}
                                value={form.body[langTab] ?? ''}
                                onChange={(html) => setForm({ ...form, body: { ...form.body, [langTab]: html } })}
                                placeholder={langTab === 'da' ? 'متن بیانیه را اینجا بنویسید...' : langTab === 'ar' ? 'اكتب نص البيانية هنا...' : langTab === 'tg' ? 'Матни изҳоротро инҷо нависед...' : 'Write the statement body here...'}
                                dir={langTab === 'en' || langTab === 'tg' ? 'ltr' : 'rtl'}
                            />
                        </div>
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
                                <li>ابتدا نسخه دری را کامل کنید</li>
                                <li>برای نسخه‌های دیگر تب مربوطه را انتخاب کنید</li>
                                <li>از ابزارهای نوار بالای ویرایشگر برای قالب‌بندی استفاده کنید</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
