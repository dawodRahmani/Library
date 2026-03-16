import { useTranslation } from 'react-i18next';
import type { RestaurantTable } from '@/data/mock/types';

interface TableSummaryProps {
    tables: RestaurantTable[];
}

export function TableSummary({ tables }: TableSummaryProps) {
    const { t } = useTranslation();

    const availableCount = tables.filter((table) => table.status === 'available').length;
    const occupiedCount = tables.filter((table) => table.status === 'occupied').length;

    return (
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
                <span className="size-2.5 rounded-full bg-emerald-500" />
                <span>
                    {t('tables.availableCount')}: {availableCount}
                </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
                <span className="size-2.5 rounded-full bg-red-500" />
                <span>
                    {t('tables.occupiedCount')}: {occupiedCount}
                </span>
            </div>
        </div>
    );
}
