import { Skeleton } from '@/components/ui/skeleton';

export function PageSkeleton() {
    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 animate-in fade-in duration-300">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-40 rounded" />
                        <Skeleton className="h-3 w-24 rounded" />
                    </div>
                </div>
                <Skeleton className="h-9 w-28 rounded-lg" />
            </div>

            {/* Stats row skeleton */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
            </div>

            {/* Filters skeleton */}
            <div className="flex gap-3">
                <Skeleton className="h-10 flex-1 rounded-lg" />
                <Skeleton className="h-10 w-24 rounded-lg" />
                <Skeleton className="h-10 w-24 rounded-lg" />
            </div>

            {/* Table skeleton */}
            <Skeleton className="h-64 rounded-xl" />
        </div>
    );
}
