import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import { Plus, Pencil, Trash2, Search, Tags, MessageSquare, ImagePlus, X, FileText, Music, Video, Upload, LinkIcon } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { CategoryPanel } from '@/components/admin/category-panel';
import type { CategoryItem } from '@/components/admin/category-panel';

type Category = CategoryItem;
type FatwaType = 'text' | 'audio' | 'video';
type MediaSource = 'link' | 'upload';

interface FatwaItem {
    id: number;
    title: { da: string; en?: string; ar?: string; tg?: string };
    description: { da: string; en?: string; ar?: string; tg?: string } | null;
    body: { da: string; en?: string; ar?: string; tg?: string } | null;
    author: string;
    category_id: number;
    category: string;
    thumbnail: string | null;
    type: FatwaType;
    media_source: MediaSource | null;
    media_url: string | null;
    file_path: string | null;
    file_size: number | null;
    is_active: boolean;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'داشبورد', href: '/dashboard' }, { title: 'دارالإفتاء', href: '/admin/fatwas' }];

const emptyForm = {
    title:        { da: '', en: '', ar: '', tg: '' },
    description:  { da: '', en: '', ar: '', tg: '' },
    body:         { da: '', en: '', ar: '', tg: '' },
    author:       '',
    category_id:  '',
    type:         'text' as FatwaType,
    media_source: 'link' as MediaSource,
    media_url:    '',
    is_active:    true,
};

const TYPE_META: Record<FatwaType, { label: string; icon: React.ElementType; color: string }> = {
    text:  { label: 'متن',    icon: FileText, color: 'bg-gray-100 text-gray-700' },
    audio: { label: 'صوت',   icon: Music,    color: 'bg-blue-100 text-blue-700' },
    video: { label: 'ویدیو', icon: Video,    color: 'bg-purple-100 text-purple-700' },
};

