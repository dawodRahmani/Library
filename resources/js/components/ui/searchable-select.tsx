import { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface SearchableOption {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    options: SearchableOption[];
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    className?: string;
}

export function SearchableSelect({
    options,
    value,
    onValueChange,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    className,
}: SearchableSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const filtered = search
        ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
        : options;

    const selectedLabel = options.find((o) => o.value === value)?.label;

    useEffect(() => {
        if (open) {
            setSearch('');
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('w-full justify-between font-normal', !value && 'text-muted-foreground', className)}
                >
                    <span className="truncate">
                        {selectedLabel || placeholder}
                    </span>
                    <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                {/* Search input */}
                <div className="flex items-center border-b px-3 py-2">
                    <Search className="me-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                        ref={inputRef}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="h-8 border-0 p-0 shadow-none focus-visible:ring-0"
                    />
                </div>

                {/* Options list */}
                <div className="max-h-60 overflow-y-auto p-1">
                    {filtered.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            No results
                        </div>
                    ) : (
                        filtered.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onValueChange(option.value);
                                    setOpen(false);
                                }}
                                className={cn(
                                    'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
                                    value === option.value && 'bg-accent',
                                )}
                            >
                                <Check
                                    className={cn(
                                        'h-4 w-4 shrink-0',
                                        value === option.value ? 'opacity-100' : 'opacity-0',
                                    )}
                                />
                                <span className="truncate">{option.label}</span>
                            </button>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
