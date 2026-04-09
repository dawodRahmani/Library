import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Mail, MailOpen, Trash2, Eye, X, ChevronLeft, ChevronRight,
} from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Message {
    id:         number;
    name:       string;
    email:      string;
    subject:    string;
    message:    string;
    is_read:    boolean;
    created_at: string;
}

interface Pagination {
    data:          Message[];
    current_page:  number;
    last_page:     number;
    per_page:      number;
    total:         number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Props {
    messages:     Pagination;
    unread_count: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'پیام‌های تماس', href: '/admin/messages' },
];

export default function MessagesIndex({ messages, unread_count }: Props) {
    const [selected, setSelected] = useState<Message | null>(null);

    function openMessage(msg: Message) {
        setSelected(msg);
        if (!msg.is_read) {
            router.patch(`/admin/messages/${msg.id}/read`, {}, { preserveScroll: true });
        }
    }

    function toggleRead(msg: Message, e: React.MouseEvent) {
        e.stopPropagation();
        const url = msg.is_read
            ? `/admin/messages/${msg.id}/unread`
            : `/admin/messages/${msg.id}/read`;
        router.patch(url, {}, { preserveScroll: true });
    }

    function deleteMessage(id: number, e: React.MouseEvent) {
        e.stopPropagation();
        if (!confirm('آیا این پیام حذف شود؟')) return;
        router.delete(`/admin/messages/${id}`, { preserveScroll: true });
    }

    function goToPage(page: number) {
        router.get('/admin/messages', { page }, { preserveScroll: true });
    }

    function formatDate(dt: string) {
        return new Date(dt).toLocaleDateString('fa-IR', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="پیام‌های تماس" />
            <div className="p-6 space-y-5 max-w-5xl" dir="rtl">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            پیام‌های تماس
                            {unread_count > 0 && (
                                <Badge className="bg-emerald-600 text-white text-xs">{unread_count} جدید</Badge>
                            )}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            مجموع {messages.total} پیام
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {messages.data.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-16 text-center text-gray-400">
                            <Mail className="w-10 h-10" />
                            <p className="text-sm">هیچ پیامی وجود ندارد</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 text-right">
                                    <th className="px-4 py-3 font-semibold text-gray-600 w-8" />
                                    <th className="px-4 py-3 font-semibold text-gray-600">فرستنده</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">موضوع</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">تاریخ</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 w-24">عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.data.map((msg) => (
                                    <tr
                                        key={msg.id}
                                        onClick={() => openMessage(msg)}
                                        className={`border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!msg.is_read ? 'bg-emerald-50/40' : ''}`}
                                    >
                                        <td className="px-4 py-3">
                                            {msg.is_read
                                                ? <MailOpen className="w-4 h-4 text-gray-400" />
                                                : <Mail className="w-4 h-4 text-emerald-600" />
                                            }
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className={`${!msg.is_read ? 'font-bold' : 'font-medium'} text-gray-900`}>{msg.name}</p>
                                            <p className="text-xs text-gray-400 mt-0.5" dir="ltr">{msg.email}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className={`${!msg.is_read ? 'font-semibold' : ''} text-gray-700 line-clamp-1`}>{msg.subject}</p>
                                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{msg.message}</p>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell whitespace-nowrap">
                                            {formatDate(msg.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => openMessage(msg) || e.stopPropagation()}
                                                    title="مشاهده"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => toggleRead(msg, e)}
                                                    title={msg.is_read ? 'علامت‌گذاری به‌عنوان خوانده‌نشده' : 'علامت‌گذاری به‌عنوان خوانده‌شده'}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-emerald-600 transition-colors"
                                                >
                                                    {msg.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={(e) => deleteMessage(msg.id, e)}
                                                    title="حذف"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {messages.last_page > 1 && (
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>صفحه {messages.current_page} از {messages.last_page}</span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline" size="sm"
                                onClick={() => goToPage(messages.current_page - 1)}
                                disabled={messages.current_page === 1}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline" size="sm"
                                onClick={() => goToPage(messages.current_page + 1)}
                                disabled={messages.current_page === messages.last_page}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Message detail modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelected(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} dir="rtl">
                        {/* Modal header */}
                        <div className="flex items-start justify-between p-5 border-b border-gray-100">
                            <div className="flex-1 min-w-0">
                                <h2 className="font-bold text-[16px] text-gray-900 mb-1">{selected.subject}</h2>
                                <p className="text-sm text-gray-500">{selected.name} — <span dir="ltr">{selected.email}</span></p>
                            </div>
                            <button onClick={() => setSelected(null)} className="ms-3 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors flex-shrink-0">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Meta */}
                        <div className="px-5 pt-4 pb-2">
                            <p className="text-xs text-gray-400">{formatDate(selected.created_at)}</p>
                        </div>

                        {/* Body */}
                        <div className="px-5 pb-5">
                            <p className="text-[14px] text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 px-5 pb-5 pt-2 border-t border-gray-100">
                            <Button
                                variant="outline" size="sm"
                                onClick={() => { toggleRead(selected, { stopPropagation: () => {} } as React.MouseEvent); setSelected(null); }}
                            >
                                {selected.is_read
                                    ? <><Mail className="w-4 h-4 me-1.5" />علامت‌گذاری خوانده‌نشده</>
                                    : <><MailOpen className="w-4 h-4 me-1.5" />علامت‌گذاری خوانده‌شده</>
                                }
                            </Button>
                            <Button
                                variant="destructive" size="sm"
                                onClick={(e) => { deleteMessage(selected.id, e); setSelected(null); }}
                            >
                                <Trash2 className="w-4 h-4 me-1.5" />حذف پیام
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
