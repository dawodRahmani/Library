import { useTranslation } from 'react-i18next';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    perPage?: number;
}

export function Pagination({ currentPage, totalPages, onPageChange, totalItems, perPage }: PaginationProps) {
    const { t } = useTranslation();

    if (totalPages <= 1) return null;

    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push('...');
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push('...');
        pages.push(totalPages);
    }

    const start = totalItems ? (currentPage - 1) * (perPage || 10) + 1 : 0;
    const end = totalItems ? Math.min(currentPage * (perPage || 10), totalItems) : 0;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {totalItems && (
                <p className="text-sm text-muted-foreground">
                    {t('common.showing')} {start}-{end} {t('common.of')} {totalItems} {t('common.results')}
                </p>
            )}
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    className="size-8 p-0"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    <ChevronRight className="size-4" />
                </Button>

                {pages.map((page, idx) =>
                    page === '...' ? (
                        <span key={`dots-${idx}`} className="px-2 text-sm text-muted-foreground">...</span>
                    ) : (
                        <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            className={`size-8 p-0 ${currentPage === page ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </Button>
                    ),
                )}

                <Button
                    variant="outline"
                    size="sm"
                    className="size-8 p-0"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    <ChevronLeft className="size-4" />
                </Button>
            </div>
        </div>
    );
}
