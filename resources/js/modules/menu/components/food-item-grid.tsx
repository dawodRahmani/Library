import { FoodItemCard } from './food-item-card';
import type { FoodItem } from '@/types/models';

interface FoodItemGridProps {
    items: FoodItem[];
    onEdit: (item: FoodItem) => void;
    onToggleAvailability: (id: number) => void;
}

export function FoodItemGrid({ items, onEdit, onToggleAvailability }: FoodItemGridProps) {
    // Group items by category
    const grouped = items.reduce<Record<number, { name: string; items: FoodItem[] }>>((acc, item) => {
        if (!acc[item.category_id]) {
            acc[item.category_id] = { name: item.category.name, items: [] };
        }
        acc[item.category_id].items.push(item);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {Object.entries(grouped).map(([categoryId, group]) => (
                <div key={categoryId}>
                    <h2 className="text-lg font-semibold mb-3">{group.name}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {group.items.map((item) => (
                            <FoodItemCard
                                key={item.id}
                                item={item}
                                onEdit={onEdit}
                                onToggleAvailability={onToggleAvailability}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
