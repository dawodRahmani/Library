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
interface VideoItem {
    id: number; title: { da: string; en?: string }; instructor: string; category_id: number; category: string;
    duration: string | null; views: number; year: number | null; status: string;
    description: { da: string; en?: string } | null; video_url: string | null; is_active: boolean; created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'ویدیوها', href: '/admin/videos' },
];

const emptyForm = { title: { da: '' }, instructor: '', category_id: '', duration: '', views: 0, year: '', status: 'available', description: { da: '' }, video_url: '', is_active: true };

export default function VideosIndex({ videos, categories }: { videos: VideoItem[]; categories: Category[] }) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<VideoItem | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const filtered = videos.filter((v) => (v.title?.da ?? '').includes(search) || v.instructor.includes(search) || v.category.includes(search));

    function openCreate() { setEditing(null); setForm(emptyForm); setErrors({}); setOpen(true); }
    function openEdit(v: VideoItem) {
        setEditing(v);
        setForm({ title: v.title ?? { da: '' }, instructor: v.instructor, category_id: String(v.category_id), duration: v.duration ?? '', views: v.views, year: v.year ? String(v.year) : '', status: v.status, description: v.description ?? { da: '' }, video_url: v.video_url ?? '', is_active: v.is_active });
        setErrors({}); setOpen(true);
    }

    function submit() {
        setProcessing(true);
        const payload = { ...form, category_id: Number(form.category_id), year: form.year ? Number(form.year) : null };
        const url = editing ? `/admin/videos/${editing.id}` : '/admin/videos';
        router[editing ? 'put' : 'post'](url, payload, { onSuccess: () => { setOpen(false); setErrors({}); }, onError: (e) => setErrors(e), onFinish: () => setProcessing(false) });
    }

    function destroy(v: VideoItem) { if (confirm('آیا مطمئن هستید؟')) router.delete(`/admin/videos/${v.id}`); }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مدیریت ویدیوها" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">مدیریت ویدیوها</h1>
                    <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4 me-1" /> افزودن ویدیو</Button>
                </div>
                <div className="relative max-w-sm">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
                </div>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader><TableRow>
                            <TableHead className="w-10">#</TableHead><TableHead>عنوان</TableHead><TableHead>استاد</TableHead>
                            <TableHead>دسته‌بندی</TableHead><TableHead>مدت</TableHead><TableHead>وضعیت</TableHead><TableHead className="w-24">عملیات</TableHead>
                        </TableRow></TableHeader>
                        <TableBody>
                            {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">هیچ ویدیویی یافت نشد</TableCell></TableRow>}
                            {filtered.map((v, i) => (
                                <TableRow key={v.id}>
                                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                    <TableCell className="font-medium">{v.title?.da}</TableCell>
                                    <TableCell>{v.instructor}</TableCell>
                                    <TableCell><Badge variant="secondary">{v.category}</Badge></TableCell>
                                    <TableCell>{v.duration}</TableCell>
                                    <TableCell><Badge variant={v.status === 'available' ? 'default' : 'outline'}>{v.status === 'available' ? 'در دسترس' : v.status === 'restricted' ? 'محدود' : 'آرشیو'}</Badge></TableCell>
                                    <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(v)}><Pencil className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => destroy(v)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? 'ویرایش ویدیو' : 'افزودن ویدیو جدید'}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                        <div><Label>عنوان (دری) *</Label><Input value={form.title.da} onChange={(e) => setForm({ ...form, title: { ...form.title, da: e.target.value } })} /><InputError message={errors['title.da']} /></div>
                        <div><Label>استاد *</Label><Input value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} /><InputError message={errors.instructor} /></div>
                        <div><Label>دسته‌بندی *</Label>
                            <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}><SelectTrigger><SelectValue placeholder="انتخاب" /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name.da}</SelectItem>)}</SelectContent></Select>
                            <InputError message={errors.category_id} /></div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>مدت</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="1:30:00" /></div>
                            <div><Label>سال</Label><Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} /></div>
                        </div>
                        <div><Label>وضعیت</Label>
                            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="available">در دسترس</SelectItem><SelectItem value="restricted">محدود</SelectItem><SelectItem value="archived">آرشیو</SelectItem></SelectContent></Select></div>
                        <div><Label>لینک ویدیو</Label><Input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} /></div>
                        <div><Label>توضیحات (دری)</Label><Textarea value={form.description.da} onChange={(e) => setForm({ ...form, description: { ...form.description, da: e.target.value } })} rows={3} /></div>
                    </div>
                    <DialogFooter><DialogClose asChild><Button variant="outline">انصراف</Button></DialogClose><Button onClick={submit} disabled={processing}>{processing ? 'در حال ذخیره...' : editing ? 'بروزرسانی' : 'ذخیره'}</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
