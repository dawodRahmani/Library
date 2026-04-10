import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
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
import { Plus, Pencil, Trash2, Search, Tags, MessageSquare } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { CategoryPanel } from '@/components/admin/category-panel';
import type { CategoryItem } from '@/components/admin/category-panel';

type Category = CategoryItem;
interface FatwaItem {
    id: number; title: { da: string; en?: string; ar?: string; tg?: string }; description: { da: string; en?: string; ar?: string } | null; author: string;
    category_id: number; category: string; is_active: boolean; created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'داشبورد', href: '/dashboard' }, { title: 'دارالإفتاء', href: '/admin/fatwas' }];
const emptyForm = { title: { da: '', en: '', ar: '', tg: '' }, description: { da: '', en: '', ar: '' }, author: '', category_id: '', is_active: true };

export default function FatwasIndex({ fatwas, categories }: { fatwas: FatwaItem[]; categories: Category[] }) {
    const [tab, setTab] = useState<'fatwas' | 'categories'>('fatwas');
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<FatwaItem | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const filtered = fatwas.filter((f) => (f.title?.da ?? '').includes(search) || f.author.includes(search) || f.category.includes(search));

    function openCreate() { setEditing(null); setForm(emptyForm); setErrors({}); setOpen(true); }
    function openEdit(f: FatwaItem) {
        setEditing(f);
        setForm({ title: { da: f.title?.da ?? '', en: f.title?.en ?? '', ar: f.title?.ar ?? '', tg: f.title?.tg ?? '' }, description: { da: f.description?.da ?? '', en: f.description?.en ?? '', ar: f.description?.ar ?? '' }, author: f.author, category_id: String(f.category_id), is_active: f.is_active });
        setErrors({}); setOpen(true);
    }

    function submit() {
        setProcessing(true);
        const payload = { ...form, category_id: Number(form.category_id) };
        const url = editing ? `/admin/fatwas/${editing.id}` : '/admin/fatwas';
        router[editing ? 'put' : 'post'](url, payload, { onSuccess: () => { setOpen(false); setErrors({}); }, onError: (e) => setErrors(e), onFinish: () => setProcessing(false) });
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
                    </div>
                    <DialogFooter><DialogClose asChild><Button variant="outline">انصراف</Button></DialogClose><Button onClick={submit} disabled={processing}>{processing ? 'در حال ذخیره...' : editing ? 'بروزرسانی' : 'ذخیره'}</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
