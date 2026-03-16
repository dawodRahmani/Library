import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import type { UserData } from '../types';

interface UserDeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    user: UserData | null;
    processing?: boolean;
}

export function UserDeleteDialog({
    open,
    onClose,
    onConfirm,
    user,
    processing = false,
}: UserDeleteDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                        <AlertTriangle className="size-6 text-red-600 dark:text-red-400" />
                    </div>
                    <DialogTitle className="text-center">
                        {t('users.deleteUser')}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {t('users.deleteConfirm')}
                        {user && (
                            <span className="block mt-2 font-semibold text-foreground">
                                {user.name}
                            </span>
                        )}
                        <span className="block mt-1 text-xs text-red-500">
                            {t('users.deleteWarning')}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 pt-4 sm:justify-center">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={processing}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={processing}
                        className="bg-red-600 hover:bg-red-700 shadow-sm"
                    >
                        {processing && <Spinner className="me-2" />}
                        {t('common.delete')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
