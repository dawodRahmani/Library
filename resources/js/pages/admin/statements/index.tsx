import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, X, FileText, Music, Video, Eye, EyeOff } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

type StatementType = 'text' | 'audio' | 'video';

interface StatementItem {
    id:           number;
    type:         StatementType;
    title:        { da: string; en?: string };
    body:         { da: string; en?: string } | null;
    media_source?: 'link' | 'upload' | null;
    media_url?:   string | null;
    file_path?:   string | null;
    thumbnail?:   string | null;
    published_at: string | null;
    is_active:    boolean;
    created_at:   string;
}

interface Props { statements: StatementItem[] }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'بیانیه‌ها', href: '/admin/statements' },
];

export default function StatementsIndex({ statements }: Props) {
    const [search,  setSearch]  = useState('');
    const [preview, setPreview] = useState<StatementItem | null>(null);

    const filtered = statements.filter((s) =>
        (s.title?.da ?? '').includes(search) || (s.title?.en ?? '').includes(search)
    );

    function toggleActive(s: StatementItem) {
        const fd = new FormData();
        fd.append('_method', 'put');
        fd.append('type', s.type ?? 'text');
        (['da', 'en', 'ar', 'tg'] as const).forEach((l) => {
            fd.append(`title[${l}]`, (s.title as Record<string, string | undefined>)[l] ?? '');
            fd.append(`body[${l}]`,  (s.body  as Record<string, string | undefined> | null)?.[l] ?? '');
        });
        fd.append('media_source', s.media_source ?? 'link');
        fd.append('media_url',    s.media_url ?? '');
        fd.append('published_at', s.published_at ?? '');
        fd.append('is_active',    !s.is_active ? '1' : '0');

        router.post(`/admin/statements/${s.id}`, fd, {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    function destroy(s: StatementItem) {
        if (!confirm(`آیا بیانیه "${s.title?.da}" حذف شود؟`)) return;
        router.delete(`/admin/statements/${s.id}`, { preserveScroll: true });
    }

    function formatDate(dt: string | null) {
        if (!dt) return '—';
        return new Date(dt).toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مدیریت بیانیه‌ها" />
            <div className="p-6 space-y-5 max-w-5xl" dir="rtl">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">بیانیه‌ها</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">{statements.length} بیانیه</p>
                    </div>
                    <Button asChild>
                        <a href="/admin/statements/create">
                            <Plus className="w-4 h-4 me-1.5" />
                            بیانیه جدید
                        </a>
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="جستجوی بیانیه..."
                        className="pe-10"
                    />
                    <FileText className="absolute inset-y-0 end-3 my-auto w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
                            <FileText className="w-10 h-10" />
                            <p className="text-sm">{search ? 'نتیجه‌ای یافت نشد' : 'هیچ بیانیه‌ای وجود ندارد'}</p>
                            {!search && (
                                <Button asChild size="sm" variant="outline">
                                    <a href="/admin/statements/create">
                                        <Plus className="w-3.5 h-3.5 me-1.5" />افزودن اولین بیانیه
                                    </a>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 text-right">
                                    <th className="px-4 py-3 font-semibold text-gray-600 w-24">نوع</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">عنوان</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">تاریخ انتشار</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">وضعیت</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 w-32">عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((s) => {
                                    const typeLabel = s.type === 'audio' ? 'صوت' : s.type === 'video' ? 'ویدیو' : 'متن';
                                    const TypeIcon  = s.type === 'audio' ? Music : s.type === 'video' ? Video : FileText;
                                    const typeColor = s.type === 'audio' ? 'bg-blue-50 text-blue-700' : s.type === 'video' ? 'bg-purple-50 text-purple-700' : 'bg-gray-50 text-gray-700';
                                    return (
                                    <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${typeColor}`}>
                                                <TypeIcon className="w-3 h-3" />
                                                {typeLabel}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900 line-clamp-1">{s.title?.da}</p>
                                            {s.title?.en && (
                                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1" dir="ltr">{s.title.en}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">
                                            {formatDate(s.published_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge className={s.is_active
                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-100'
                                            }>
                                                {s.is_active ? 'منتشر شده' : 'پیش‌نویس'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                {/* Preview body */}
                                                {(s.body?.da || s.body?.en) && (
                                                    <button
                                                        onClick={() => setPreview(s)}
                                                        title="پیش‌نمایش"
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                {/* Edit — full page editor */}
                                                <a
                                                    href={`/admin/statements/${s.id}/edit`}
                                                    title="ویرایش"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </a>
                                                {/* Toggle published */}
                                                <button
                                                    onClick={() => toggleActive(s)}
                                                    title={s.is_active ? 'تبدیل به پیش‌نویس' : 'انتشار'}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-amber-600 transition-colors"
                                                >
                                                    {s.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                </button>
                                                {/* Delete */}
                                                <button
                                                    onClick={() => destroy(s)}
                                                    title="حذف"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Preview modal — renders rich HTML */}
            {preview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setPreview(null)}>
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
                        dir="rtl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between p-5 border-b border-gray-100">
                            <h2 className="font-bold text-[16px] text-gray-900 flex-1 leading-snug">{preview.title?.da}</h2>
                            <button
                                onClick={() => setPreview(null)}
                                className="ms-3 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {preview.published_at && (
                            <p className="px-5 pt-3 text-xs text-gray-400">{formatDate(preview.published_at)}</p>
                        )}
                        {preview.body?.da && (
                            <div className="px-5 py-4">
                                <div
                                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: preview.body.da }}
                                />
                            </div>
                        )}
                        {preview.body?.en && (
                            <div className="px-5 pb-5 border-t border-gray-100 pt-4" dir="ltr">
                                <p className="text-xs text-gray-400 mb-3 font-medium">English</p>
                                <div
                                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: preview.body.en }}
                                />
                            </div>
                        )}
                        <div className="px-5 pb-5 pt-2 flex justify-end">
                            <Button asChild size="sm" variant="outline">
                                <a href={`/admin/statements/${preview.id}/edit`}>
                                    <Pencil className="w-3.5 h-3.5 me-1.5" />ویرایش
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
