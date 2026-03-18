import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { IsCurrentUrlFn } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

interface NavGroupItem {
    title: string;
    icon?: React.ElementType;
    items: NavItem[];
}

interface NavGroupProps {
    label?: string;
    groups: NavGroupItem[];
    flatItems?: NavItem[];
}

export function NavGroup({ label, groups, flatItems = [] }: NavGroupProps) {
    const { isCurrentUrl } = useCurrentUrl();

    const isGroupActive = (items: NavItem[]) => items.some((item) => isCurrentUrl(item.href));

    return (
        <SidebarGroup className="px-2 py-0">
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {flatItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}

                {groups.map((group) => (
                    <CollapsibleGroup
                        key={group.title}
                        group={group}
                        isActive={isGroupActive(group.items)}
                        isCurrentUrl={isCurrentUrl}
                    />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

function CollapsibleGroup({
    group,
    isActive,
    isCurrentUrl,
}: {
    group: NavGroupItem;
    isActive: boolean;
    isCurrentUrl: IsCurrentUrlFn;
}) {
    const [open, setOpen] = useState(isActive);

    return (
        <SidebarMenuItem>
            <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        isActive={isActive && !open}
                        tooltip={{ children: group.title }}
                        className="w-full"
                    >
                        {group.icon && <group.icon />}
                        <span>{group.title}</span>
                        <ChevronLeft className="ms-auto transition-transform group-data-[state=open]/collapsible:-rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {group.items.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                                <SidebarMenuSubButton asChild isActive={isCurrentUrl(item.href)}>
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
}
