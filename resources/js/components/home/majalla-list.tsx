import { useState } from 'react';
import { BookOpen, Calendar, FileText, Newspaper, Star, Download, Eye } from 'lucide-react';

interface Issue {
    id: number;
    number: number;
    title: string;
    theme: string;
    date: string;
    year: string;
    articleCount: number;
    description: string;
    featured: boolean;
    articles: string[];
    cover_image?: string;
    has_file: boolean;
    file_size: number | null;
}

interface MajallaListProps {
    magazines: Issue[];
}

const getGradient = (theme: string, id: number): string => {
    const gradients = [
        'from-indigo-900 via-blue-900 to-teal-900',
        'from-amber-900 via-orange-900 to-red-900',
        'from-rose-900 via-pink-900 to-purple-900',
        'from-emerald-900 via-green-900 to-teal-900',
        'from-stone-900 via-zinc-900 to-slate-900',
        'from-violet-900 via-indigo-900 to-blue-900',
        'from-cyan-900 via-teal-900 to-emerald-900',
        'from-yellow-900 via-amber-900 to-orange-900',
        'from-lime-900 via-green-900 to-emerald-900',
        'from-blue-900 via-indigo-900 to-violet-900',
        'from-teal-900 via-cyan-900 to-blue-900',
        'from-orange-900 via-red-900 to-rose-900',
    ];
    const hash = theme.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[(hash + id) % gradients.length];
};

/* ── Featured issue card ─────────────────────────────────── */
function FeaturedCard({ issue }: { issue: Issue }) {
    const gradient = getGradient(issue.theme, issue.id);
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg transition-shadow mb-6">
            <div className={`bg-gradient-to-br ${gradient} relative p-8 flex gap-6 items-start`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                {/* Cover */}
                <div className="relative z-10 shrink-0 w-28 h-40 rounded-lg bg-white/10 border border-white/20 flex flex-col items-center justify-center gap-1 shadow-xl">
                    <Newspaper className="w-8 h-8 text-white/80" />
                    <span className="text-white/90 text-[11px] font-bold">شماره {issue.number}</span>
                    <span className="text-white/60 text-[10px]">{issue.date}</span>
                </div>
                {/* Text */}
                <div className="relative z-10 flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-300 text-[11px] font-bold">آخرین شماره</span>
                    </div>
                    <h2 className="text-white font-bold text-[20px] leading-snug mb-2">{issue.title}</h2>
                    <span className="inline-block bg-white/20 text-white text-[11px] px-2.5 py-0.5 rounded-full mb-3">{issue.theme}</span>
                    <p className="text-white/80 text-[13px] leading-relaxed line-clamp-3">{issue.description}</p>
                </div>
            </div>

            <div className="p-5">
                {issue.articles && issue.articles.length > 0 && (
                    <>
                        <p className="text-[12px] text-gray-500 font-bold mb-3">مقالات این شماره:</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {issue.articles.map((a) => (
                                <span key={a} className="text-[12px] bg-[#f0faf5] text-[#27ae60] px-2.5 py-1 rounded-full border border-[#27ae60]/20">
                                    {a}
                                </span>
                            ))}
                        </div>
                    </>
                )}
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[12px] text-gray-400">
                        <FileText className="w-3.5 h-3.5" />
                        {issue.articleCount} مقاله
                    </span>
                    {issue.has_file ? (
                        <div className="flex items-center gap-2">
                            <a
                                href={`/majalla/${issue.id}/read`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-[13px] text-[#27ae60] font-bold hover:underline"
                            >
                                <Eye className="w-4 h-4" /> مطالعه آنلاین
                            </a>
                            <span className="text-gray-300">|</span>
                            <a
                                href={`/majalla/${issue.id}/download`}
                                className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 font-medium hover:underline"
                            >
                                <Download className="w-4 h-4" /> دانلود
                            </a>
                        </div>
                    ) : (
                        <span className="text-[12px] text-gray-400">PDF در دسترس نیست</span>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── Regular issue card ──────────────────────────────────── */
function IssueCard({ issue }: { issue: Issue }) {
    const gradient = getGradient(issue.theme, issue.id);
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
            {/* Cover thumbnail */}
            <div className={`h-40 bg-gradient-to-br ${gradient} relative flex flex-col items-center justify-center gap-2`}>
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Newspaper className="w-5 h-5 text-white" />
                </div>
                <span className="relative z-10 text-white/90 text-[12px] font-bold">شماره {issue.number}</span>
                <span className="absolute top-3 end-3 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded">
                    {issue.date}
                </span>
                {issue.has_file && (
                    <span className="absolute top-3 start-3 bg-rose-600/80 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <FileText className="w-2.5 h-2.5" /> PDF
                    </span>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                <span className="text-[11px] text-[#27ae60] font-bold mb-1">{issue.theme}</span>
                <h3 className="font-bold text-[14px] text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#27ae60] transition-colors">
                    {issue.title}
                </h3>
                <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">
                    {issue.description}
                </p>
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {issue.articleCount} مقاله
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {issue.date}
                    </span>
                </div>
            </div>

            {issue.has_file ? (
                <div className="flex border-t border-gray-100">
                    <a
                        href={`/majalla/${issue.id}/read`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#f0faf5] text-[#27ae60] text-[12px] font-bold hover:bg-[#27ae60] hover:text-white transition-colors"
                    >
                        <Eye className="w-3.5 h-3.5" /> مطالعه
                    </a>
                    <div className="w-px bg-gray-100" />
                    <a
                        href={`/majalla/${issue.id}/download`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-50 text-gray-600 text-[12px] font-bold hover:bg-gray-200 transition-colors"
                    >
                        <Download className="w-3.5 h-3.5" /> دانلود
                    </a>
                </div>
            ) : (
                <div className="flex items-center justify-center px-4 py-2.5 bg-gray-50 text-gray-400 text-[12px] border-t border-gray-100">
                    PDF در دسترس نیست
                </div>
            )}
        </div>
    );
}

export function MajallaList({ magazines }: MajallaListProps) {
    const years = Array.from(new Set(magazines.map((m) => m.year))).sort().reverse();
    const allYears = ['همه', ...years];

    const [activeYear, setActiveYear] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const year = params.get('year');
            if (year && allYears.includes(year)) return year;
        }
        return 'همه';
    });

    const featured = magazines.find((m) => m.featured) || magazines[0];
    const filtered  = magazines.filter((m) => activeYear === 'همه' || m.year === activeYear);

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#27ae60]/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[#27ae60]" />
                </div>
                <div>
                    <p className="text-[13px] font-bold text-gray-800">مجله کتابخانه رسالت</p>
                    <p className="text-[11px] text-gray-400">{magazines.length} شماره منتشر شده</p>
                </div>
            </div>

            {/* Featured */}
            {featured && <FeaturedCard issue={featured} />}

            {/* Year filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {allYears.map((y) => (
                    <button
                        key={y}
                        onClick={() => setActiveYear(y)}
                        className={`text-[12px] px-4 py-1.5 rounded-full border font-medium transition-colors ${
                            activeYear === y
                                ? 'bg-[#27ae60] border-[#27ae60] text-white'
                                : 'border-gray-200 text-gray-600 hover:border-[#27ae60] hover:text-[#27ae60]'
                        }`}
                    >
                        {y === 'همه' ? 'همه شماره‌ها' : `سال ${y}`}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filtered.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>شماره‌ای برای این سال یافت نشد.</p>
                </div>
            )}
        </div>
    );
}
