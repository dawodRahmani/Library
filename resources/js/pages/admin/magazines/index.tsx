import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
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
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface MagazineItem {
    id: number; number: number; title: { da: string; en?: string }; theme: string | null; year: string;
    article_count: number; description: { da: string; en?: string } | null; featured: boolean;
    articles: string[] | null; is_active: boolean; created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'داشبورد', href: '/dashboard' }, { title: 'مجله', href: '/admin/magazines' }];
const emptyForm = { number: '', title: { da: '' }, theme: '', year: '', article_count: 0, description: { da: '' }, featured: false, is_active: true };

export default function MagazinesIndex({ magazines }: { magazines: MagazineItem[] }) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<MagazineItem | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const filtered = magazines.filter((m) => (m.title?.da ?? '').includes(search) || m.year.includes(search));

    function openCreate() { setEditing(null); setForm(emptyForm); setErrors({}); setOpen(true); }
    function openEdit(m: MagazineItem) {
        setEditing(m);
        setForm({ number: String(m.number), title: m.title ?? { da: '' }, theme: m.theme ?? '', year: m.year, article_count: m.article_count, description: m.description ?? { da: '' }, featured: m.featured, is_active: m.is_active });
        setErrors({}); setOpen(true);
    }

    function submit() {
        setProcessing(true);
        const payload = { ...form, number: Number(form.number) };
        const url = editing ? `/admin/magazines/${editing.id}` : '/admin/magazines';
        router[editing ? 'put' : 'post'](url, payload, { onSuccess: () => { setOpen(false); setErrors({}); }, onError: (e) => setErrors(e), onFinish: () => setProcessing(false) });
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
                <div className="relative max-w-sm"><Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" /></div>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader><TableRow>
                            <TableHead className="w-10">#</TableHead><TableHead>شماره</TableHead><TableHead>عنوان</TableHead><TableHead>سال</TableHead><TableHead>ویژه</TableHead><TableHead className="w-24">عملیات</TableHead>
                        </TableRow></TableHeader>
                        <TableBody>
                            {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">هیچ شماره‌ای یافت نشد</TableCell></TableRow>}
                            {filtered.map((m, i) => (
                                <TableRow key={m.id}>
                                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                    <TableCell className="font-medium">{m.number}</TableCell>
                                    <TableCell>{m.title?.da}</TableCell>
                                    <TableCell>{m.year}</TableCell>
                                    <TableCell>{m.featured ? <Badge>ویژه</Badge> : '—'}</TableCell>
                                    <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(m)}><Pencil className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => destroy(m)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? 'ویرایش شماره' : 'افزودن شماره جدید'}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>شماره *</Label><Input type="number" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} /><InputError message={errors.number} /></div>
                            <div><Label>سال *</Label><Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="۱۴۰۴" /><InputError message={errors.year} /></div>
                        </div>
                        <div><Label>عنوان (دری) *</Label><Input value={form.title.da} onChange={(e) => setForm({ ...form, title: { ...form.title, da: e.target.value } })} /><InputError message={errors['title.da']} /></div>
                        <div><Label>موضوع</Label><Input value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} /></div>
                        <div><Label>تعداد مقالات</Label><Input type="number" value={form.article_count} onChange={(e) => setForm({ ...form, article_count: Number(e.target.value) })} /></div>
                        <div><Label>توضیحات (دری)</Label><Textarea value={form.description.da} onChange={(e) => setForm({ ...form, description: { ...form.description, da: e.target.value } })} rows={3} /></div>
                        <div className="flex items-center gap-2">
                            <Checkbox checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: !!v })} id="featured" />
                            <Label htmlFor="featured">شماره ویژه</Label>
                        </div>
                    </div>
                    <DialogFooter><DialogClose asChild><Button variant="outline">انصراف</Button></DialogClose><Button onClick={submit} disabled={processing}>{processing ? 'در حال ذخیره...' : editing ? 'بروزرسانی' : 'ذخیره'}</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
