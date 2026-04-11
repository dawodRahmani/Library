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
import { Plus, Pencil, Trash2, Search, Tags, MessageSquare, ImagePlus, X } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { CategoryPanel } from '@/components/admin/category-panel';
import type { CategoryItem } from '@/components/admin/category-panel';

type Category = CategoryItem;
interface FatwaItem {
    id: number; title: { da: string; en?: string; ar?: string; tg?: string }; description: { da: string; en?: string; ar?: string; tg?: string } | null; author: string;
    category_id: number; category: string; thumbnail: string | null; is_active: boolean; created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'داشبورد', href: '/dashboard' }, { title: 'دارالإفتاء', href: '/admin/fatwas' }];
const emptyForm = { title: { da: '', en: '', ar: '', tg: '' }, description: { da: '', en: '', ar: '', tg: '' }, author: '', category_id: '', is_active: true };

export default function FatwasIndex({ fatwas, categories }: { fatwas: FatwaItem[]; categories: Category[] }) {
    const [tab, setTab] = useState<'fatwas' | 'categories'>('fatwas');
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<FatwaItem | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const thumbRef = useRef<HTMLInputElement>(null);

    const filtered = fatwas.filter((f) => (f.title?.da ?? '').includes(search) || f.author.includes(search) || f.category.includes(search));

    function openCreate() { setEditing(null); setForm(emptyForm); setSelectedThumbnail(null); setErrors({}); setOpen(true); }
    function openEdit(f: FatwaItem) {
        setEditing(f);
        setForm({ title: { da: f.title?.da ?? '', en: f.title?.en ?? '', ar: f.title?.ar ?? '', tg: f.title?.tg ?? '' }, description: { da: f.description?.da ?? '', en: f.description?.en ?? '', ar: f.description?.ar ?? '', tg: f.description?.tg ?? '' }, author: f.author, category_id: String(f.category_id), is_active: f.is_active });
        setSelectedThumbnail(null); setErrors({}); setOpen(true);
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
        fd.append('author', form.author);
        fd.append('category_id', form.category_id);
        fd.append('is_active', form.is_active ? '1' : '0');
        if (selectedThumbnail) fd.append('thumbnail', selectedThumbnail);
        const url = editing ? `/admin/fatwas/${editing.id}` : '/admin/fatwas';
        router.post(url, fd, { forceFormData: true, onSuccess: () => { setOpen(false); setErrors({}); setSelectedThumbnail(null); }, onError: (e) => setErrors(e), onFinish: () => setProcessing(false) });
    }

    function destroy(f: FatwaItem) { if (confirm('آیا مطمئن هستید؟')) router.delete(`/admin/fatwas/${f.id}`); }

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
                            <TableHead className="w-10">#</TableHead><TableHead>عنوان</TableHead><TableHead>نویسنده</TableHead><TableHead>دسته‌بندی</TableHead><TableHead>تاریخ</TableHead><TableHead className="w-24">عملیات</TableHead>
                        </TableRow></TableHeader>
                        <TableBody>
                            {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">هیچ موردی یافت نشد</TableCell></TableRow>}
                            {filtered.map((f, i) => (
                                <TableRow key={f.id}>
                                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                    <TableCell className="font-medium">{f.title?.da}</TableCell>
                                    <TableCell>{f.author}</TableCell>
                                    <TableCell><Badge variant="secondary">{f.category}</Badge></TableCell>
                                    <TableCell className="text-muted-foreground">{f.created_at?.split(' ')[0]}</TableCell>
                                    <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(f)}><Pencil className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => destroy(f)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                </>}
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? 'ویرایش فتوا' : 'افزودن فتوای جدید'}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                        <div><Label>عنوان (دری) *</Label><Input value={form.title.da} onChange={(e) => setForm({ ...form, title: { ...form.title, da: e.target.value } })} placeholder="دری" /><InputError message={errors['title.da']} /></div>
                        <div><Label>عنوان (English)</Label><Input value={form.title.en ?? ''} onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })} placeholder="English" dir="ltr" /></div>
                        <div><Label>عنوان (العربية)</Label><Input value={form.title.ar ?? ''} onChange={(e) => setForm({ ...form, title: { ...form.title, ar: e.target.value } })} placeholder="العربية" /></div>
                        <div><Label>عنوان (Тоҷикӣ)</Label><Input value={form.title.tg ?? ''} onChange={(e) => setForm({ ...form, title: { ...form.title, tg: e.target.value } })} placeholder="Тоҷикӣ" dir="ltr" /></div>
                        <div><Label>نویسنده *</Label><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /><InputError message={errors.author} /></div>
                        <div><Label>دسته‌بندی *</Label>
                            <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}><SelectTrigger><SelectValue placeholder="انتخاب" /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name.da}</SelectItem>)}</SelectContent></Select>
                            <InputError message={errors.category_id} /></div>
                        <div><Label>توضیحات (دری)</Label><Textarea value={form.description.da} onChange={(e) => setForm({ ...form, description: { ...form.description, da: e.target.value } })} rows={4} /></div>
                        <div><Label>توضیحات (English)</Label><Textarea value={form.description.en ?? ''} onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })} rows={4} dir="ltr" /></div>
                        <div><Label>توضیحات (العربية)</Label><Textarea value={form.description.ar ?? ''} onChange={(e) => setForm({ ...form, description: { ...form.description, ar: e.target.value } })} rows={4} /></div>
                        <div><Label>توضیحات (Тоҷикӣ)</Label><Textarea value={form.description.tg ?? ''} onChange={(e) => setForm({ ...form, description: { ...form.description, tg: e.target.value } })} rows={4} dir="ltr" /></div>
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
