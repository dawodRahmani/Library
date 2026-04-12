import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { Plus, Pencil, Trash2, Tags } from 'lucide-react';

export interface CategoryItem {
    id: number;
    name: { da: string; en?: string; ar?: string; tg?: string };
    slug: string;
    sort_order: number;
}

interface Props {
    categories: CategoryItem[];
    type: 'book' | 'video' | 'audio' | 'fatwa' | 'article' | 'magazine';
}

const emptyForm = { name: { da: '', en: '', ar: '', tg: '' }, slug: '', sort_order: 0 };

export function CategoryPanel({ categories, type }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<CategoryItem | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    function openCreate() {
        setEditing(null);
        setForm(emptyForm);
        setErrors({});
        setOpen(true);
    }

    function openEdit(c: CategoryItem) {
        setEditing(c);
        setForm({
            name: { da: c.name?.da ?? '', en: c.name?.en ?? '', ar: c.name?.ar ?? '', tg: c.name?.tg ?? '' },
            slug: c.slug,
            sort_order: c.sort_order,
        });
        setErrors({});
        setOpen(true);
    }

    // Auto-generate slug from Dari name
    function handleNameChange(da: string) {
        const slug = !editing
            ? da.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '')
            : form.slug;
        setForm((f) => ({ ...f, name: { ...f.name, da }, slug }));
    }

    function submit() {
        setProcessing(true);
        const payload = { ...form, type };
        const url = editing ? `/admin/categories/${editing.id}` : '/admin/categories';
        router[editing ? 'put' : 'post'](url, payload, {
            onSuccess: () => { setOpen(false); setErrors({}); },
            onError: (e) => setErrors(e),
            onFinish: () => setProcessing(false),
        });
    }

    function destroy(c: CategoryItem) {
        if (!confirm(`دسته‌بندی "${c.name?.da}" حذف شود؟ محتوای مرتبط بدون دسته‌بندی می‌ماند.`)) return;
        router.delete(`/admin/categories/${c.id}`);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tags className="w-4 h-4" />
                    <span>{categories.length} دسته‌بندی</span>
                </div>
                <Button onClick={openCreate} size="sm" variant="outline">
                    <Plus className="w-4 h-4 me-1" /> دسته‌بندی جدید
                </Button>
            </div>

            {categories.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                    <Tags className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">هنوز دسته‌بندی ایجاد نشده</p>
                    <Button onClick={openCreate} size="sm" className="mt-3">
                        <Plus className="w-4 h-4 me-1" /> افزودن اولین دسته‌بندی
                    </Button>
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10">#</TableHead>
                                <TableHead>نام (دری)</TableHead>
                                <TableHead>نام (EN)</TableHead>
                                <TableHead>نام (AR)</TableHead>
                                <TableHead>نام (TG)</TableHead>
                                <TableHead>اسلاگ</TableHead>
                                <TableHead className="w-20">ترتیب</TableHead>
                                <TableHead className="w-24">عملیات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((c, i) => (
                                <TableRow key={c.id}>
                                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                    <TableCell className="font-medium">{c.name?.da}</TableCell>
                                    <TableCell className="text-muted-foreground">{c.name?.en || '—'}</TableCell>
                                    <TableCell className="text-muted-foreground">{c.name?.ar || '—'}</TableCell>
                                    <TableCell className="text-muted-foreground">{c.name?.tg || '—'}</TableCell>
                                    <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{c.slug}</code></TableCell>
                                    <TableCell>{c.sort_order}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => destroy(c)}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div>
                            <Label>نام (دری) *</Label>
                            <Input
                                value={form.name.da}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="مثال: عقیده و منهج"
                            />
                            <InputError message={errors['name.da']} />
                        </div>
                        <div>
                            <Label>نام (English)</Label>
                            <Input
                                value={form.name.en ?? ''}
                                onChange={(e) => setForm({ ...form, name: { ...form.name, en: e.target.value } })}
                                placeholder="e.g. Aqeedah and Manhaj"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <Label>نام (العربية)</Label>
                            <Input
                                value={form.name.ar ?? ''}
                                onChange={(e) => setForm({ ...form, name: { ...form.name, ar: e.target.value } })}
                                placeholder="مثال: العقيدة والمنهج"
                            />
                        </div>
                        <div>
                            <Label>نام (Тоҷикӣ)</Label>
                            <Input
                                value={form.name.tg ?? ''}
                                onChange={(e) => setForm({ ...form, name: { ...form.name, tg: e.target.value } })}
                                placeholder="мثال: Ақида ва Манҳаҷ"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <Label>اسلاگ *</Label>
                            <Input
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                placeholder="e.g. aqeedah"
                                dir="ltr"
                            />
                            <p className="text-xs text-muted-foreground mt-1">فقط حروف انگلیسی، عدد و خط تیره</p>
                            <InputError message={errors.slug} />
                        </div>
                        <div>
                            <Label>ترتیب نمایش</Label>
                            <Input
                                type="number"
                                value={form.sort_order}
                                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                            />
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
        </div>
    );
}
