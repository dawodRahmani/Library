import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
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
import { Spinner } from '@/components/ui/spinner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FoodImage } from '@/components/food-image';
import type { FoodItem, Category } from '@/data/mock/types';
import { ImagePlus, ToggleLeft, ToggleRight, X } from 'lucide-react';

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
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (open) {
            if (item) {
                setName(item.name);
                setCategoryId(String(item.category_id));
                setPrice(String(item.price));
                setIsAvailable(item.is_available);
                setImagePreview(item.image || null);
            } else {
                setName('');
                setCategoryId('');
                setPrice('');
                setIsAvailable(true);
                setImagePreview(null);
            }
            setImageFile(null);
            setErrors({});
        }
    }, [item, open]);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    }

    function removeImage() {
        setImageFile(null);
        setImagePreview(null);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category_id', categoryId);
        formData.append('price', price);
        formData.append('is_available', isAvailable ? '1' : '0');
        if (imageFile) {
            formData.append('image', imageFile);
        }

        if (item) {
            formData.append('_method', 'PATCH');
            router.post(`/menu/items/${item.id}`, formData, {
                forceFormData: true,
                onSuccess: () => onOpenChange(false),
                onError: (errs) => setErrors(errs),
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post('/menu/items', formData, {
                forceFormData: true,
                onSuccess: () => onOpenChange(false),
                onError: (errs) => setErrors(errs),
                onFinish: () => setProcessing(false),
            });
        }
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
                    {/* Image upload */}
                    <div className="space-y-2">
                        <Label>{t('menu.foodImage')}</Label>
                        <div className="flex items-center gap-4">
                            {imagePreview ? (
                                <div className="relative">
                                    <FoodImage src={imagePreview} alt={name || 'preview'} size="sm" className="rounded-xl" />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -end-2 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm"
                                    >
                                        <X className="size-3" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex size-16 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors">
                                    <ImagePlus className="size-6 text-muted-foreground/50" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                        {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="food-name">{t('menu.foodName')}</Label>
                        <Input
                            id="food-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="food-category">{t('menu.category')}</Label>
                        <Select value={categoryId} onValueChange={setCategoryId} required>
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
                        {errors.category_id && <p className="text-xs text-red-500">{errors.category_id}</p>}
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
                        {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
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
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner className="me-2" />}
                            {item ? t('common.save') : t('common.add')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
