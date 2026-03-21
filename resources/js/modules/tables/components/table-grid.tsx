import { TableCard } from './table-card';
import type { RestaurantTable } from '@/types/models';

interface TableGridProps {
    tables: RestaurantTable[];
    onNewOrder: (tableId: number) => void;
    onViewOrder: (orderId: number) => void;
    onEdit: (table: RestaurantTable) => void;
}

export function TableGrid({ tables, onNewOrder, onViewOrder, onEdit }: TableGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {tables.map((table) => (
                <TableCard
                    key={table.id}
                    table={table}
                    onNewOrder={onNewOrder}
                    onViewOrder={onViewOrder}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}
