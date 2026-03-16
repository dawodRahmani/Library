import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
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
import type { FoodItem, Category } from '@/data/mock/types';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface AddFoodModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item?: FoodItem;
    categories: Category[];
}

export function AddFoodModal({ open, onOpenChange, item, categories }: AddFoodModalProps) {
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [price, setPrice] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);

    useEffect(() => {
        if (item) {
            setName(item.name);
            setCategoryId(String(item.category_id));
            setPrice(String(item.price));
            setIsAvailable(item.is_available);
        } else {
            setName('');
            setCategoryId('');
            setPrice('');
            setIsAvailable(true);
        }
    }, [item, open]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim() || !price.trim()) return;
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {item ? t('menu.editFood') : t('menu.addFood')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="food-name">{t('menu.foodName')}</Label>
                        <Input
                            id="food-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="food-category">{t('menu.category')}</Label>
                        <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('menu.selectCategory')} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="food-price">{t('menu.price')}</Label>
                        <Input
                            id="food-price"
                            type="number"
                            min={0}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>{t('menu.availability')}</Label>
                        <button
                            type="button"
                            onClick={() => setIsAvailable(!isAvailable)}
                            className="flex items-center gap-2"
                        >
                            {isAvailable ? (
                                <ToggleRight className="size-6 text-green-600" />
                            ) : (
                                <ToggleLeft className="size-6 text-muted-foreground" />
                            )}
                            <span className="text-sm">
                                {isAvailable ? t('menu.available') : t('menu.unavailable')}
                            </span>
                        </button>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit">
                            {item ? t('common.save') : t('common.add')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
