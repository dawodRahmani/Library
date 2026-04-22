import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { CategoryPanel } from '@/components/admin/category-panel';
import type { CategoryItem } from '@/components/admin/category-panel';
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
import { Plus, Pencil, Trash2, Search, Upload, FileText, X, Download, Tags, BookOpen, ImagePlus } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

type Category = CategoryItem;

interface Book {
    id: number;
    title: { da: string; en?: string; ar?: string; tg?: string };
    author: string;
    category_id: number;
    category: string;
    year: number | null;
    isbn: string | null;
    copies: number;
    available: number;
    rating: number;
    description: { da: string; en?: string; ar?: string; tg?: string } | null;
    pages: number | null;
    publisher: string | null;
    cover_image: string | null;
    file_path: string | null;
    file_type: string | null;
    file_size: number | null;
    file_url: string | null;
    is_active: boolean;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'کتاب‌ها', href: '/admin/books' },
];

const emptyForm = {
    title: { da: '', en: '', ar: '', tg: '' },
    author: '',
    category_id: '',
    year: '',
    isbn: '',
    copies: 1,
    available: 1,
    rating: 0,
    description: { da: '', en: '', ar: '', tg: '' },
    pages: '',
    publisher: '',
    file_url: '',
    is_active: true,
};

function formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function BooksIndex({ books, categories }: { books: Book[]; categories: Category[] }) {
    const [tab, setTab] = useState<'books' | 'categories'>('books');
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Book | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const thumbRef = useRef<HTMLInputElement>(null);

    const filtered = books.filter(
        (b) =>
            (b.title?.da ?? '').includes(search) ||
            b.author.includes(search) ||
            b.category.includes(search),
    );

    function openCreate() {
        setEditing(null);
        setForm(emptyForm);
        setSelectedFile(null);
        setSelectedThumbnail(null);
        setErrors({});
        setOpen(true);
    }

    function openEdit(book: Book) {
        setEditing(book);
        setForm({
            title: { da: book.title?.da ?? '', en: book.title?.en ?? '', ar: book.title?.ar ?? '', tg: book.title?.tg ?? '' },
            author: book.author,
            category_id: String(book.category_id),
            year: book.year ? String(book.year) : '',
            isbn: book.isbn ?? '',
            copies: book.copies,
            available: book.available,
            rating: book.rating,
            description: { da: book.description?.da ?? '', en: book.description?.en ?? '', ar: book.description?.ar ?? '', tg: book.description?.tg ?? '' },
            pages: book.pages ? String(book.pages) : '',
            publisher: book.publisher ?? '',
            file_url: book.file_url ?? '',
            is_active: book.is_active,
        });
        setSelectedFile(null);
        setSelectedThumbnail(null);
        setErrors({});
        setOpen(true);
    }

    function submit() {
        setProcessing(true);

        const buildFd = (withMethod?: string) => {
            const fd = new FormData();
            if (withMethod) fd.append('_method', withMethod);
            fd.append('title[da]', form.title.da);
            fd.append('title[en]', form.title.en ?? '');
            fd.append('title[ar]', form.title.ar ?? '');
            fd.append('title[tg]', form.title.tg ?? '');
            fd.append('author', form.author);
            fd.append('category_id', String(form.category_id));
            fd.append('year', form.year ? String(Number(form.year)) : '');
            fd.append('isbn', form.isbn);
            fd.append('copies', String(form.copies));
            fd.append('available', String(form.available));
            fd.append('rating', String(form.rating));
            fd.append('description[da]', form.description.da);
            fd.append('description[en]', form.description.en ?? '');
            fd.append('description[ar]', form.description.ar ?? '');
            fd.append('description[tg]', form.description.tg ?? '');
            fd.append('pages', form.pages ? String(Number(form.pages)) : '');
            fd.append('publisher', form.publisher);
            fd.append('file_url', form.file_url);
            fd.append('is_active', form.is_active ? '1' : '0');
            if (selectedFile) fd.append('file', selectedFile);
            if (selectedThumbnail) fd.append('cover_image', selectedThumbnail);
            return fd;
        };

        const url = editing ? `/admin/books/${editing.id}` : '/admin/books';
        const payload = buildFd(editing ? 'PUT' : undefined);

        router.post(url, payload, {
            forceFormData: true,
            onSuccess: () => { setOpen(false); setErrors({}); setSelectedFile(null); setSelectedThumbnail(null); },
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
                    {tab === 'books' && (
                        <Button onClick={openCreate} size="sm">
                            <Plus className="w-4 h-4 me-1" /> افزودن کتاب
                        </Button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-gray-200">
                    <button
                        onClick={() => setTab('books')}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === 'books' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        <BookOpen className="w-4 h-4" /> کتاب‌ها ({books.length})
                    </button>
                    <button
                        onClick={() => setTab('categories')}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === 'categories' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        <Tags className="w-4 h-4" /> دسته‌بندی‌ها ({categories.length})
                    </button>
                </div>

                {tab === 'categories' && <CategoryPanel categories={categories} type="book" />}

                {tab === 'books' && <>
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
                                <TableHead className="w-16">تصویر</TableHead>
                                <TableHead>عنوان</TableHead>
                                <TableHead>نویسنده</TableHead>
                                <TableHead>دسته‌بندی</TableHead>
                                <TableHead>فایل</TableHead>
                                <TableHead>نسخه‌ها</TableHead>
                                <TableHead className="w-24">عملیات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        هیچ کتابی یافت نشد
                                    </TableCell>
                                </TableRow>
                            )}
                            {filtered.map((book, i) => (
                                <TableRow key={book.id}>
                                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                    <TableCell>
                                        {book.cover_image ? (
                                            <img src={book.cover_image.startsWith('http') ? book.cover_image : `/storage/${book.cover_image}`} alt={book.title?.da} className="w-10 h-14 object-cover rounded border border-gray-200" />
                                        ) : (
                                            <div className="w-10 h-14 rounded border border-gray-200 bg-gray-50 flex items-center justify-center">
                                                <BookOpen className="w-4 h-4 text-gray-300" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{book.title?.da}</TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell><Badge variant="secondary">{book.category}</Badge></TableCell>
                                    <TableCell>
                                        {book.file_path ? (
                                            <div className="flex items-center gap-1.5">
                                                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 gap-1">
                                                    <FileText className="w-3 h-3" />
                                                    {book.file_type?.toUpperCase()}
                                                </Badge>
                                                {book.file_size && (
                                                    <span className="text-xs text-muted-foreground">{formatBytes(book.file_size)}</span>
                                                )}
                                                <button
                                                    onClick={() => { window.location.href = `/library/books/${book.id}/download`; }}
                                                    className="text-muted-foreground hover:text-foreground"
                                                    title="دانلود"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">—</span>
                                        )}
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
                </>}
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
                        <div>
                            <Label>توضیحات (English)</Label>
                            <Textarea
                                value={form.description.en ?? ''}
                                onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })}
                                rows={3}
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <Label>توضیحات (العربية)</Label>
                            <Textarea
                                value={form.description.ar ?? ''}
                                onChange={(e) => setForm({ ...form, description: { ...form.description, ar: e.target.value } })}
                                rows={3}
                            />
                        </div>
                        <div>
                            <Label>توضیحات (Тоҷикӣ)</Label>
                            <Textarea
                                value={form.description.tg ?? ''}
                                onChange={(e) => setForm({ ...form, description: { ...form.description, tg: e.target.value } })}
                                rows={3}
                                dir="ltr"
                            />
                        </div>

                        {/* Cover Image / Thumbnail */}
                        <div>
                            <Label className="mb-2 block">تصویر جلد (Thumbnail)</Label>
                            {editing?.cover_image && !selectedThumbnail && (
                                <div className="mb-2 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={editing.cover_image.startsWith('http') ? editing.cover_image : `/storage/${editing.cover_image}`} alt="cover" className="w-full h-40 object-cover" />
                                    <p className="text-xs text-gray-400 px-2 py-1">تصویر فعلی — آپلود جدید جایگزین می‌شود</p>
                                </div>
                            )}
                            {selectedThumbnail && (
                                <div className="mb-2 rounded-lg overflow-hidden border border-emerald-200 relative">
                                    <img src={URL.createObjectURL(selectedThumbnail)} alt="preview" className="w-full h-40 object-cover" />
                                    <button type="button" onClick={() => { setSelectedThumbnail(null); if (thumbRef.current) thumbRef.current.value = ''; }} className="absolute top-1 end-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white"><X className="w-3 h-3" /></button>
                                </div>
                            )}
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors" onClick={() => thumbRef.current?.click()}>
                                <ImagePlus className="w-5 h-5 mx-auto mb-1.5 text-gray-400" />
                                <p className="text-sm text-gray-500">برای آپلود تصویر کلیک کنید</p>
                                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP — حداکثر ۵ مگابایت</p>
                            </div>
                            <input ref={thumbRef} type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => setSelectedThumbnail(e.target.files?.[0] ?? null)} />
                            <InputError message={errors.cover_image} />
                        </div>

                        {/* External URL */}
                        <div>
                            <Label>لینک خارجی کتاب (PDF URL)</Label>
                            <Input
                                type="url"
                                placeholder="https://example.com/book.pdf"
                                value={form.file_url}
                                onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                                className="mt-1"
                                dir="ltr"
                            />
                            <p className="text-xs text-muted-foreground mt-1">اگر فایل آپلود نشده، می‌توانید لینک مستقیم PDF را وارد کنید</p>
                            <InputError message={errors.file_url} />
                        </div>

                        {/* File Upload */}
                        <div>
                            <Label>فایل کتاب (PDF, EPUB, DOC)</Label>

                            {/* Show existing file when editing */}
                            {editing?.file_path && !selectedFile && (
                                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-emerald-200 bg-emerald-50 mt-1.5 mb-2">
                                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-emerald-700 truncate">
                                            {editing.file_type?.toUpperCase()} — {editing.file_size ? formatBytes(editing.file_size) : ''}
                                        </p>
                                        <p className="text-xs text-emerald-600">فایل موجود — آپلود جدید جایگزین می‌شود</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { window.location.href = `/library/books/${editing.id}/download`; }}
                                        className="text-emerald-600 hover:text-emerald-800 shrink-0"
                                        title="دانلود"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Selected new file preview */}
                            {selectedFile && (
                                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-blue-200 bg-blue-50 mt-1.5 mb-2">
                                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-blue-700 truncate">{selectedFile.name}</p>
                                        <p className="text-xs text-blue-500">{formatBytes(selectedFile.size)}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                        className="text-blue-400 hover:text-blue-700 shrink-0"
                                    >
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
                                <p className="text-xs text-gray-400 mt-0.5">PDF, EPUB, DOC, DOCX — حداکثر ۵۰ مگابایت</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept=".pdf,.epub,.doc,.docx"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                            />
                            <InputError message={errors.file} />
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
