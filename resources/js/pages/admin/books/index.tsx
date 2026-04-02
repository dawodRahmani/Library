import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name: { da: string; en?: string };
}

interface Book {
    id: number;
    title: { da: string; en?: string };
    author: string;
    category_id: number;
    category: string;
    year: number | null;
    isbn: string | null;
    status: string;
    copies: number;
    available: number;
    rating: number;
    description: { da: string; en?: string } | null;
    pages: number | null;
    publisher: string | null;
    cover_image: string | null;
    is_active: boolean;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'کتاب‌ها', href: '/admin/books' },
];

const emptyForm = {
    title: { da: '' },
    author: '',
    category_id: '',
    year: '',
    isbn: '',
    status: 'available',
    copies: 1,
    available: 1,
    rating: 0,
    description: { da: '' },
    pages: '',
    publisher: '',
    is_active: true,
};

export default function BooksIndex({ books, categories }: { books: Book[]; categories: Category[] }) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Book | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const filtered = books.filter(
        (b) =>
            (b.title?.da ?? '').includes(search) ||
            b.author.includes(search) ||
            b.category.includes(search),
    );

    function openCreate() {
        setEditing(null);
        setForm(emptyForm);
        setErrors({});
        setOpen(true);
    }

    function openEdit(book: Book) {
        setEditing(book);
        setForm({
            title: book.title ?? { da: '' },
            author: book.author,
            category_id: String(book.category_id),
            year: book.year ? String(book.year) : '',
            isbn: book.isbn ?? '',
            status: book.status,
            copies: book.copies,
            available: book.available,
            rating: book.rating,
            description: book.description ?? { da: '' },
            pages: book.pages ? String(book.pages) : '',
            publisher: book.publisher ?? '',
            is_active: book.is_active,
        });
        setErrors({});
        setOpen(true);
    }

    function submit() {
        setProcessing(true);
        const payload = {
            ...form,
            category_id: Number(form.category_id),
            year: form.year ? Number(form.year) : null,
            pages: form.pages ? Number(form.pages) : null,
        };

        const url = editing ? `/admin/books/${editing.id}` : '/admin/books';
        const method = editing ? 'put' : 'post';

        router[method](url, payload, {
            onSuccess: () => { setOpen(false); setErrors({}); },
            onError: (errs) => setErrors(errs),
            onFinish: () => setProcessing(false),
        });
    }

    function destroy(book: Book) {
        if (!confirm('آیا مطمئن هستید؟')) return;
        router.delete(`/admin/books/${book.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مدیریت کتاب‌ها" />

            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">مدیریت کتاب‌ها</h1>
                    <Button onClick={openCreate} size="sm">
                        <Plus className="w-4 h-4 me-1" /> افزودن کتاب
                    </Button>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="جستجو..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="ps-9"
                    />
                </div>

                {/* Table */}
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10">#</TableHead>
                                <TableHead>عنوان</TableHead>
                                <TableHead>نویسنده</TableHead>
                                <TableHead>دسته‌بندی</TableHead>
                                <TableHead>وضعیت</TableHead>
                                <TableHead>نسخه‌ها</TableHead>
                                <TableHead className="w-24">عملیات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        هیچ کتابی یافت نشد
                                    </TableCell>
                                </TableRow>
                            )}
                            {filtered.map((book, i) => (
                                <TableRow key={book.id}>
                                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                    <TableCell className="font-medium">{book.title?.da}</TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell><Badge variant="secondary">{book.category}</Badge></TableCell>
                                    <TableCell>
                                        <Badge variant={book.status === 'available' ? 'default' : 'outline'}>
                                            {book.status === 'available' ? 'موجود' : book.status === 'borrowed' ? 'امانت' : 'رزرو'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{book.available}/{book.copies}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(book)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => destroy(book)}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'ویرایش کتاب' : 'افزودن کتاب جدید'}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div>
                            <Label>عنوان (دری) *</Label>
                            <Input value={form.title.da} onChange={(e) => setForm({ ...form, title: { ...form.title, da: e.target.value } })} />
                            <InputError message={errors['title.da']} />
                        </div>
                        <div>
                            <Label>نویسنده *</Label>
                            <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                            <InputError message={errors.author} />
                        </div>
                        <div>
                            <Label>دسته‌بندی *</Label>
                            <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                                <SelectTrigger><SelectValue placeholder="انتخاب دسته‌بندی" /></SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>{c.name.da}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category_id} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>سال</Label>
                                <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
                            </div>
                            <div>
                                <Label>شابک</Label>
                                <Input value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <Label>وضعیت</Label>
                            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">موجود</SelectItem>
                                    <SelectItem value="borrowed">امانت داده شده</SelectItem>
                                    <SelectItem value="reserved">رزرو شده</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <Label>نسخه‌ها</Label>
                                <Input type="number" value={form.copies} onChange={(e) => setForm({ ...form, copies: Number(e.target.value) })} />
                            </div>
                            <div>
                                <Label>موجود</Label>
                                <Input type="number" value={form.available} onChange={(e) => setForm({ ...form, available: Number(e.target.value) })} />
                            </div>
                            <div>
                                <Label>امتیاز</Label>
                                <Input type="number" min={0} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>صفحات</Label>
                                <Input type="number" value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} />
                            </div>
                            <div>
                                <Label>ناشر</Label>
                                <Input value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <Label>توضیحات (دری)</Label>
                            <Textarea
                                value={form.description.da}
                                onChange={(e) => setForm({ ...form, description: { ...form.description, da: e.target.value } })}
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">انصراف</Button>
                        </DialogClose>
                        <Button onClick={submit} disabled={processing}>
                            {processing ? 'در حال ذخیره...' : editing ? 'بروزرسانی' : 'ذخیره'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
