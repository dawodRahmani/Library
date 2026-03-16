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
import { formatPrice } from '@/data/mock';
import type { Salary } from '../types';

interface SalaryDeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    salary: Salary | null;
}

export function SalaryDeleteDialog({
    open,
    onClose,
    onConfirm,
    salary,
}: SalaryDeleteDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                        <AlertTriangle className="size-6 text-red-600 dark:text-red-400" />
                    </div>
                    <DialogTitle className="text-center">
                        {t('salaries.deleteSalary')}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {t('salaries.deleteConfirm')}
                        {salary && (
                            <span className="block mt-2 font-semibold text-foreground">
                                {salary.month} — {formatPrice(salary.amount)}
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
