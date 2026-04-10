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
import { Plus, Pencil, Trash2, Search, Tags, Headphones, Link as LinkIcon, Upload, Download, X, Music } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { CategoryPanel } from '@/components/admin/category-panel';
import type { CategoryItem } from '@/components/admin/category-panel';

type Category = CategoryItem;
type AudioSource = 'link' | 'upload';

interface AudioItem {
    id: number;
    title: { da: string; en?: string; ar?: string; tg?: string };
    description: { da: string; en?: string; ar?: string } | null;
    author: string;
    category_id: number;
    category: string;
    duration: string | null;
    episodes: number | null;
    audio_source: AudioSource;
    audio_url: string | null;
    file_path: string | null;
    file_size: number | null;
    is_active: boolean;
    created_at: string;
}

const SOURCE_OPTIONS: { value: AudioSource; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: 'link',   label: 'لینک مستقیم', icon: <LinkIcon className="w-5 h-5" />, desc: 'لینک URL صوت' },
    { value: 'upload', label: 'آپلود فایل',  icon: <Upload   className="w-5 h-5" />, desc: 'فایل MP3 یا سایر فرمت‌ها' },
];

const SOURCE_BADGE: Record<AudioSource, { label: string; className: string }> = {
    link:   { label: 'لینک',   className: 'bg-blue-100 text-blue-700' },
    upload: { label: 'آپلود',  className: 'bg-emerald-100 text-emerald-700' },
};

function formatBytes(b: number): string {
    if (b < 1024 * 1024) return (b / 1024).toFixed(0) + ' KB';
    return (b / (1024 * 1024)).toFixed(1) + ' MB';
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'داشبورد', href: '/dashboard' }, { title: 'صوتی‌ها', href: '/admin/audios' }];

const emptyForm = {
    title: { da: '', en: '', ar: '', tg: '' }, description: { da: '', en: '', ar: '' }, author: '', category_id: '',
    duration: '', episodes: '', audio_source: 'link' as AudioSource, audio_url: '', is_active: true,
};

