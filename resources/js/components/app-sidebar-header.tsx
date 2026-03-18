import { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const [spinning, setSpinning] = useState(false);

    const handleRefresh = useCallback(() => {
        setSpinning(true);
        router.reload({
            onFinish: () => setTimeout(() => setSpinning(false), 500),
        });
    }, []);

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ms-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleRefresh}
            >
                <RefreshCw className={cn('size-4', spinning && 'animate-spin')} />
            </Button>
        </header>
    );
}
