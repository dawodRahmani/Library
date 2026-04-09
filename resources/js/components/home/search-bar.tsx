import { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Video, Headphones, FileText, Newspaper, Scale } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';

interface SearchResult {
    type: 'book' | 'video' | 'audio' | 'fatwa' | 'article' | 'magazine';
    title: string;
    url: string;
    image?: string;
}

const TYPE_ICONS: Record<SearchResult['type'], React.ElementType> = {
    book: BookOpen,
    video: Video,
    audio: Headphones,
    fatwa: Scale,
    article: FileText,
    magazine: Newspaper,
};

const TYPE_COLORS: Record<SearchResult['type'], string> = {
    book: 'bg-blue-500',
    video: 'bg-red-500',
    audio: 'bg-purple-500',
    fatwa: 'bg-[#27ae60]',
    article: 'bg-orange-500',
    magazine: 'bg-teal-500',
};

export function SearchBar() {
    const { t, i18n } = useTranslation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Debounced search
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            setOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/search?q=${encodeURIComponent(query.trim())}&lang=${i18n.language}`);
                const data: SearchResult[] = await res.json();
                setResults(data);
                setOpen(true);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, i18n.language]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Close on ESC
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    const clear = () => {
        setQuery('');
        setResults([]);
        setOpen(false);
        inputRef.current?.focus();
    };

    const handleSelect = (url: string) => {
        setOpen(false);
        setQuery('');
        router.visit(url);
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-[220px]">
            <div className="relative flex items-center">
                <Search className="absolute start-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('search.placeholder')}
                    className="w-full bg-white/10 text-white placeholder:text-gray-400 text-[13px] rounded-md ps-8 pe-7 py-1.5 border border-white/10 focus:outline-none focus:border-[#27ae60] focus:bg-white/15 transition-all"
                />
                {query && (
                    <button
                        onClick={clear}
                        className="absolute end-2 text-gray-400 hover:text-white transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {open && (
                <div className="absolute top-full start-0 end-0 mt-1 bg-white rounded-md shadow-2xl z-[100] overflow-hidden border border-gray-100 max-h-[380px] overflow-y-auto">
                    {loading ? (
                        <div className="px-4 py-3 text-[13px] text-gray-500">{t('common.loading')}</div>
                    ) : results.length === 0 ? (
                        <div className="px-4 py-3 text-[13px] text-gray-500">{t('search.noResults')}</div>
                    ) : (
                        results.map((result, i) => {
                            const Icon = TYPE_ICONS[result.type];
                            const color = TYPE_COLORS[result.type];
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(result.url)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0 text-start transition-colors"
                                >
                                    <span className={`${color} rounded-md p-1.5 shrink-0`}>
                                        <Icon className="w-3.5 h-3.5 text-white" />
                                    </span>
                                    <span className="flex-1 min-w-0">
                                        <span className="block text-[13px] text-gray-800 truncate">{result.title}</span>
                                        <span className="block text-[11px] text-gray-400">{t(`search.types.${result.type}`)}</span>
                                    </span>
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
