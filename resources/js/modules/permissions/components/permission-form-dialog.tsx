import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import type { PermissionData, PermissionFormData } from '../types';

interface PermissionFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: PermissionFormData) => void;
    permission?: PermissionData | null;
    groups: string[];
    processing?: boolean;
    errors?: Record<string, string>;
}

const defaultForm: PermissionFormData = {
    name: '',
    group: '',
};

export function PermissionFormDialog({
    open,
    onClose,
    onSubmit,
    permission,
    groups,
    processing = false,
    errors = {},
}: PermissionFormDialogProps) {
    const { t } = useTranslation();
    const isEditing = !!permission;
    const [form, setForm] = useState<PermissionFormData>(defaultForm);

    useEffect(() => {
        if (permission) {
            setForm({ name: permission.name, group: permission.group });
        } else {
            setForm(defaultForm);
        }
    }, [permission, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? t('permissions.editPermission') : t('permissions.addPermission')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? t('permissions.editPermission') : t('permissions.addPermission')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="perm-name" className="font-medium">
                            {t('permissions.permissionName')}
                        </Label>
                        <Input
                            id="perm-name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            className="h-10"
                            placeholder="e.g. users.create"
                            dir="ltr"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="font-medium">{t('permissions.group')}</Label>
                        <Select
                            value={form.group}
                            onValueChange={(val) => setForm({ ...form, group: val })}
                        >
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder={t('permissions.group')} />
                            </SelectTrigger>
                            <SelectContent>
                                {groups.map((group) => (
                                    <SelectItem key={group} value={group}>
                                        {t(`permissions.groups.${group}`, group)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.group && (
                            <p className="text-xs text-red-500">{errors.group}</p>
                        )}
                    </div>

                    <DialogFooter className="gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
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
