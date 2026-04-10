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
import { Plus, Pencil, Trash2, Search, Tags, PlayCircle, Upload, Link, Youtube, X, FileVideo, Download } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { CategoryPanel } from '@/components/admin/category-panel';
import type { CategoryItem } from '@/components/admin/category-panel';

type Category = CategoryItem;
type VideoSource = 'link' | 'youtube' | 'upload';

interface VideoItem {
    id: number;
    title: { da: string; en?: string; ar?: string; tg?: string };
    instructor: string;
    category_id: number;
    category: string;
    duration: string | null;
    views: number;
    year: number | null;
    status: string;
    description: { da: string; en?: string; ar?: string; tg?: string } | null;
    video_source: VideoSource;
    video_url: string | null;
    file_path: string | null;
    file_size: number | null;
    is_active: boolean;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'ویدیوها', href: '/admin/videos' },
];

const emptyForm = {
    title: { da: '', en: '', ar: '', tg: '' },
    instructor: '',
    category_id: '',
    duration: '',
    views: 0,
    year: '',
    status: 'available',
    description: { da: '', en: '', ar: '', tg: '' },
    video_source: 'link' as VideoSource,
    video_url: '',
    is_active: true,
};

function formatBytes(bytes: number): string {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

const SOURCE_OPTIONS: { value: VideoSource; label: string; icon: React.ElementType; description: string }[] = [
    { value: 'youtube', label: 'یوتیوب', icon: Youtube,   description: 'لینک یوتیوب' },
    { value: 'link',    label: 'لینک',    icon: Link,      description: 'لینک مستقیم' },
    { value: 'upload',  label: 'آپلود',   icon: Upload,    description: 'فایل ویدیو' },
];

const SOURCE_BADGE: Record<VideoSource, { label: string; className: string }> = {
    youtube: { label: 'یوتیوب', className: 'bg-red-100 text-red-700 border border-red-200' },
    link:    { label: 'لینک',   className: 'bg-blue-100 text-blue-700 border border-blue-200' },
    upload:  { label: 'آپلود',  className: 'bg-violet-100 text-violet-700 border border-violet-200' },
};

export default function VideosIndex({ videos, categories }: { videos: VideoItem[]; categories: Category[] }) {
    const [tab, setTab] = useState<'videos' | 'categories'>('videos');
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<VideoItem | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filtered = videos.filter(
        (v) => (v.title?.da ?? '').includes(search) || v.instructor.includes(search) || v.category.includes(search),
    );

    function openCreate() {
        setEditing(null);
        setForm(emptyForm);
        setSelectedFile(null);
        setErrors({});
        setOpen(true);
    }

    function openEdit(v: VideoItem) {
        setEditing(v);
        setForm({
            title: { da: v.title?.da ?? '', en: v.title?.en ?? '', ar: v.title?.ar ?? '', tg: v.title?.tg ?? '' },
            instructor: v.instructor,
            category_id: String(v.category_id),
            duration: v.duration ?? '',
            views: v.views,
            year: v.year ? String(v.year) : '',
            status: v.status,
            description: { da: v.description?.da ?? '', en: v.description?.en ?? '', ar: v.description?.ar ?? '', tg: v.description?.tg ?? '' },
            video_source: v.video_source ?? 'link',
            video_url: v.video_url ?? '',
            is_active: v.is_active,
        });
        setSelectedFile(null);
        setErrors({});
        setOpen(true);
    }

    function submit() {
        setProcessing(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: any = {
            ...form,
            category_id: Number(form.category_id),
            year: form.year ? Number(form.year) : null,
        };
        if (form.video_source === 'upload' && selectedFile) {
            payload.file = selectedFile;
        }

        const url = editing ? `/admin/videos/${editing.id}` : '/admin/videos';
        const needsFormData = form.video_source === 'upload' && !!selectedFile;

        if (editing) {
            router.post(url, { ...payload, _method: 'PUT' }, {
                forceFormData: needsFormData,
                onSuccess: () => { setOpen(false); setErrors({}); setSelectedFile(null); },
                onError: (e) => setErrors(e),
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post(url, payload, {
                forceFormData: needsFormData,
                onSuccess: () => { setOpen(false); setErrors({}); setSelectedFile(null); },
                onError: (e) => setErrors(e),
                onFinish: () => setProcessing(false),
            });
        }
    }

    function destroy(v: VideoItem) {
        if (confirm('آیا مطمئن هستید؟')) router.delete(`/admin/videos/${v.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مدیریت ویدیوها" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">مدیریت ویدیوها</h1>
                    {tab === 'videos' && (
                        <Button onClick={openCreate} size="sm">
                            <Plus className="w-4 h-4 me-1" /> افزودن ویدیو
                        </Button>
                    )}
                </div>

                {/* Page tabs */}
                <div className="flex gap-1 border-b border-gray-200">
                    <button onClick={() => setTab('videos')} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === 'videos' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                        <PlayCircle className="w-4 h-4" /> ویدیوها ({videos.length})
                    </button>
                    <button onClick={() => setTab('categories')} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === 'categories' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                        <Tags className="w-4 h-4" /> دسته‌بندی‌ها ({categories.length})
                    </button>
                </div>

                {tab === 'categories' && <CategoryPanel categories={categories} type="video" />}

                {tab === 'videos' && <>
                    <div className="relative max-w-sm">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-10">#</TableHead>
                                    <TableHead>عنوان</TableHead>
                                    <TableHead>استاد</TableHead>
                                    <TableHead>دسته‌بندی</TableHead>
                                    <TableHead>منبع</TableHead>
                                    <TableHead>مدت</TableHead>
                                    <TableHead>وضعیت</TableHead>
                                    <TableHead className="w-24">عملیات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">هیچ ویدیویی یافت نشد</TableCell>
                                    </TableRow>
                                )}
                                {filtered.map((v, i) => {
                                    const srcBadge = SOURCE_BADGE[v.video_source ?? 'link'];
                                    return (
                                        <TableRow key={v.id}>
                                            <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                            <TableCell className="font-medium">{v.title?.da}</TableCell>
                                            <TableCell>{v.instructor}</TableCell>
                                            <TableCell><Badge variant="secondary">{v.category}</Badge></TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${srcBadge.className}`}>
                                                    {srcBadge.label}
                                                    {v.video_source === 'upload' && v.file_size && (
                                                        <span className="opacity-70">· {formatBytes(v.file_size)}</span>
                                                    )}
                                                </span>
                                            </TableCell>
                                            <TableCell>{v.duration ?? '—'}</TableCell>
                                            <TableCell>
                                                <Badge variant={v.status === 'available' ? 'default' : 'outline'}>
                                                    {v.status === 'available' ? 'در دسترس' : v.status === 'restricted' ? 'محدود' : 'آرشیو'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    {v.video_source === 'upload' && v.file_path && (
                                                        <a href={`/library/videos/${v.id}/download`} title="دانلود" className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    <Button variant="ghost" size="icon" onClick={() => openEdit(v)}><Pencil className="w-4 h-4" /></Button>
                                                    <Button variant="ghost" size="icon" onClick={() => destroy(v)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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

            {/* Create/Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'ویرایش ویدیو' : 'افزودن ویدیو جدید'}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {/* Basic info */}
                        <div>
                            <Label>عنوان (دری) *</Label>
                            <Input value={form.title.da} onChange={(e) => setForm({ ...form, title: { ...form.title, da: e.target.value } })} placeholder="دری" />
                            <InputError message={errors['title.da']} />
                        </div>
                        <div>
                            <Label>عنوان (English)</Label>
                            <Input value={form.title.en ?? ''} onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })} placeholder="English" dir="ltr" />
                        </div>
                        <div>
                            <Label>عنوان (العربية)</Label>
                            <Input value={form.title.ar ?? ''} onChange={(e) => setForm({ ...form, title: { ...form.title, ar: e.target.value } })} placeholder="العربية" />
                        </div>
                        <div>
                            <Label>عنوان (Тоҷикӣ)</Label>
                            <Input value={form.title.tg ?? ''} onChange={(e) => setForm({ ...form, title: { ...form.title, tg: e.target.value } })} placeholder="Тоҷикӣ" dir="ltr" />
                        </div>
                        <div>
                            <Label>استاد *</Label>
                            <Input value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} />
                            <InputError message={errors.instructor} />
                        </div>
                        <div>
                            <Label>دسته‌بندی *</Label>
                            <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                                <SelectTrigger><SelectValue placeholder="انتخاب" /></SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name.da}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category_id} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>مدت</Label>
                                <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="1:30:00" />
                            </div>
                            <div>
                                <Label>سال</Label>
                                <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <Label>وضعیت</Label>
                            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">در دسترس</SelectItem>
                                    <SelectItem value="restricted">محدود</SelectItem>
                                    <SelectItem value="archived">آرشیو</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Video source selector */}
                        <div>
                            <Label className="mb-2 block">منبع ویدیو *</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {SOURCE_OPTIONS.map(({ value, label, icon: Icon, description }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => { setForm({ ...form, video_source: value, video_url: '' }); setSelectedFile(null); }}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                            form.video_source === value
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                : 'border-gray-200 text-muted-foreground hover:border-gray-300'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{label}</span>
                                        <span className="text-[10px] font-normal opacity-70">{description}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Source-specific input */}
                        {form.video_source === 'youtube' && (
                            <div>
                                <Label>لینک یوتیوب *</Label>
                                <Input
                                    value={form.video_url}
                                    onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    dir="ltr"
                                />
                                {form.video_url && (
                                    <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-black">
                                        <iframe
                                            className="w-full h-full"
                                            src={`https://www.youtube.com/embed/${extractYoutubeId(form.video_url)}`}
                                            allowFullScreen
                                        />
                                    </div>
                                )}
                                <InputError message={errors.video_url} />
                            </div>
                        )}

                        {form.video_source === 'link' && (
                            <div>
                                <Label>لینک مستقیم ویدیو *</Label>
                                <Input
                                    value={form.video_url}
                                    onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                                    placeholder="https://example.com/video.mp4"
                                    dir="ltr"
                                />
                                <InputError message={errors.video_url} />
                            </div>
                        )}

                        {form.video_source === 'upload' && (
                            <div>
                                <Label>فایل ویدیو (MP4, WebM, MOV)</Label>

                                {/* Existing file info when editing */}
                                {editing?.file_path && !selectedFile && (
                                    <div className="flex items-center gap-2 p-2.5 rounded-lg border border-violet-200 bg-violet-50 mt-1.5 mb-2">
                                        <FileVideo className="w-4 h-4 text-violet-600 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-violet-700">فایل موجود</p>
                                            <p className="text-xs text-violet-500">
                                                {editing.file_size ? formatBytes(editing.file_size) : ''} — آپلود جدید جایگزین می‌شود
                                            </p>
                                        </div>
                                        <a href={`/library/videos/${editing.id}/download`} className="text-violet-500 hover:text-violet-700" title="دانلود">
                                            <Download className="w-4 h-4" />
                                        </a>
                                    </div>
                                )}

                                {/* Selected file preview */}
                                {selectedFile && (
                                    <div className="flex items-center gap-2 p-2.5 rounded-lg border border-blue-200 bg-blue-50 mt-1.5 mb-2">
                                        <FileVideo className="w-4 h-4 text-blue-600 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-blue-700 truncate">{selectedFile.name}</p>
                                            <p className="text-xs text-blue-500">{formatBytes(selectedFile.size)}</p>
                                        </div>
                                        <button type="button" onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="text-blue-400 hover:text-blue-700">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                <div
                                    className="mt-1.5 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="w-5 h-5 mx-auto mb-1.5 text-gray-400" />
                                    <p className="text-sm text-gray-500">برای آپلود کلیک کنید</p>
                                    <p className="text-xs text-gray-400 mt-0.5">MP4, WebM, MOV, AVI, MKV — حداکثر ۵۰۰ مگابایت</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept=".mp4,.webm,.mov,.avi,.mkv"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                                />
                                <InputError message={errors.file} />
                            </div>
                        )}

                        <div>
                            <Label>توضیحات (دری)</Label>
                            <Textarea value={form.description.da} onChange={(e) => setForm({ ...form, description: { ...form.description, da: e.target.value } })} rows={3} />
                        </div>
                        <div>
                            <Label>توضیحات (English)</Label>
                            <Textarea value={form.description.en ?? ''} onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })} rows={3} dir="ltr" />
                        </div>
                        <div>
                            <Label>توضیحات (العربية)</Label>
                            <Textarea value={form.description.ar ?? ''} onChange={(e) => setForm({ ...form, description: { ...form.description, ar: e.target.value } })} rows={3} />
                        </div>
                        <div>
                            <Label>توضیحات (Тоҷикӣ)</Label>
                            <Textarea value={form.description.tg ?? ''} onChange={(e) => setForm({ ...form, description: { ...form.description, tg: e.target.value } })} rows={3} dir="ltr" />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">انصراف</Button></DialogClose>
                        <Button onClick={submit} disabled={processing}>
                            {processing ? 'در حال ذخیره...' : editing ? 'بروزرسانی' : 'ذخیره'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

function extractYoutubeId(url: string): string {
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_\-]{11})/);
    if (shortMatch) return shortMatch[1];
    const longMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_\-]{11})/);
    if (longMatch) return longMatch[1];
    return '';
}