export default function AudiosIndex({ audios, categories }: { audios: AudioItem[]; categories: Category[] }) {
    const [tab, setTab]           = useState<'audios' | 'categories'>('audios');
    const [search, setSearch]     = useState('');
    const [open, setOpen]         = useState(false);
    const [editing, setEditing]   = useState<AudioItem | null>(null);
    const [form, setForm]         = useState(emptyForm);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errors, setErrors]     = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const filtered = audios.filter((a) => (a.title?.da ?? '').includes(search) || a.author.includes(search) || a.category.includes(search));

    function openCreate() {
        setEditing(null);
        setForm(emptyForm);
        setSelectedFile(null);
        setErrors({});
        setOpen(true);
    }

    function openEdit(a: AudioItem) {
        setEditing(a);
        setForm({
            title: { da: a.title?.da ?? '', en: a.title?.en ?? '', ar: a.title?.ar ?? '', tg: a.title?.tg ?? '' },
            description: { da: a.description?.da ?? '', en: a.description?.en ?? '', ar: a.description?.ar ?? '' },
            author: a.author,
            category_id: String(a.category_id),
            duration: a.duration ?? '',
            episodes: a.episodes ? String(a.episodes) : '',
            audio_source: a.audio_source ?? 'link',
            audio_url: a.audio_url ?? '',
            is_active: a.is_active,
        });
        setSelectedFile(null);
        setErrors({});
        setOpen(true);
    }

    function submit() {
        setProcessing(true);
        const isUpload = form.audio_source === 'upload';

        const buildFd = (withMethod?: string) => {
            const fd = new FormData();
            if (withMethod) fd.append('_method', withMethod);
            fd.append('title[da]', form.title.da);
            fd.append('title[en]', form.title.en ?? '');
            fd.append('title[ar]', form.title.ar ?? '');
            fd.append('title[tg]', form.title.tg ?? '');
            fd.append('description[da]', form.description?.da ?? '');
            fd.append('description[en]', form.description?.en ?? '');
            fd.append('description[ar]', form.description?.ar ?? '');
            fd.append('author', form.author);
            fd.append('category_id', form.category_id);
            fd.append('duration', form.duration);
            fd.append('episodes', form.episodes || '');
            fd.append('audio_source', form.audio_source);
            if (!isUpload) fd.append('audio_url', form.audio_url);
            fd.append('is_active', form.is_active ? '1' : '0');
            if (isUpload && selectedFile) fd.append('file', selectedFile);
            return fd;
        };

        if (editing) {
            router.post(`/admin/audios/${editing.id}`, buildFd('PUT'), {
                forceFormData: true,
                onSuccess: () => { setOpen(false); setErrors({}); setSelectedFile(null); },
                onError: (e) => setErrors(e),
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post('/admin/audios', buildFd(), {
                forceFormData: true,
                onSuccess: () => { setOpen(false); setErrors({}); setSelectedFile(null); },
                onError: (e) => setErrors(e),
                onFinish: () => setProcessing(false),
            });
        }
    }

    function destroy(a: AudioItem) { if (confirm('آیا مطمئن هستید؟')) router.delete(`/admin/audios/${a.id}`); }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مدیریت صوتی‌ها" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">مدیریت صوتی‌ها</h1>
                    {tab === 'audios' && <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4 me-1" /> افزودن صوت</Button>}
                </div>
                <div className="flex gap-1 border-b border-gray-200">
                    <button onClick={() => setTab('audios')} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === 'audios' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                        <Headphones className="w-4 h-4" /> صوتی‌ها ({audios.length})
                    </button>
                    <button onClick={() => setTab('categories')} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === 'categories' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                        <Tags className="w-4 h-4" /> دسته‌بندی‌ها ({categories.length})
                    </button>
                </div>

                {tab === 'categories' && <CategoryPanel categories={categories} type="audio" />}

                {tab === 'audios' && <>
                    <div className="relative max-w-sm">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader><TableRow>
                                <TableHead className="w-10">#</TableHead>
                                <TableHead>عنوان</TableHead>
                                <TableHead>نویسنده</TableHead>
                                <TableHead>دسته‌بندی</TableHead>
                                <TableHead>منبع</TableHead>
                                <TableHead>مدت</TableHead>
                                <TableHead className="w-24">عملیات</TableHead>
                            </TableRow></TableHeader>
                            <TableBody>
                                {filtered.length === 0 && (
                                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">هیچ موردی یافت نشد</TableCell></TableRow>
                                )}
                                {filtered.map((a, i) => {
                                    const src = SOURCE_BADGE[a.audio_source ?? 'link'];
                                    return (
                                        <TableRow key={a.id}>
                                            <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                            <TableCell className="font-medium">{a.title?.da}</TableCell>
                                            <TableCell>{a.author}</TableCell>
                                            <TableCell><Badge variant="secondary">{a.category}</Badge></TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${src.className}`}>
                                                    {src.label}
                                                    {a.file_size && <span className="opacity-70">· {formatBytes(a.file_size)}</span>}
                                                </span>
                                            </TableCell>
                                            <TableCell>{a.duration ?? '—'}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    {a.audio_source === 'upload' && a.file_path && (
                                                        <a href={`/audio/${a.id}/download`} target="_blank" rel="noreferrer">
                                                            <Button variant="ghost" size="icon" title="دانلود"><Download className="w-4 h-4" /></Button>
                                                        </a>
                                                    )}
                                                    <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="w-4 h-4" /></Button>
                                                    <Button variant="ghost" size="icon" onClick={() => destroy(a)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </>}
            </div>

            {/* Create / Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? 'ویرایش صوت' : 'افزودن صوت جدید'}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                        {/* Source selector */}
                        <div>
                            <Label className="mb-2 block">نوع منبع *</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {SOURCE_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => { setForm({ ...form, audio_source: opt.value }); setSelectedFile(null); }}
                                        className={`flex items-center gap-3 p-3 rounded-lg border-2 text-start transition-colors ${form.audio_source === opt.value ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <span className={form.audio_source === opt.value ? 'text-emerald-600' : 'text-gray-400'}>{opt.icon}</span>
                                        <div>
                                            <p className="text-sm font-medium">{opt.label}</p>
                                            <p className="text-xs text-gray-500">{opt.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div><Label>عنوان (دری) *</Label><Input value={form.title.da} onChange={(e) => setForm({ ...form, title: { ...form.title, da: e.target.value } })} placeholder="دری" /><InputError message={errors['title.da']} /></div>
                        <div><Label>عنوان (English)</Label><Input value={form.title.en ?? ''} onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })} placeholder="English" dir="ltr" /></div>
                        <div><Label>عنوان (العربية)</Label><Input value={form.title.ar ?? ''} onChange={(e) => setForm({ ...form, title: { ...form.title, ar: e.target.value } })} placeholder="العربية" /></div>
                        <div><Label>عنوان (Тоҷикӣ)</Label><Input value={form.title.tg ?? ''} onChange={(e) => setForm({ ...form, title: { ...form.title, tg: e.target.value } })} placeholder="Тоҷикӣ" dir="ltr" /></div>
                        <div><Label>نویسنده *</Label><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /><InputError message={errors.author} /></div>

                        <div>
                            <Label>دسته‌بندی *</Label>
                            <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                                <SelectTrigger><SelectValue placeholder="انتخاب" /></SelectTrigger>
                                <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name.da}</SelectItem>)}</SelectContent>
                            </Select>
                            <InputError message={errors.category_id} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>مدت</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="۵۵:۰۰" /></div>
                            <div><Label>تعداد قسمت‌ها</Label><Input type="number" value={form.episodes} onChange={(e) => setForm({ ...form, episodes: e.target.value })} /></div>
                        </div>

                        {/* Source-specific input */}
                        {form.audio_source === 'link' && (
                            <div><Label>لینک صوت</Label><Input value={form.audio_url} onChange={(e) => setForm({ ...form, audio_url: e.target.value })} placeholder="https://..." /><InputError message={errors.audio_url} /></div>
                        )}

                        {form.audio_source === 'upload' && (
                            <div>
                                <Label className="mb-2 block">فایل صوتی</Label>
                                {/* Existing file */}
                                {editing?.file_path && !selectedFile && (
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 mb-2">
                                        <Music className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span className="text-sm text-gray-700 truncate flex-1">فایل موجود</span>
                                        {editing.file_size && <span className="text-xs text-gray-500">{formatBytes(editing.file_size)}</span>}
                                    </div>
                                )}
                                {/* New file preview */}
                                {selectedFile && (
                                    <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200 mb-2">
                                        <Music className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span className="text-sm text-gray-700 truncate flex-1">{selectedFile.name}</span>
                                        <span className="text-xs text-gray-500">{formatBytes(selectedFile.size)}</span>
                                        <button onClick={() => { setSelectedFile(null); if (fileRef.current) fileRef.current.value = ''; }}>
                                            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                        </button>
                                    </div>
                                )}
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors"
                                    onClick={() => fileRef.current?.click()}
                                >
                                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">برای آپلود کلیک کنید</p>
                                    <p className="text-xs text-gray-400 mt-1">MP3, M4A, OGG, WAV, AAC — حداکثر ۲۰۰ مگابایت</p>
                                </div>
                                <input ref={fileRef} type="file" accept=".mp3,.m4a,.ogg,.wav,.aac,.flac,.opus,.wma" className="hidden"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)} />
                                <InputError message={errors.file} />
                            </div>
                        )}

                        <div><Label>توضیحات (دری)</Label><Textarea value={form.description?.da ?? ''} onChange={(e) => setForm({ ...form, description: { ...form.description, da: e.target.value } })} rows={3} /></div>
                        <div><Label>توضیحات (English)</Label><Textarea value={form.description?.en ?? ''} onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })} rows={3} dir="ltr" /></div>
                        <div><Label>توضیحات (العربية)</Label><Textarea value={form.description?.ar ?? ''} onChange={(e) => setForm({ ...form, description: { ...form.description, ar: e.target.value } })} rows={3} /></div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">انصراف</Button></DialogClose>
                        <Button onClick={submit} disabled={processing}>{processing ? 'در حال ذخیره...' : editing ? 'بروزرسانی' : 'ذخیره'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
