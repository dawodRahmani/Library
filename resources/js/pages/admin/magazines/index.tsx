import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { Plus, Pencil, Trash2, Search, Upload, FileText, X, Download, BookOpen, Eye } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface MagazineItem {
    id: number;
    number: number;
    title: { da: string; en?: string; ar?: string };
    theme: string | null;
    year: string;
    article_count: number;
    description: { da: string; en?: string; ar?: string } | null;
    featured: boolean;
    articles: string[] | null;
    cover_image: string | null;
    file_path: string | null;
    file_size: number | null;
    is_active: boolean;
    created_at: string;
}

function formatBytes(b: number): string {
    if (b < 1024 * 1024) return (b / 1024).toFixed(0) + ' KB';
    return (b / (1024 * 1024)).toFixed(1) + ' MB';
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'داشبورد', href: '/dashboard' }, { title: 'مجله', href: '/admin/magazines' }];

const emptyForm = {
    number: '', title: { da: '', en: '', ar: '' }, theme: '', year: '', article_count: 0,
    description: { da: '', en: '', ar: '' }, featured: false, is_active: true,
};

export default function MagazinesIndex({ magazines }: { magazines: MagazineItem[] }) {
    const [search, setSearch]           = useState('');
    const [open, setOpen]               = useState(false);
    const [editing, setEditing]         = useState<MagazineItem | null>(null);
    const [form, setForm]               = useState(emptyForm);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errors, setErrors]           = useState<Record<string, string>>({});
    const [processing, setProcessing]   = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const filtered = magazines.filter((m) => (m.title?.da ?? '').includes(search) || m.year.includes(search));

    function openCreate() {
        setEditing(null);
        setForm(emptyForm);
        setSelectedFile(null);
        setErrors({});
        setOpen(true);
    }

    function openEdit(m: MagazineItem) {
        setEditing(m);
        setForm({
            number: String(m.number),
            title: { da: m.title?.da ?? '', en: m.title?.en ?? '', ar: m.title?.ar ?? '' },
            theme: m.theme ?? '',
            year: m.year,
            article_count: m.article_count,
            description: { da: m.description?.da ?? '', en: m.description?.en ?? '', ar: m.description?.ar ?? '' },
            featured: m.featured,
            is_active: m.is_active,
        });
        setSelectedFile(null);
        setErrors({});
        setOpen(true);
    }

    function submit() {
        setProcessing(true);
        const fd = new FormData();
        if (editing) fd.append('_method', 'PUT');
        fd.append('number', String(form.number));
        fd.append('title[da]', form.title.da);
        fd.append('title[en]', form.title.en ?? '');
        fd.append('title[ar]', form.title.ar ?? '');
        fd.append('theme', form.theme);
        fd.append('year', form.year);
        fd.append('article_count', String(form.article_count));
        fd.append('description[da]', form.description?.da ?? '');
        fd.append('description[en]', form.description?.en ?? '');
        fd.append('description[ar]', form.description?.ar ?? '');
        fd.append('featured', form.featured ? '1' : '0');
        fd.append('is_active', form.is_active ? '1' : '0');
        if (selectedFile) fd.append('file', selectedFile);

        const url = editing ? `/admin/magazines/${editing.id}` : '/admin/magazines';
        router.post(url, fd, {
            forceFormData: true,
            onSuccess: () => { setOpen(false); setErrors({}); setSelectedFile(null); },
            onError: (e) => setErrors(e),
            onFinish: () => setProcessing(false),
        });
    }

    function destroy(m: MagazineItem) { if (confirm('آیا مطمئن هستید؟')) router.delete(`/admin/magazines/${m.id}`); }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مدیریت مجله" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">مدیریت مجله</h1>
                    <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4 me-1" /> افزودن شماره</Button>
                </div>
                <div className="relative max-w-sm">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
                </div>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader><TableRow>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead>شماره</TableHead>
                            <TableHead>عنوان</TableHead>
                            <TableHead>سال</TableHead>
                            <TableHead>PDF</TableHead>
                            <TableHead>ویژه</TableHead>
                            <TableHead className="w-28">عملیات</TableHead>
                        </TableRow></TableHeader>
                        <TableBody>
                            {filtered.length === 0 && (
                                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">هیچ شماره‌ای یافت نشد</TableCell></TableRow>
                            )}
                            {filtered.map((m, i) => (
                                <TableRow key={m.id}>
                                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                    <TableCell className="font-medium">{m.number}</TableCell>
                                    <TableCell>{m.title?.da}</TableCell>
                                    <TableCell>{m.year}</TableCell>
                                    <TableCell>
                                        {m.file_path ? (
                                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium">
                                                <FileText className="w-3 h-3" /> PDF
                                                {m.file_size && <span className="opacity-70">· {formatBytes(m.file_size)}</span>}
                                            </span>
                                        ) : '—'}
                                    </TableCell>
                                    <TableCell>{m.featured ? <Badge>ویژه</Badge> : '—'}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            {m.file_path && (
                                                <>
                                                    <a href={`/majalla/${m.id}/read`} target="_blank" rel="noreferrer">
                                                        <Button variant="ghost" size="icon" title="مطالعه"><Eye className="w-4 h-4" /></Button>
                                                    </a>
                                                    <a href={`/majalla/${m.id}/download`} target="_blank" rel="noreferrer">
                                                        <Button variant="ghost" size="icon" title="دانلود"><Download className="w-4 h-4" /></Button>
                                                    </a>
                                                </>
                                            )}
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(m)}><Pencil className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => destroy(m)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Create / Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? 'ویرایش شماره' : 'افزودن شماره جدید'}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>شماره *</Label><Input type="number" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} /><InputError message={errors.number} /></div>
                            <div><Label>سال *</Label><Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="۱۴۰۴" /><InputError message={errors.year} /></div>
                        </div>
                        <div><Label>عنوان (دری) *</Label><Input value={form.title.da} onChange={(e) => setForm({ ...form, title: { ...form.title, da: e.target.value } })} placeholder="دری" /><InputError message={errors['title.da']} /></div>
                        <div><Label>عنوان (English)</Label><Input value={form.title.en ?? ''} onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })} placeholder="English" dir="ltr" /></div>
                        <div><Label>عنوان (العربية)</Label><Input value={form.title.ar ?? ''} onChange={(e) => setForm({ ...form, title: { ...form.title, ar: e.target.value } })} placeholder="العربية" /></div>
                        <div><Label>موضوع</Label><Input value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} /></div>
                        <div><Label>تعداد مقالات</Label><Input type="number" value={form.article_count} onChange={(e) => setForm({ ...form, article_count: Number(e.target.value) })} /></div>
                        <div><Label>توضیحات (دری)</Label><Textarea value={form.description?.da ?? ''} onChange={(e) => setForm({ ...form, description: { ...form.description, da: e.target.value } })} rows={3} /></div>
                        <div><Label>توضیحات (English)</Label><Textarea value={form.description?.en ?? ''} onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })} rows={3} dir="ltr" /></div>
                        <div><Label>توضیحات (العربية)</Label><Textarea value={form.description?.ar ?? ''} onChange={(e) => setForm({ ...form, description: { ...form.description, ar: e.target.value } })} rows={3} /></div>

                        {/* PDF Upload */}
                        <div>
                            <Label className="mb-2 block">فایل PDF مجله</Label>
                            {editing?.file_path && !selectedFile && (
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 mb-2">
                                    <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                                    <span className="text-sm text-gray-700 flex-1">فایل PDF موجود</span>
                                    {editing.file_size && <span className="text-xs text-gray-500">{formatBytes(editing.file_size)}</span>}
                                    <a href={`/majalla/${editing.id}/read`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                        <Eye className="w-3 h-3" /> مشاهده
                                    </a>
                                </div>
                            )}
                            {selectedFile && (
                                <div className="flex items-center gap-2 p-3 bg-rose-50 rounded-lg border border-rose-200 mb-2">
                                    <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                                    <span className="text-sm text-gray-700 truncate flex-1">{selectedFile.name}</span>
                                    <span className="text-xs text-gray-500">{formatBytes(selectedFile.size)}</span>
                                    <button onClick={() => { setSelectedFile(null); if (fileRef.current) fileRef.current.value = ''; }}>
                                        <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                    </button>
                                </div>
                            )}
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-rose-400 hover:bg-rose-50/30 transition-colors"
                                onClick={() => fileRef.current?.click()}
                            >
                                <BookOpen className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">برای آپلود PDF کلیک کنید</p>
                                <p className="text-xs text-gray-400 mt-1">فقط PDF — حداکثر ۵۰ مگابایت</p>
                            </div>
                            <input ref={fileRef} type="file" accept=".pdf" className="hidden"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)} />
                            <InputError message={errors.file} />
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: !!v })} id="featured" />
                            <Label htmlFor="featured">شماره ویژه</Label>
                        </div>
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
