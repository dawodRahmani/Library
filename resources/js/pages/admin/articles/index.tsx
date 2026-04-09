import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, Tags, FileText, Eye } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { CategoryPanel } from '@/components/admin/category-panel';
import type { CategoryItem } from '@/components/admin/category-panel';

type Category = CategoryItem;

interface ArticleItem {
    id: number;
    title: { da: string; en?: string };
    slug: string;
    author: string;
    category: string;
    category_id: number;
    read_time: string | null;
    cover_image: string | null;
    is_active: boolean;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'مقاله‌ها', href: '/admin/articles' },
];

export default function ArticlesIndex({ articles, categories }: { articles: ArticleItem[]; categories: Category[] }) {
    const [tab, setTab]       = useState<'articles' | 'categories'>('articles');
    const [search, setSearch] = useState('');

    const filtered = articles.filter(
        (a) => (a.title?.da ?? '').includes(search) || a.author.includes(search) || a.category.includes(search),
    );

    function destroy(a: ArticleItem) {
        if (confirm('آیا مطمئن هستید؟')) router.delete(`/admin/articles/${a.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مدیریت مقاله‌ها" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">مدیریت مقاله‌ها</h1>
                    {tab === 'articles' && (
                        <a href="/admin/articles/create">
                            <Button size="sm"><Plus className="w-4 h-4 me-1" /> افزودن مقاله</Button>
                        </a>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-gray-200">
                    <button
                        onClick={() => setTab('articles')}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === 'articles' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        <FileText className="w-4 h-4" /> مقاله‌ها ({articles.length})
                    </button>
                    <button
                        onClick={() => setTab('categories')}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === 'categories' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        <Tags className="w-4 h-4" /> دسته‌بندی‌ها ({categories.length})
                    </button>
                </div>

                {tab === 'categories' && <CategoryPanel categories={categories} type="article" />}

                {tab === 'articles' && <>
                    <div className="relative max-w-sm">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-10">#</TableHead>
                                    <TableHead>تصویر</TableHead>
                                    <TableHead>عنوان</TableHead>
                                    <TableHead>نویسنده</TableHead>
                                    <TableHead>دسته‌بندی</TableHead>
                                    <TableHead>مدت مطالعه</TableHead>
                                    <TableHead>وضعیت</TableHead>
                                    <TableHead className="w-28">عملیات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            هیچ مقاله‌ای یافت نشد
                                        </TableCell>
                                    </TableRow>
                                )}
                                {filtered.map((a, i) => (
                                    <TableRow key={a.id}>
                                        <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                        <TableCell>
                                            {a.cover_image ? (
                                                <img
                                                    src={`/storage/${a.cover_image}`}
                                                    alt=""
                                                    className="w-12 h-8 object-cover rounded border"
                                                />
                                            ) : (
                                                <div className="w-12 h-8 rounded border bg-gray-100 flex items-center justify-center">
                                                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium max-w-[200px] truncate">{a.title?.da}</TableCell>
                                        <TableCell>{a.author}</TableCell>
                                        <TableCell><Badge variant="secondary">{a.category}</Badge></TableCell>
                                        <TableCell>{a.read_time ?? '—'}</TableCell>
                                        <TableCell>
                                            <Badge variant={a.is_active ? 'default' : 'secondary'}>
                                                {a.is_active ? 'منتشر' : 'پیش‌نویس'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <a href={`/articles`} target="_blank" rel="noreferrer">
                                                    <Button variant="ghost" size="icon" title="مشاهده"><Eye className="w-4 h-4" /></Button>
                                                </a>
                                                <a href={`/admin/articles/${a.id}/edit`}>
                                                    <Button variant="ghost" size="icon" title="ویرایش"><Pencil className="w-4 h-4" /></Button>
                                                </a>
                                                <Button variant="ghost" size="icon" onClick={() => destroy(a)}>
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
        </AppLayout>
    );
}
