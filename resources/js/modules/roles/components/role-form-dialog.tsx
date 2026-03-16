import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import type { RoleData } from '../types';

interface RoleFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string }) => void;
    role?: RoleData | null;
    processing?: boolean;
    errors?: Record<string, string>;
}

export function RoleFormDialog({
    open,
    onClose,
    onSubmit,
    role,
    processing = false,
    errors = {},
}: RoleFormDialogProps) {
    const { t } = useTranslation();
    const isEditing = !!role;
    const [name, setName] = useState('');

    useEffect(() => {
        setName(role?.name || '');
    }, [role, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? t('roles.editRole') : t('roles.addRole')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? t('roles.editRole') : t('roles.addRole')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="role-name" className="font-medium">
                            {t('roles.roleName')}
                        </Label>
                        <Input
                            id="role-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="h-10"
                            placeholder={t('roles.roleName')}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">{errors.name}</p>
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
