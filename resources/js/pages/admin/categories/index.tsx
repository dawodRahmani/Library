import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface CategoryItem {
    id: number; name: { da: string; en?: string; ar?: string; tg?: string }; slug: string; type: string; sort_order: number;
}

const TYPE_LABELS: Record<string, string> = { book: 'کتاب', video: 'ویدیو', audio: 'صوت', fatwa: 'فتوا', magazine: 'مجله' };
const breadcrumbs: BreadcrumbItem[] = [{ title: 'داشبورد', href: '/dashboard' }, { title: 'دسته‌بندی‌ها', href: '/admin/categories' }];
const emptyForm = { name: { da: '', en: '', ar: '', tg: '' }, slug: '', type: 'book', sort_order: 0 };

export default function CategoriesIndex({ categories }: { categories: CategoryItem[] }) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<CategoryItem | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const filtered = categories.filter((c) => (c.name?.da ?? '').includes(search) || c.slug.includes(search) || c.type.includes(search));

    function openCreate() { setEditing(null); setForm(emptyForm); setErrors({}); setOpen(true); }
    function openEdit(c: CategoryItem) {
        setEditing(c);
        setForm({ name: { da: c.name?.da ?? '', en: c.name?.en ?? '', ar: c.name?.ar ?? '', tg: c.name?.tg ?? '' }, slug: c.slug, type: c.type, sort_order: c.sort_order });
        setErrors({}); setOpen(true);
    }

    function submit() {
        setProcessing(true);
        const url = editing ? `/admin/categories/${editing.id}` : '/admin/categories';
        router[editing ? 'put' : 'post'](url, form, { onSuccess: () => { setOpen(false); setErrors({}); }, onError: (e) => setErrors(e), onFinish: () => setProcessing(false) });
    }

    function destroy(c: CategoryItem) { if (confirm('آیا مطمئن هستید؟ محتوای مرتبط نیز حذف خواهد شد.')) router.delete(`/admin/categories/${c.id}`); }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مدیریت دسته‌بندی‌ها" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">مدیریت دسته‌بندی‌ها</h1>
                    <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4 me-1" /> افزودن دسته‌بندی</Button>
                </div>
                <div className="relative max-w-sm"><Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" /></div>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader><TableRow>
                            <TableHead className="w-10">#</TableHead><TableHead>نام (دری)</TableHead><TableHead>نام (EN)</TableHead><TableHead>نام (AR)</TableHead><TableHead>نام (TG)</TableHead><TableHead>اسلاگ</TableHead><TableHead>نوع</TableHead><TableHead>ترتیب</TableHead><TableHead className="w-24">عملیات</TableHead>
                        </TableRow></TableHeader>
                        <TableBody>
                            {filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">هیچ دسته‌بندی یافت نشد</TableCell></TableRow>}
                            {filtered.map((c, i) => (
                                <TableRow key={c.id}>
                                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                    <TableCell className="font-medium">{c.name?.da}</TableCell>
                                    <TableCell className="text-muted-foreground">{c.name?.en ?? '—'}</TableCell>
                                    <TableCell className="text-muted-foreground">{c.name?.ar ?? '—'}</TableCell>
                                    <TableCell className="text-muted-foreground">{c.name?.tg ?? '—'}</TableCell>
                                    <TableCell><code className="text-xs">{c.slug}</code></TableCell>
                                    <TableCell><Badge variant="secondary">{TYPE_LABELS[c.type] ?? c.type}</Badge></TableCell>
                                    <TableCell>{c.sort_order}</TableCell>
                                    <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => destroy(c)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                        <div><Label>نام (دری) *</Label><Input value={form.name.da} onChange={(e) => setForm({ ...form, name: { ...form.name, da: e.target.value } })} placeholder="دری" /><InputError message={errors['name.da']} /></div>
                        <div><Label>نام (English)</Label><Input value={form.name.en ?? ''} onChange={(e) => setForm({ ...form, name: { ...form.name, en: e.target.value } })} placeholder="English" dir="ltr" /></div>
                        <div><Label>نام (العربية)</Label><Input value={form.name.ar ?? ''} onChange={(e) => setForm({ ...form, name: { ...form.name, ar: e.target.value } })} placeholder="العربية" /></div>
                        <div><Label>نام (Тоҷикӣ)</Label><Input value={form.name.tg ?? ''} onChange={(e) => setForm({ ...form, name: { ...form.name, tg: e.target.value } })} placeholder="Тоҷикӣ" dir="ltr" /></div>
                        <div><Label>اسلاگ *</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="e.g. aqeedah" /><InputError message={errors.slug} /></div>
                        <div><Label>نوع *</Label>
                            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                                {Object.entries(TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                            </SelectContent></Select><InputError message={errors.type} /></div>
                        <div><Label>ترتیب</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
                    </div>
                    <DialogFooter><DialogClose asChild><Button variant="outline">انصراف</Button></DialogClose><Button onClick={submit} disabled={processing}>{processing ? 'در حال ذخیره...' : editing ? 'بروزرسانی' : 'ذخیره'}</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
