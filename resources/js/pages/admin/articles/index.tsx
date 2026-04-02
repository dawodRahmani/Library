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
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Category { id: number; name: { da: string; en?: string } }
interface ArticleItem {
    id: number; title: { da: string; en?: string }; slug: string; excerpt: { da: string; en?: string } | null;
    content: { da: string; en?: string } | null; author: string; category_id: number; category: string;
    read_time: string | null; is_active: boolean; created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'داشبورد', href: '/dashboard' }, { title: 'مقاله‌ها', href: '/admin/articles' }];
const emptyForm = { title: { da: '' }, excerpt: { da: '' }, content: { da: '' }, author: '', category_id: '', read_time: '', is_active: true };

export default function ArticlesIndex({ articles, categories }: { articles: ArticleItem[]; categories: Category[] }) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ArticleItem | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const filtered = articles.filter((a) => (a.title?.da ?? '').includes(search) || a.author.includes(search) || a.category.includes(search));

    function openCreate() { setEditing(null); setForm(emptyForm); setErrors({}); setOpen(true); }
    function openEdit(a: ArticleItem) {
        setEditing(a);
        setForm({ title: a.title ?? { da: '' }, excerpt: a.excerpt ?? { da: '' }, content: a.content ?? { da: '' }, author: a.author, category_id: String(a.category_id), read_time: a.read_time ?? '', is_active: a.is_active });
        setErrors({}); setOpen(true);
    }

    function submit() {
        setProcessing(true);
        const payload = { ...form, category_id: Number(form.category_id) };
        const url = editing ? `/admin/articles/${editing.id}` : '/admin/articles';
        router[editing ? 'put' : 'post'](url, payload, { onSuccess: () => { setOpen(false); setErrors({}); }, onError: (e) => setErrors(e), onFinish: () => setProcessing(false) });
    }

    function destroy(a: ArticleItem) { if (confirm('آیا مطمئن هستید؟')) router.delete(`/admin/articles/${a.id}`); }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مدیریت مقاله‌ها" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">مدیریت مقاله‌ها</h1>
                    <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4 me-1" /> افزودن مقاله</Button>
                </div>
                <div className="relative max-w-sm"><Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" /></div>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader><TableRow>
                            <TableHead className="w-10">#</TableHead><TableHead>عنوان</TableHead><TableHead>نویسنده</TableHead><TableHead>دسته‌بندی</TableHead><TableHead>مدت مطالعه</TableHead><TableHead className="w-24">عملیات</TableHead>
                        </TableRow></TableHeader>
                        <TableBody>
                            {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">هیچ مقاله‌ای یافت نشد</TableCell></TableRow>}
                            {filtered.map((a, i) => (
                                <TableRow key={a.id}>
                                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                    <TableCell className="font-medium">{a.title?.da}</TableCell>
                                    <TableCell>{a.author}</TableCell>
                                    <TableCell><Badge variant="secondary">{a.category}</Badge></TableCell>
                                    <TableCell>{a.read_time ?? '—'}</TableCell>
                                    <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => destroy(a)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? 'ویرایش مقاله' : 'افزودن مقاله جدید'}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                        <div><Label>عنوان (دری) *</Label><Input value={form.title.da} onChange={(e) => setForm({ ...form, title: { ...form.title, da: e.target.value } })} /><InputError message={errors['title.da']} /></div>
                        <div><Label>نویسنده *</Label><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /><InputError message={errors.author} /></div>
                        <div><Label>دسته‌بندی *</Label>
                            <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}><SelectTrigger><SelectValue placeholder="انتخاب" /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name.da}</SelectItem>)}</SelectContent></Select>
                            <InputError message={errors.category_id} /></div>
                        <div><Label>مدت مطالعه</Label><Input value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })} placeholder="۱۰ دقیقه" /></div>
                        <div><Label>خلاصه (دری)</Label><Textarea value={form.excerpt.da} onChange={(e) => setForm({ ...form, excerpt: { ...form.excerpt, da: e.target.value } })} rows={2} /></div>
                        <div><Label>محتوا (دری)</Label><Textarea value={form.content.da} onChange={(e) => setForm({ ...form, content: { ...form.content, da: e.target.value } })} rows={6} /></div>
                    </div>
                    <DialogFooter><DialogClose asChild><Button variant="outline">انصراف</Button></DialogClose><Button onClick={submit} disabled={processing}>{processing ? 'در حال ذخیره...' : editing ? 'بروزرسانی' : 'ذخیره'}</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
