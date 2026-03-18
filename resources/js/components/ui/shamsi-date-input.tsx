import { useState, useEffect } from 'react';
import jalaali from 'jalaali-js';
import { todayParts } from '@/lib/date';
import { CalendarIcon, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ─── Jalali helpers ──────────────────────────────────────────────────────────

const DARI_MONTHS = [
    'حمل', 'ثور', 'جوزا', 'سرطان', 'اسد', 'سنبله',
    'میزان', 'عقرب', 'قوس', 'جدی', 'دلو', 'حوت',
];

const DARI_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

function gregorianToJalaali(iso: string): { jy: number; jm: number; jd: number } | null {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    return jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function jalaaliToIso(jy: number, jm: number, jd: number): string {
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
    return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
}

function formatDisplay(iso: string): string {
    const j = gregorianToJalaali(iso);
    if (!j) return '';
    return `${j.jy}/${String(j.jm).padStart(2, '0')}/${String(j.jd).padStart(2, '0')}`;
}

/** Returns ISO weekday 0=Sat … 6=Fri (Dari week starts Saturday) */
function startWeekday(jy: number, jm: number): number {
    const iso = jalaaliToIso(jy, jm, 1);
    const d = new Date(iso);
    // JS: 0=Sun,1=Mon,…,6=Sat → shift so Sat=0
    return (d.getDay() + 1) % 7;
}

function daysInJalaaliMonth(jy: number, jm: number): number {
    return jalaali.jalaaliMonthLength(jy, jm);
}

// ─── Calendar grid ───────────────────────────────────────────────────────────

interface CalendarProps {
    selectedIso: string;
    onSelect: (iso: string) => void;
}

function ShamsiCalendar({ selectedIso, onSelect }: CalendarProps) {
    const selected = gregorianToJalaali(selectedIso);

    const now = todayParts();
    const [viewY, setViewY] = useState(selected?.jy ?? now.year);
    const [viewM, setViewM] = useState(selected?.jm ?? now.month);

    useEffect(() => {
        if (selected) {
            setViewY(selected.jy);
            setViewM(selected.jm);
        }
    }, [selectedIso]);

    function prevMonth() {
        if (viewM === 1) { setViewY(y => y - 1); setViewM(12); }
        else setViewM(m => m - 1);
    }

    function nextMonth() {
        if (viewM === 12) { setViewY(y => y + 1); setViewM(1); }
        else setViewM(m => m + 1);
    }

    const startDay = startWeekday(viewY, viewM);
    const daysCount = daysInJalaaliMonth(viewY, viewM);

    const cells: (number | null)[] = [
        ...Array(startDay).fill(null),
        ...Array.from({ length: daysCount }, (_, i) => i + 1),
    ];

    return (
        <div className="p-3 select-none" dir="rtl">
            {/* Header: prev / month+year / next */}
            <div className="flex items-center justify-between mb-3">
                <Button variant="ghost" size="icon" className="size-7" onClick={prevMonth}>
                    <ChevronRight className="size-4" />
                </Button>
                <span className="text-sm font-semibold">
                    {DARI_MONTHS[viewM - 1]} {viewY}
                </span>
                <Button variant="ghost" size="icon" className="size-7" onClick={nextMonth}>
                    <ChevronLeft className="size-4" />
                </Button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
                {DARI_WEEKDAYS.map(d => (
                    <div key={d} className="text-center text-xs text-muted-foreground py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-y-1">
                {cells.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} />;

                    const isSelected = selected &&
                        viewY === selected.jy && viewM === selected.jm && day === selected.jd;

                    return (
                        <button
                            key={day}
                            onClick={() => onSelect(jalaaliToIso(viewY, viewM, day))}
                            className={cn(
                                'h-8 w-full rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                                isSelected && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                            )}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Public component ────────────────────────────────────────────────────────

interface Props {
    /** Gregorian ISO date "YYYY-MM-DD" or "" */
    value: string;
    /** Returns Gregorian ISO "YYYY-MM-DD" or "" when cleared */
    onChange: (gregorian: string) => void;
    placeholder?: string;
    className?: string;
}

export function ShamsiDateInput({ value, onChange, placeholder = 'انتخاب تاریخ', className }: Props) {
    const [open, setOpen] = useState(false);

    function handleSelect(iso: string) {
        onChange(iso);
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
            <PopoverContent align="start" className="w-80">
                <ShamsiCalendar selectedIso={value} onSelect={handleSelect} />
            </PopoverContent>
        </Popover>
    );
}
