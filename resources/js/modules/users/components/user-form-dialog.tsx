import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import type { UserData, UserFormData, Role } from '../types';

interface UserFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: UserFormData) => void;
    user?: UserData | null;
    roles: Role[];
    processing?: boolean;
    errors?: Record<string, string>;
}

const defaultFormData: UserFormData = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    is_active: true,
};

export function UserFormDialog({
    open,
    onClose,
    onSubmit,
    user,
    roles,
    processing = false,
    errors = {},
}: UserFormDialogProps) {
    const { t } = useTranslation();
    const isEditing = !!user;
    const [form, setForm] = useState<UserFormData>(defaultFormData);

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name,
                email: user.email,
                password: '',
                password_confirmation: '',
                role: user.roles[0]?.name || '',
                is_active: user.is_active,
            });
        } else {
            setForm(defaultFormData);
        }
    }, [user, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        {isEditing ? t('users.editUser') : t('users.addUser')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('users.editUser')
                            : t('users.addUser')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="user-name" className="font-medium">
                            {t('users.name')}
                        </Label>
                        <Input
                            id="user-name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            className="h-10"
                            placeholder={t('users.name')}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="user-email" className="font-medium">
                            {t('users.email')}
                        </Label>
                        <Input
                            id="user-email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                            dir="ltr"
                            className="h-10 text-left"
                            placeholder="email@example.com"
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="user-password" className="font-medium">
                            {t('users.password')}
                        </Label>
                        <Input
                            id="user-password"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required={!isEditing}
                            dir="ltr"
                            className="h-10 text-left"
                            placeholder="••••••••"
                        />
                        <p className="text-xs text-muted-foreground">
                            {isEditing ? t('users.passwordEditHelp') : t('users.passwordHelp')}
                        </p>
                        {errors.password && (
                            <p className="text-xs text-red-500">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <Label htmlFor="user-password-confirm" className="font-medium">
                            {t('users.confirmPassword')}
                        </Label>
                        <Input
                            id="user-password-confirm"
                            type="password"
                            value={form.password_confirmation}
                            onChange={(e) =>
                                setForm({ ...form, password_confirmation: e.target.value })
                            }
                            required={!isEditing && form.password.length > 0}
                            dir="ltr"
                            className="h-10 text-left"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <Label className="font-medium">{t('users.role')}</Label>
                        <Select
                            value={form.role}
                            onValueChange={(val) => setForm({ ...form, role: val })}
                        >
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder={t('users.selectRole')} />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.name}>
                                        {t(`users.${role.name}`, role.name)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <p className="text-xs text-red-500">{errors.role}</p>
                        )}
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3 pt-1">
                        <Checkbox
                            id="user-active"
                            checked={form.is_active}
                            onCheckedChange={(checked) =>
                                setForm({ ...form, is_active: checked === true })
                            }
                            className="border-emerald-400 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                        />
                        <Label htmlFor="user-active" className="cursor-pointer">
                            {t('users.active')}
                        </Label>
                    </div>

                    <DialogFooter className="gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                        >
                            {processing && <Spinner className="me-2" />}
                            {t('common.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
