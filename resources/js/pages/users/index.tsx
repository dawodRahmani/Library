import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import {
    Plus, Pencil, Trash2, X, Save, Eye, EyeOff,
    UserCheck, UserX, ShieldCheck,
} from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface User {
    id:         number;
    name:       string;
    email:      string;
    is_active:  boolean;
    created_at: string;
}

interface Props { users: User[] }

interface AuthProps {
    auth: { user: { id: number; name: string; email: string } };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'مدیریت کاربران', href: '/users' },
];

// ── Add/Edit dialog form ───────────────────────────────────────────────────────
function UserDialog({
    user,
    onClose,
}: {
    user: User | null;
    onClose: () => void;
}) {
    const isEdit = !!user;
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name:                  user?.name  ?? '',
        email:                 user?.email ?? '',
        password:              '',
        password_confirmation: '',
        is_active:             user?.is_active ?? true,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (isEdit) {
            put(`/users/${user!.id}`, {
                onSuccess: () => { reset(); onClose(); },
            });
        } else {
            post('/users', {
                onSuccess: () => { reset(); onClose(); },
            });
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                dir="rtl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-[16px]">
                        {isEdit ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
                    </h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="p-5 space-y-4">
                    {/* Name */}
                    <div>
                        <Label>نام</Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="نام کامل"
                            dir="rtl"
                            className="mt-1"
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    {/* Email */}
                    <div>
                        <Label>ایمیل</Label>
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            dir="ltr"
                            className="mt-1"
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    {/* Password */}
                    <div>
                        <Label>{isEdit ? 'رمز عبور جدید (اختیاری)' : 'رمز عبور'}</Label>
                        <div className="relative mt-1">
                            <Input
                                type={showPass ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder={isEdit ? 'برای تغییر پر کنید...' : 'حداقل ۸ کاراکتر'}
                                dir="ltr"
                                className="pe-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute inset-y-0 end-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <Label>تکرار رمز عبور</Label>
                        <div className="relative mt-1">
                            <Input
                                type={showConfirm ? 'text' : 'password'}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="تکرار رمز عبور"
                                dir="ltr"
                                className="pe-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute inset-y-0 end-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center gap-3 py-1">
                        <button
                            type="button"
                            role="switch"
                            aria-checked={data.is_active}
                            onClick={() => setData('is_active', !data.is_active)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${data.is_active ? 'translate-x-1' : 'translate-x-6'}`} />
                        </button>
                        <Label className="cursor-pointer select-none" onClick={() => setData('is_active', !data.is_active)}>
                            {data.is_active ? 'کاربر فعال' : 'کاربر غیرفعال'}
                        </Label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button type="submit" disabled={processing} className="flex-1">
                            <Save className="w-4 h-4 me-1.5" />
                            {processing ? 'در حال ذخیره...' : (isEdit ? 'ذخیره تغییرات' : 'ایجاد کاربر')}
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose}>
                            لغو
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function UsersIndex({ users }: Props) {
    const currentUser = usePage<AuthProps>().props.auth.user;
    const [dialog, setDialog]   = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<User | null>(null);

    function openAdd()         { setEditing(null); setDialog('add'); }
    function openEdit(u: User) { setEditing(u);    setDialog('edit'); }
    function closeDialog()     { setDialog(null); setEditing(null); }

    function toggleActive(u: User) {
        router.patch(`/users/${u.id}/toggle-active`, {}, { preserveScroll: true });
    }

    function deleteUser(u: User) {
        if (!confirm(`آیا می‌خواهید کاربر "${u.name}" را حذف کنید؟`)) return;
        router.delete(`/users/${u.id}`, { preserveScroll: true });
    }

    function formatDate(dt: string) {
        return new Date(dt).toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مدیریت کاربران" />
            <div className="p-6 space-y-5 max-w-4xl" dir="rtl">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">مدیریت کاربران</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">{users.length} کاربر ثبت‌شده</p>
                    </div>
                    <Button onClick={openAdd}>
                        <Plus className="w-4 h-4 me-1.5" />
                        کاربر جدید
                    </Button>
                </div>

                {/* Users table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {users.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
                            <ShieldCheck className="w-10 h-10" />
                            <p className="text-sm">هیچ کاربری ثبت نشده</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 text-right">
                                    <th className="px-4 py-3 font-semibold text-gray-600">نام</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">ایمیل</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">تاریخ ثبت</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">وضعیت</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 w-28">عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => {
                                    const isMe = u.id === currentUser.id;
                                    return (
                                        <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-[12px] font-bold text-emerald-700">
                                                            {u.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{u.name}</p>
                                                        {isMe && <p className="text-[11px] text-emerald-600 font-medium">شما (مدیر اصلی)</p>}
                                                        <p className="text-xs text-gray-400 sm:hidden" dir="ltr">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 hidden sm:table-cell" dir="ltr">{u.email}</td>
                                            <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">{formatDate(u.created_at)}</td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    className={u.is_active
                                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-100'
                                                    }
                                                >
                                                    {u.is_active ? 'فعال' : 'غیرفعال'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => openEdit(u)}
                                                        title="ویرایش"
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>

                                                    {/* Toggle active */}
                                                    {!isMe && (
                                                        <button
                                                            onClick={() => toggleActive(u)}
                                                            title={u.is_active ? 'غیرفعال کردن' : 'فعال کردن'}
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-amber-600 transition-colors"
                                                        >
                                                            {u.is_active
                                                                ? <UserX className="w-3.5 h-3.5" />
                                                                : <UserCheck className="w-3.5 h-3.5" />
                                                            }
                                                        </button>
                                                    )}

                                                    {/* Delete */}
                                                    {!isMe && (
                                                        <button
                                                            onClick={() => deleteUser(u)}
                                                            title="حذف"
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Info note */}
                <p className="text-xs text-muted-foreground">
                    کاربران جدید دسترسی کامل به مدیریت محتوا (کتاب، ویدیو، صوت، مقالات و ...) دارند
                    اما نمی‌توانند کاربران یا تنظیمات سایت را مدیریت کنند.
                </p>
            </div>

            {/* Dialog */}
            {dialog && (
                <UserDialog
                    user={dialog === 'edit' ? editing : null}
                    onClose={closeDialog}
                />
            )}
        </AppLayout>
    );
}