function formatBytes(bytes: number | null | undefined): string {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

export default function FatwasIndex({ fatwas, categories }: { fatwas: FatwaItem[]; categories: Category[] }) {
    const [tab, setTab] = useState<'fatwas' | 'categories'>('fatwas');
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<FatwaItem | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const thumbRef = useRef<HTMLInputElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const filtered = fatwas.filter((f) =>
        (f.title?.da ?? '').includes(search) ||
        f.author.includes(search) ||
        f.category.includes(search),
    );

    function openCreate() {
        setEditing(null);
        setForm(emptyForm);
        setSelectedThumbnail(null);
        setSelectedFile(null);
        setErrors({});
        setOpen(true);
    }

    function openEdit(f: FatwaItem) {
        setEditing(f);
        setForm({
            title:        { da: f.title?.da ?? '', en: f.title?.en ?? '', ar: f.title?.ar ?? '', tg: f.title?.tg ?? '' },
            description:  { da: f.description?.da ?? '', en: f.description?.en ?? '', ar: f.description?.ar ?? '', tg: f.description?.tg ?? '' },
            body:         { da: f.body?.da ?? '', en: f.body?.en ?? '', ar: f.body?.ar ?? '', tg: f.body?.tg ?? '' },
            author:       f.author,
            category_id:  String(f.category_id),
            type:         f.type ?? 'text',
            media_source: f.media_source ?? 'link',
            media_url:    f.media_url ?? '',
            is_active:    f.is_active,
        });
        setSelectedThumbnail(null);
        setSelectedFile(null);
        setErrors({});
        setOpen(true);
    }

    function submit() {
        setProcessing(true);
        const fd = new FormData();
        if (editing) fd.append('_method', 'PUT');
        fd.append('title[da]', form.title.da);
        fd.append('title[en]', form.title.en ?? '');
        fd.append('title[ar]', form.title.ar ?? '');
        fd.append('title[tg]', form.title.tg ?? '');
        fd.append('description[da]', form.description?.da ?? '');
        fd.append('description[en]', form.description?.en ?? '');
        fd.append('description[ar]', form.description?.ar ?? '');
        fd.append('description[tg]', form.description?.tg ?? '');
        fd.append('body[da]', form.body?.da ?? '');
        fd.append('body[en]', form.body?.en ?? '');
        fd.append('body[ar]', form.body?.ar ?? '');
        fd.append('body[tg]', form.body?.tg ?? '');
        fd.append('author', form.author);
        fd.append('category_id', form.category_id);
        fd.append('type', form.type);
        fd.append('media_source', form.media_source);
        fd.append('media_url', form.media_url ?? '');
        fd.append('is_active', form.is_active ? '1' : '0');
        if (selectedThumbnail) fd.append('thumbnail', selectedThumbnail);
        if (selectedFile) fd.append('file', selectedFile);

        const url = editing ? `/admin/fatwas/${editing.id}` : '/admin/fatwas';
        router.post(url, fd, {
            forceFormData: true,
            onSuccess: () => { setOpen(false); setErrors({}); setSelectedThumbnail(null); setSelectedFile(null); },
            onError: (e) => setErrors(e),
            onFinish: () => setProcessing(false),
        });
    }

    function destroy(f: FatwaItem) { if (confirm('آیا مطمئن هستید؟')) router.delete(`/admin/fatwas/${f.id}`); }

    const showMedia = form.type === 'audio' || form.type === 'video';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مدیریت دارالإفتاء" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">مدیریت دارالإفتاء</h1>
                    {tab === 'fatwas' && <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4 me-1" /> افزودن فتوا</Button>}
                </div>
                <div className="flex gap-1 border-b border-gray-200">
                    <button onClick={() => setTab('fatwas')} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === 'fatwas' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                        <MessageSquare className="w-4 h-4" /> فتاوی ({fatwas.length})
                    </button>
                    <button onClick={() => setTab('categories')} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === 'categories' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                        <Tags className="w-4 h-4" /> دسته‌بندی‌ها ({categories.length})
                    </button>
                </div>
                {tab === 'categories' && <CategoryPanel categories={categories} type="fatwa" />}
                {tab === 'fatwas' && <>
                <div className="relative max-w-sm"><Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" /></div>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader><TableRow>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead className="w-16">تصویر</TableHead>
                            <TableHead>عنوان</TableHead>
                            <TableHead className="w-24">نوع</TableHead>
                            <TableHead>نویسنده</TableHead>
                            <TableHead>دسته‌بندی</TableHead>
                            <TableHead>تاریخ</TableHead>
                            <TableHead className="w-24">عملیات</TableHead>
                        </TableRow></TableHeader>
                        <TableBody>
                            {filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">هیچ موردی یافت نشد</TableCell></TableRow>}
                            {filtered.map((f, i) => {
                                const meta = TYPE_META[f.type ?? 'text'];
                                const TypeIcon = meta.icon;
                                return (
                                    <TableRow key={f.id}>
                                        <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                        <TableCell>
                                            {f.thumbnail ? (
                                                <img src={f.thumbnail.startsWith('http') ? f.thumbnail : `/storage/${f.thumbnail}`} alt="" className="w-10 h-10 object-cover rounded border border-gray-200" />
                                            ) : (
                                                <div className="w-10 h-10 rounded border border-gray-200 bg-gray-50 flex items-center justify-center">
                                                    <TypeIcon className="w-4 h-4 text-gray-300" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{f.title?.da}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${meta.color}`}>
                                                <TypeIcon className="w-3 h-3" />
                                                {meta.label}
                                            </span>
                                        </TableCell>
                                        <TableCell>{f.author}</TableCell>
                                        <TableCell><Badge variant="secondary">{f.category}</Badge></TableCell>
                                        <TableCell className="text-muted-foreground">{f.created_at?.split(' ')[0]}</TableCell>
                                        <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(f)}><Pencil className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => destroy(f)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div></TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
                </>}
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? 'ویرایش فتوا' : 'افزودن فتوای جدید'}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">

                        {/* Type picker */}
                        <div>
                            <Label className="mb-2 block">نوع فتوا *</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['text', 'audio', 'video'] as FatwaType[]).map((t) => {
                                    const Icon = TYPE_META[t].icon;
                                    const active = form.type === t;
                                    return (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setForm({ ...form, type: t })}
                                            className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-colors ${active ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="text-sm font-medium">{TYPE_META[t].label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div><Label>عنوان (دری) *</Label><Input value={form.title.da} onChange={(e) => setForm({ ...form, title: { ...form.title, da: e.target.value } })} placeholder="دری" /><InputError message={errors['title.da']} /></div>
                        <div><Label>عنوان (English)</Label><Input value={form.title.en ?? ''} onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })} placeholder="English" dir="ltr" /></div>
                        <div><Label>عنوان (العربية)</Label><Input value={form.title.ar ?? ''} onChange={(e) => setForm({ ...form, title: { ...form.title, ar: e.target.value } })} placeholder="العربية" /></div>
                        <div><Label>عنوان (Тоҷикӣ)</Label><Input value={form.title.tg ?? ''} onChange={(e) => setForm({ ...form, title: { ...form.title, tg: e.target.value } })} placeholder="Тоҷикӣ" dir="ltr" /></div>
                        <div><Label>نویسنده *</Label><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /><InputError message={errors.author} /></div>
                        <div><Label>دسته‌بندی *</Label>
                            <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}><SelectTrigger><SelectValue placeholder="انتخاب" /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name.da}</SelectItem>)}</SelectContent></Select>
                            <InputError message={errors.category_id} />
                        </div>

                        <div><Label>توضیحات کوتاه (دری)</Label><Textarea value={form.description.da} onChange={(e) => setForm({ ...form, description: { ...form.description, da: e.target.value } })} rows={3} /></div>
                        <div><Label>توضیحات کوتاه (English)</Label><Textarea value={form.description.en ?? ''} onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })} rows={3} dir="ltr" /></div>
                        <div><Label>توضیحات کوتاه (العربية)</Label><Textarea value={form.description.ar ?? ''} onChange={(e) => setForm({ ...form, description: { ...form.description, ar: e.target.value } })} rows={3} /></div>
                        <div><Label>توضیحات کوتاه (Тоҷикӣ)</Label><Textarea value={form.description.tg ?? ''} onChange={(e) => setForm({ ...form, description: { ...form.description, tg: e.target.value } })} rows={3} dir="ltr" /></div>

                        {/* Rich body — mainly useful for text type */}
                        {form.type === 'text' && (
                            <>
                                <div><Label>متن کامل (دری)</Label><Textarea value={form.body?.da ?? ''} onChange={(e) => setForm({ ...form, body: { ...form.body, da: e.target.value } })} rows={6} /></div>
                                <div><Label>متن کامل (English)</Label><Textarea value={form.body?.en ?? ''} onChange={(e) => setForm({ ...form, body: { ...form.body, en: e.target.value } })} rows={6} dir="ltr" /></div>
                                <div><Label>متن کامل (العربية)</Label><Textarea value={form.body?.ar ?? ''} onChange={(e) => setForm({ ...form, body: { ...form.body, ar: e.target.value } })} rows={6} /></div>
                                <div><Label>متن کامل (Тоҷикӣ)</Label><Textarea value={form.body?.tg ?? ''} onChange={(e) => setForm({ ...form, body: { ...form.body, tg: e.target.value } })} rows={6} dir="ltr" /></div>
                            </>
                        )}

                        {/* Media for audio/video */}
                        {showMedia && (
                            <div className="space-y-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
                                <Label className="text-sm font-semibold">{form.type === 'audio' ? 'فایل صوتی' : 'فایل ویدیویی'}</Label>
                                <div className="flex gap-2">
                                    {(['link', 'upload'] as MediaSource[]).map((src) => (
                                        <button
                                            key={src}
                                            type="button"
                                            onClick={() => setForm({ ...form, media_source: src })}
                                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-lg border-2 transition-colors ${form.media_source === src ? 'border-emerald-500 bg-white text-emerald-700' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}
                                        >
                                            {src === 'link' ? <LinkIcon className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                                            {src === 'link' ? 'لینک خارجی' : 'آپلود فایل'}
                                        </button>
                                    ))}
                                </div>

                                {form.media_source === 'link' ? (
                                    <div>
                                        <Label className="text-xs text-muted-foreground">لینک {form.type === 'audio' ? 'صوت' : 'ویدیو'}</Label>
                                        <Input value={form.media_url ?? ''} onChange={(e) => setForm({ ...form, media_url: e.target.value })} placeholder="https://..." dir="ltr" className="mt-1" />
                                    </div>
                                ) : (
                                    <div>
                                        <input ref={fileRef} type="file" accept={form.type === 'audio' ? 'audio/*' : 'video/*'} className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)} />
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                                                <Upload className="w-4 h-4 me-1.5" />انتخاب فایل
                                            </Button>
                                            {selectedFile && (
                                                <span className="text-xs text-gray-600">{selectedFile.name} — {formatBytes(selectedFile.size)}</span>
                                            )}
                                            {!selectedFile && editing?.file_path && (
                                                <span className="text-xs text-gray-500">فایل فعلی موجود است {editing.file_size ? `(${formatBytes(editing.file_size)})` : ''}</span>
                                            )}
                                            {selectedFile && (
                                                <button type="button" onClick={() => { setSelectedFile(null); if (fileRef.current) fileRef.current.value = ''; }} className="text-xs text-red-500 hover:underline">
                                                    <X className="w-3 h-3 inline" /> لغو
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">حداکثر ۵۰۰ مگابایت.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Thumbnail */}
                        <div>
                            <Label className="mb-2 block">تصویر (Thumbnail)</Label>
                            {editing?.thumbnail && !selectedThumbnail && (
                                <div className="mb-2 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={editing.thumbnail.startsWith('http') ? editing.thumbnail : `/storage/${editing.thumbnail}`} alt="thumbnail" className="w-full h-32 object-cover" />
                                    <p className="text-xs text-gray-400 px-2 py-1">تصویر فعلی — آپلود جدید جایگزین می‌شود</p>
                                </div>
                            )}
                            {selectedThumbnail && (
                                <div className="mb-2 rounded-lg overflow-hidden border border-emerald-200 relative">
                                    <img src={URL.createObjectURL(selectedThumbnail)} alt="preview" className="w-full h-32 object-cover" />
                                    <button type="button" onClick={() => { setSelectedThumbnail(null); if (thumbRef.current) thumbRef.current.value = ''; }} className="absolute top-1 end-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white"><X className="w-3 h-3" /></button>
                                </div>
                            )}
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors" onClick={() => thumbRef.current?.click()}>
                                <ImagePlus className="w-5 h-5 mx-auto mb-1.5 text-gray-400" />
                                <p className="text-sm text-gray-500">برای آپلود تصویر کلیک کنید</p>
                                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP — حداکثر ۵ مگابایت</p>
                            </div>
                            <input ref={thumbRef} type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => setSelectedThumbnail(e.target.files?.[0] ?? null)} />
                            <InputError message={errors.thumbnail} />
                        </div>
                    </div>
                    <DialogFooter><DialogClose asChild><Button variant="outline">انصراف</Button></DialogClose><Button onClick={submit} disabled={processing}>{processing ? 'در حال ذخیره...' : editing ? 'بروزرسانی' : 'ذخیره'}</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
