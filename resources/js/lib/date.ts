/**
 * All date display uses Asia/Kabul timezone and the Solar Hijri (Jalali/Shamsi) calendar.
 * Conversion uses a well-known pure-JS algorithm — avoids Intl ca-persian which is
 * broken on Windows (returns wrong years like 783 instead of 1404).
 */

const TZ = 'Asia/Kabul';

const DARI_MONTHS = [
    'حمل', 'ثور', 'جوزا', 'سرطان', 'اسد', 'سنبله',
    'میزان', 'عقرب', 'قوس', 'جدی', 'دلو', 'حوت',
];

interface PersianParts {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
}

/** Convert Gregorian (year, month 1-12, day) → [jalaliYear, jalaliMonth, jalaliDay] */
function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
    const g_y = gy - 1600;
    const g_m = gm - 1;
    const g_d = gd - 1;

    const leap = (g_y % 4 === 0 && g_y % 100 !== 0) || g_y % 400 === 0 ? 1 : 0;
    const gMonthDays = [31, 28 + leap, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let g_d_no = 365 * g_y
        + Math.floor((g_y + 3) / 4)
        - Math.floor((g_y + 99) / 100)
        + Math.floor((g_y + 399) / 400);

    for (let i = 0; i < g_m; i++) g_d_no += gMonthDays[i];
    g_d_no += g_d;

    let j_d_no = g_d_no - 79;
    const j_np = Math.floor(j_d_no / 12053);
    j_d_no %= 12053;

    let jy = 979 + 33 * j_np + 4 * Math.floor(j_d_no / 1461);
    j_d_no %= 1461;

    if (j_d_no >= 366) {
        jy += Math.floor((j_d_no - 1) / 365);
        j_d_no = (j_d_no - 1) % 365;
    }

    const jMonthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    let jm = 0;
    for (jm = 0; jm < 11 && j_d_no >= jMonthDays[jm]; jm++) {
        j_d_no -= jMonthDays[jm];
    }

    return [jy, jm + 1, j_d_no + 1];
}

/** Get the local date/time components in Kabul timezone from a date string */
function getKabulParts(dateStr: string | null | undefined): { gy: number; gm: number; gd: number; hour: number; minute: number } | null {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;

    // Use standard 'en' locale (always reliable) to extract Kabul local time
    const fmt = new Intl.DateTimeFormat('en', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false,
        timeZone: TZ,
    });

    const parts = fmt.formatToParts(d);
    const get = (type: string) => parseInt(parts.find((p) => p.type === type)?.value ?? '0', 10);

    return {
        gy: get('year'),
        gm: get('month'),
        gd: get('day'),
        hour: get('hour'),
        minute: get('minute'),
    };
}

function getPersianParts(dateStr: string | null | undefined): PersianParts | null {
    const k = getKabulParts(dateStr);
    if (!k) return null;

    const [year, month, day] = gregorianToJalali(k.gy, k.gm, k.gd);
    return { year, month, day, hour: k.hour, minute: k.minute };
}

/** 1404/12/26 */
export function formatShamsiDate(dateStr: string | null | undefined): string {
    const p = getPersianParts(dateStr);
    if (!p) return '—';
    return `${p.year}/${String(p.month).padStart(2, '0')}/${String(p.day).padStart(2, '0')}`;
}

/** 26 حوت 1404 */
export function formatShamsiDateLong(dateStr: string | null | undefined): string {
    const p = getPersianParts(dateStr);
    if (!p) return '—';
    return `${p.day} ${DARI_MONTHS[p.month - 1]} ${p.year}`;
}

/** 26 حوت 1404 — 14:30 */
export function formatShamsiDateTime(dateStr: string | null | undefined): string {
    const p = getPersianParts(dateStr);
    if (!p) return '—';
    const hh = String(p.hour).padStart(2, '0');
    const mm = String(p.minute).padStart(2, '0');
    return `${p.day} ${DARI_MONTHS[p.month - 1]} ${p.year} — ${hh}:${mm}`;
}

/** 14:30 */
export function formatTime(dateStr: string | null | undefined): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('en', {
        hour:   '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: TZ,
    }).format(d);
}

/** Today's Shamsi date parts (in Kabul timezone) */
export function todayParts(): PersianParts {
    return getPersianParts(new Date().toISOString())!;
}

/** Current Shamsi month as "YYYY-MM" string, e.g. "1404-12" */
export function currentShamsiMonth(): string {
    const p = todayParts();
    return `${p.year}-${String(p.month).padStart(2, '0')}`;
}

/** Format "YYYY-MM" shamsi string → human-readable Dari, e.g. "حوت ۱۴۰۴" */
export function formatShamsiMonthLabel(monthStr: string): string {
    if (!monthStr || monthStr.length !== 7) return monthStr;
    const [y, m] = monthStr.split('-').map(Number);
    if (!y || !m || m < 1 || m > 12) return monthStr;
    return `${DARI_MONTHS[m - 1]} ${y}`;
}
