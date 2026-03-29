import { useState } from 'react';
import { CalendarDays, Globe, ChevronDown, Facebook, Twitter, Youtube, Rss } from 'lucide-react';

const LANGUAGES = [
    { label: 'فارسی', active: true },
    { label: 'English' },
    { label: 'العربية' },
];

export function TopBar() {
    const [langOpen, setLangOpen] = useState(false);

    return (
        <div className="bg-[#141824] text-gray-400 text-[13px] border-b border-white/5">
            <div className="max-w-[1240px] mx-auto px-4 py-2 flex justify-between items-center">
                {/* Date */}
                <div className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
                    <span>امروز — یکشنبه ۹ حمل ۱۴۰۴</span>
                </div>

                {/* Language + Social */}
                <div className="flex items-center gap-4">
                    {/* Language dropdown */}
                    <div className="relative">
                        <button
                            className="flex items-center gap-1 hover:text-white transition-colors"
                            onClick={() => setLangOpen((v) => !v)}
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span>فارسی</span>
                            <ChevronDown className="w-3 h-3" />
                        </button>
                        {langOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setLangOpen(false)}
                                />
                                <div className="absolute end-0 top-full mt-1 bg-white text-gray-800 shadow-xl rounded-md z-50 min-w-[130px] overflow-hidden">
                                    {LANGUAGES.map((l) => (
                                        <a
                                            key={l.label}
                                            href="#"
                                            className={`block px-4 py-2 text-sm hover:bg-gray-50 hover:text-[#27ae60] transition-colors ${l.active ? 'font-bold text-[#27ae60]' : ''}`}
                                        >
                                            {l.label}
                                        </a>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Social icons */}
                    <div className="hidden sm:flex items-center gap-3">
                        {[Facebook, Twitter, Youtube, Rss].map((Icon, i) => (
                            <a key={i} href="#" className="hover:text-white transition-colors">
                                <Icon className="w-3.5 h-3.5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
