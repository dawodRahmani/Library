import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SalaryStatus } from '../types';

const statusConfig: Record<SalaryStatus, { className: string; key: string }> = {
    paid: {
        className: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
        key: 'salaries.statusPaid',
    },
    pending: {
        className: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
        key: 'salaries.statusPending',
    },
    partial: {
        className: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700',
        key: 'salaries.statusPartial',
    },
};

interface SalaryStatusBadgeProps {
    status: SalaryStatus;
}

export function SalaryStatusBadge({ status }: SalaryStatusBadgeProps) {
    const { t } = useTranslation();
    const config = statusConfig[status];

    return (
        <Badge variant="outline" className={cn('text-xs', config.className)}>
            {t(config.key)}
        </Badge>
    );
}
