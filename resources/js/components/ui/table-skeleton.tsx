import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
    return (
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex gap-4 bg-muted/30 px-4 py-3">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={`h-${i}`} className="h-4 flex-1 rounded" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <div key={rowIdx} className="flex gap-4 border-t px-4 py-3">
                    {Array.from({ length: columns }).map((_, colIdx) => (
                        <Skeleton
                            key={`${rowIdx}-${colIdx}`}
                            className="h-4 flex-1 rounded"
                            style={{ opacity: 1 - rowIdx * 0.1 }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
