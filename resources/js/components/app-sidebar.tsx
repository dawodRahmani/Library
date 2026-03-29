import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    BookOpen,
    KeyRound,
    LayoutGrid,
    Settings,
    Shield,
    ShieldCheck,
    Video,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavGroup } from '@/components/nav-group';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { usePermissions } from '@/hooks/use-permissions';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { t } = useTranslation();
    const { can } = usePermissions();

    const mainNavItems: NavItem[] = [
        {
            title: t('sidebar.dashboard'),
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    const libraryGroups = [{
        title: t('sidebar.library'),
        icon: BookOpen,
        items: [
            { title: t('sidebar.books'),  href: '/library',        icon: BookOpen },
            { title: t('sidebar.videos'), href: '/library/videos', icon: Video },
        ],
    }];

    const settingsItems: NavItem[] = [];
    if (can('users.view')) {
        settingsItems.push({ title: t('sidebar.users'), href: '/users', icon: ShieldCheck });
    }
    if (can('settings.manage')) {
        settingsItems.push(
            { title: t('sidebar.roles'), href: '/roles', icon: Shield },
            { title: t('sidebar.permissions'), href: '/permissions', icon: KeyRound },
        );
    }
    settingsItems.push({ title: t('sidebar.settings'), href: '/settings/profile', icon: Settings });

    const settingsGroups = [{
        title: t('sidebar.settingsGroup'),
        icon: Settings,
        items: settingsItems,
    }];

    return (
        <Sidebar collapsible="icon" variant="inset" side="right">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavGroup groups={libraryGroups} label={t('sidebar.library')} />
                <NavGroup groups={settingsGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
