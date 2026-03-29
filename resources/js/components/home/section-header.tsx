import { ChevronRight, ChevronLeft } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    showNav?: boolean;
}

export function SectionHeader({ title, showNav = true }: SectionHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-200 relative">
            {/* Colored underline accent on right (RTL start) */}
            <div className="absolute bottom-[-2px] end-0 w-24 h-[2px] bg-[#27ae60]" />

            <h2 className="text-[16px] font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#27ae60] rounded-full inline-block" />
                {title}
            </h2>

            {showNav && (
                <div className="flex items-center gap-1">
                    <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 hover:border-[#27ae60] hover:text-[#27ae60] transition-colors text-gray-500">
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 hover:border-[#27ae60] hover:text-[#27ae60] transition-colors text-gray-500">
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
}
