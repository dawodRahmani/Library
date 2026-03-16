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
import type { Employee } from '../types';

interface EmployeeDeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    employee: Employee | null;
}

export function EmployeeDeleteDialog({
    open,
    onClose,
    onConfirm,
    employee,
}: EmployeeDeleteDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                        <AlertTriangle className="size-6 text-red-600 dark:text-red-400" />
                    </div>
                    <DialogTitle className="text-center">
                        {t('employees.deleteEmployee')}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {t('employees.deleteConfirm')}
                        {employee && (
                            <span className="block mt-2 font-semibold text-foreground">
                                {employee.name}
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 pt-4 sm:justify-center">
                    <Button variant="outline" onClick={onClose}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 shadow-sm"
                    >
                        {t('common.delete')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
