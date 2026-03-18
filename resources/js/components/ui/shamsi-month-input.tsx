import { useState, useEffect } from 'react';
import { CalendarIcon, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { todayParts } from '@/lib/date';

const DARI_MONTHS = [
    'حمل', 'ثور', 'جوزا', 'سرطان', 'اسد', 'سنبله',
    'میزان', 'عقرب', 'قوس', 'جدی', 'دلو', 'حوت',
];

/** Parse "YYYY-MM" shamsi string → {year, month} or null */
function parseMonth(value: string): { year: number; month: number } | null {
    if (!value || value.length !== 7) return null;
    const [y, m] = value.split('-').map(Number);
    if (!y || !m || m < 1 || m > 12) return null;
    return { year: y, month: m };
}

function formatDisplay(value: string): string {
    const p = parseMonth(value);
    if (!p) return '';
    return `${DARI_MONTHS[p.month - 1]} ${p.year}`;
}

interface Props {
    value: string;           // "YYYY-MM" shamsi or ""
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function ShamsiMonthInput({ value, onChange, placeholder = 'انتخاب ماه', className }: Props) {
    const [open, setOpen] = useState(false);
    const parsed = parseMonth(value);
    const now = todayParts();

    const [viewY, setViewY] = useState(parsed?.year ?? now.year);

    useEffect(() => {
        if (parsed) setViewY(parsed.year);
    }, [value]);

    function prevYear() { setViewY(y => y - 1); }
    function nextYear() { setViewY(y => y + 1); }

    function handleSelect(month: number) {
        const mm = String(month).padStart(2, '0');
        onChange(`${viewY}-${mm}`);
        setOpen(false);
    }

    function handleClear(e: React.MouseEvent) {
        e.stopPropagation();
        onChange('');
    }

    const display = formatDisplay(value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'justify-start gap-2 text-start font-normal',
                        !display && 'text-muted-foreground',
                        className,
                    )}
                    dir="rtl"
                >
                    <CalendarIcon className="size-4 shrink-0" />
                    <span className="flex-1">{display || placeholder}</span>
                    {display && (
                        <X
                            className="size-3.5 shrink-0 opacity-60 hover:opacity-100"
                            onClick={handleClear}
                        />
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-72" dir="rtl">
                <div className="p-3 select-none">
                    {/* Year navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <Button variant="ghost" size="icon" className="size-7" onClick={prevYear}>
                            <ChevronRight className="size-4" />
                        </Button>
                        <span className="text-sm font-semibold">{viewY}</span>
                        <Button variant="ghost" size="icon" className="size-7" onClick={nextYear}>
                            <ChevronLeft className="size-4" />
                        </Button>
                    </div>

                    {/* Month grid */}
                    <div className="grid grid-cols-3 gap-2">
                        {DARI_MONTHS.map((name, idx) => {
                            const monthNum = idx + 1;
                            const isSelected = parsed?.year === viewY && parsed?.month === monthNum;
                            return (
                                <button
                                    key={name}
                                    onClick={() => handleSelect(monthNum)}
                                    className={cn(
                                        'rounded-md py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                                        isSelected && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                                    )}
                                >
                                    {name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
