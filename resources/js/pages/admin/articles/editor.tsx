import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { RichEditor } from '@/components/admin/rich-editor';
import { ArrowRight, ImageIcon, X, Save } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name: { da: string; en?: string; ar?: string; tg?: string };
    slug: string;
}

interface ArticleData {
    id: number;
    title: { da: string; en?: string; ar?: string; tg?: string };
    excerpt: { da: string; en?: string; ar?: string; tg?: string } | null;
    content: { da: string; en?: string; ar?: string; tg?: string } | null;
    author: string;
    category_id: number;
    read_time: string | null;
    cover_image: string | null;
    is_active: boolean;
}

interface Props {
    article: ArticleData | null;
    categories: Category[];
}

export default function ArticleEditor({ article, categories }: Props) {
    const isEdit = !!article;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'داشبورد', href: '/dashboard' },
        { title: 'مقاله‌ها', href: '/admin/articles' },
        { title: isEdit ? 'ویرایش مقاله' : 'مقاله جدید', href: '#' },
    ];

    const [form, setForm] = useState({
        title:       { da: article?.title?.da ?? '', en: article?.title?.en ?? '', ar: article?.title?.ar ?? '', tg: article?.title?.tg ?? '' },
        excerpt:     { da: article?.excerpt?.da ?? '', en: article?.excerpt?.en ?? '', ar: article?.excerpt?.ar ?? '', tg: article?.excerpt?.tg ?? '' },
        content:     { da: article?.content?.da ?? '', en: article?.content?.en ?? '', ar: article?.content?.ar ?? '', tg: article?.content?.tg ?? '' },
        author:      article?.author ?? '',
        category_id: article?.category_id ? String(article.category_id) : '',
        read_time:   article?.read_time ?? '',
        is_active:   article?.is_active ?? true,
    });
    const [coverFile, setCoverFile]   = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(
        article?.cover_image ? `/storage/${article.cover_image}` : null
    );
    const [errors, setErrors]         = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const coverRef = useRef<HTMLInputElement>(null);

    function pickCover(file: File) {
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    }

    function submit() {
        setProcessing(true);
        const fd = new FormData();
        if (isEdit) fd.append('_method', 'PUT');
        fd.append('title[da]', form.title.da);
        fd.append('title[en]', form.title.en ?? '');
        fd.append('title[ar]', form.title.ar ?? '');
        fd.append('title[tg]', form.title.tg ?? '');
        fd.append('excerpt[da]', form.excerpt.da);
        fd.append('excerpt[en]', form.excerpt.en ?? '');
        fd.append('excerpt[ar]', form.excerpt.ar ?? '');
        fd.append('excerpt[tg]', form.excerpt.tg ?? '');
        fd.append('content[da]', form.content.da);
        fd.append('content[en]', form.content.en ?? '');
        fd.append('content[ar]', form.content.ar ?? '');
        fd.append('content[tg]', form.content.tg ?? '');
        fd.append('author', form.author);
        fd.append('category_id', form.category_id);
        fd.append('read_time', form.read_time);
        fd.append('is_active', form.is_active ? '1' : '0');
        if (coverFile) fd.append('cover_image', coverFile);

        const url = isEdit ? `/admin/articles/${article!.id}` : '/admin/articles';
        router.post(url, fd, {
            forceFormData: true,
            onSuccess: () => router.visit('/admin/articles'),
            onError:   (e) => { setErrors(e); setProcessing(false); },
            onFinish:  () => setProcessing(false),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'ویرایش مقاله' : 'مقاله جدید'} />

            <div className="flex flex-col h-full">
                {/* Top bar */}
                <div className="flex items-center justify-between px-6 py-3 border-b bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <a href="/admin/articles" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowRight className="w-4 h-4" />
                            بازگشت
                        </a>
                        <span className="text-muted-foreground">/</span>
                        <h1 className="text-sm font-semibold">{isEdit ? 'ویرایش مقاله' : 'مقاله جدید'}</h1>
                    </div>
                    <Button onClick={submit} disabled={processing} size="sm">
                        <Save className="w-4 h-4 me-1.5" />
                        {processing ? 'در حال ذخیره...' : 'ذخیره مقاله'}
                    </Button>
                </div>

                {/* Editor layout */}
                <div className="flex-1 overflow-auto">
                    <div className="max-w-[1200px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6" dir="rtl">

                        {/* ── Main editor column ── */}
                        <div className="lg:col-span-2 space-y-5">

                            {/* Title */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
                                <Label className="text-base font-semibold">عنوان مقاله *</Label>
                                <Input
                                    value={form.title.da}
                                    onChange={(e) => setForm({ ...form, title: { ...form.title, da: e.target.value } })}
                                    placeholder="دری"
                                    className="text-lg font-medium h-12"
                                    dir="rtl"
                                />
                                <InputError message={errors['title.da']} />
                                <Input
                                    value={form.title.en ?? ''}
                                    onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })}
                                    placeholder="English title"
                                    className="h-10"
                                    dir="ltr"
                                />
                                <Input
                                    value={form.title.ar ?? ''}
                                    onChange={(e) => setForm({ ...form, title: { ...form.title, ar: e.target.value } })}
                                    placeholder="العنوان بالعربية"
                                    className="h-10"
                                    dir="rtl"
                                />
                                <Input
                                    value={form.title.tg ?? ''}
                                    onChange={(e) => setForm({ ...form, title: { ...form.title, tg: e.target.value } })}
                                    placeholder="Унвони тоҷикӣ"
                                    className="h-10"
                                    dir="ltr"
                                />
                            </div>

                            {/* Excerpt */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
                                <Label className="text-sm font-semibold">خلاصه / مقدمه</Label>
                                <p className="text-xs text-muted-foreground">این متن در صفحه فهرست مقاله‌ها نشان داده می‌شود.</p>
                                <Textarea
                                    value={form.excerpt.da}
                                    onChange={(e) => setForm({ ...form, excerpt: { ...form.excerpt, da: e.target.value } })}
                                    placeholder="دری"
                                    rows={3}
                                    dir="rtl"
                                />
                                <Textarea
                                    value={form.excerpt.en ?? ''}
                                    onChange={(e) => setForm({ ...form, excerpt: { ...form.excerpt, en: e.target.value } })}
                                    placeholder="English excerpt"
                                    rows={3}
                                    dir="ltr"
                                />
                                <Textarea
                                    value={form.excerpt.ar ?? ''}
                                    onChange={(e) => setForm({ ...form, excerpt: { ...form.excerpt, ar: e.target.value } })}
                                    placeholder="الملخص بالعربية"
                                    rows={3}
                                    dir="rtl"
                                />
                                <Textarea
                                    value={form.excerpt.tg ?? ''}
                                    onChange={(e) => setForm({ ...form, excerpt: { ...form.excerpt, tg: e.target.value } })}
                                    placeholder="Мухтасари тоҷикӣ"
                                    rows={3}
                                    dir="ltr"
                                />
                            </div>

                            {/* Content – Rich Editor (Dari) */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
                                <Label className="text-sm font-semibold">متن کامل مقاله (دری)</Label>
                                <RichEditor
                                    value={form.content.da}
                                    onChange={(html) => setForm({ ...form, content: { ...form.content, da: html } })}
                                    uploadUrl="/admin/articles/upload-image"
                                    dir="rtl"
                                />
                                <InputError message={errors['content.da']} />
                            </div>

                            {/* Content – English */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
                                <Label className="text-sm font-semibold">Full Article (English)</Label>
                                <RichEditor
                                    value={form.content.en ?? ''}
                                    onChange={(html) => setForm({ ...form, content: { ...form.content, en: html } })}
                                    uploadUrl="/admin/articles/upload-image"
                                    dir="ltr"
                                />
                            </div>

                            {/* Content – Arabic */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
                                <Label className="text-sm font-semibold">المقالة الكاملة (العربية)</Label>
                                <RichEditor
                                    value={form.content.ar ?? ''}
                                    onChange={(html) => setForm({ ...form, content: { ...form.content, ar: html } })}
                                    uploadUrl="/admin/articles/upload-image"
                                    dir="rtl"
                                />
                            </div>

                            {/* Content – Tajiki */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
                                <Label className="text-sm font-semibold">Мақолаи пурра (Тоҷикӣ)</Label>
                                <RichEditor
                                    value={form.content.tg ?? ''}
                                    onChange={(html) => setForm({ ...form, content: { ...form.content, tg: html } })}
                                    uploadUrl="/admin/articles/upload-image"
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        {/* ── Sidebar column ── */}
                        <div className="space-y-5">

                            {/* Publish settings */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                                <h3 className="text-sm font-semibold border-b pb-2">تنظیمات انتشار</h3>

                                <div className="space-y-1">
                                    <Label>نویسنده *</Label>
                                    <Input
                                        value={form.author}
                                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                                        placeholder="نام نویسنده"
                                        dir="rtl"
                                    />
                                    <InputError message={errors.author} />
                                </div>

                                <div className="space-y-1">
                                    <Label>دسته‌بندی *</Label>
                                    <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                                        <SelectTrigger dir="rtl"><SelectValue placeholder="انتخاب دسته‌بندی" /></SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>{c.name.da}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category_id} />
                                </div>

                                <div className="space-y-1">
                                    <Label>مدت مطالعه</Label>
                                    <Input
                                        value={form.read_time}
                                        onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                                        placeholder="مثال: ۱۰ دقیقه"
                                        dir="rtl"
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    <Checkbox
                                        id="is_active"
                                        checked={form.is_active}
                                        onCheckedChange={(v) => setForm({ ...form, is_active: !!v })}
                                    />
                                    <Label htmlFor="is_active">منتشر شده</Label>
                                </div>
                            </div>

                            {/* Cover image */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                                <h3 className="text-sm font-semibold border-b pb-2">تصویر شاخص</h3>

                                {coverPreview ? (
                                    <div className="relative group">
                                        <img
                                            src={coverPreview}
                                            alt="cover"
                                            className="w-full aspect-video object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                                            className="absolute top-2 end-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="border-2 border-dashed border-gray-200 rounded-lg aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors"
                                        onClick={() => coverRef.current?.click()}
                                    >
                                        <ImageIcon className="w-8 h-8 text-gray-300" />
                                        <p className="text-sm text-gray-400">کلیک کنید تا تصویر آپلود شود</p>
                                        <p className="text-xs text-gray-300">JPG، PNG، WebP — حداکثر ۵ مگابایت</p>
                                    </div>
                                )}

                                {!coverPreview && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => coverRef.current?.click()}
                                    >
                                        <ImageIcon className="w-4 h-4 me-1.5" />
                                        انتخاب تصویر
                                    </Button>
                                )}
                                {coverPreview && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => coverRef.current?.click()}
                                    >
                                        تغییر تصویر
                                    </Button>
                                )}

                                <input
                                    ref={coverRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) pickCover(f);
                                        e.target.value = '';
                                    }}
                                />
                            </div>

                            {/* Save button (sidebar duplicate) */}
                            <Button onClick={submit} disabled={processing} className="w-full">
                                <Save className="w-4 h-4 me-1.5" />
                                {processing ? 'در حال ذخیره...' : 'ذخیره مقاله'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
