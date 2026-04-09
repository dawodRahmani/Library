import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FileText,
    Headphones,
    LayoutGrid,
    Mail,
    MessageSquare,
    Newspaper,
    Settings,
    Users,
    Video,
    Globe,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
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

    // ── Content Management ────────────────────────────────
    const contentItems: NavItem[] = [];
    if (can('books.view')) {
        contentItems.push({ title: t('sidebar.books'), href: '/admin/books', icon: BookOpen });
    }
    if (can('videos.view')) {
        contentItems.push({ title: t('sidebar.videos'), href: '/admin/videos', icon: Video });
    }
    if (can('audios.view')) {
        contentItems.push({ title: t('sidebar.audios'), href: '/admin/audios', icon: Headphones });
    }
    if (can('fatwas.view')) {
        contentItems.push({ title: t('sidebar.fatwas'), href: '/admin/fatwas', icon: MessageSquare });
        contentItems.push({ title: 'بیانیه‌ها', href: '/admin/statements', icon: FileText });
    }
    if (can('articles.view')) {
        contentItems.push({ title: t('sidebar.articles'), href: '/admin/articles', icon: FileText });
    }
    if (can('magazines.view')) {
        contentItems.push({ title: t('sidebar.magazines'), href: '/admin/magazines', icon: Newspaper });
    }
    // Categories are now managed inline within each content section's page

    const contentGroups = contentItems.length > 0 ? [{
        title: t('sidebar.contentManagement'),
        icon: BookOpen,
        items: contentItems,
    }] : [];

    // ── Settings ──────────────────────────────────────────
    const settingsItems: NavItem[] = [];
    if (can('users.view')) {
        settingsItems.push({ title: t('sidebar.users'), href: '/users', icon: Users });
    }
    if (can('settings.manage')) {
        settingsItems.push(
            { title: 'تنظیمات سایت', href: '/admin/site-settings', icon: Globe },
            { title: 'پیام‌های تماس', href: '/admin/messages', icon: Mail },
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
                {contentGroups.length > 0 && <NavGroup groups={contentGroups} label={t('sidebar.contentManagement')} />}
                <NavGroup groups={settingsGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
