import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    BookOpen,
    FileText,
    Headphones,
    KeyRound,
    LayoutGrid,
    Layers,
    MessageSquare,
    Newspaper,
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

    // ── Content Management ────────────────────────────────
    const contentItems: NavItem[] = [];
    if (can('books.view')) {
        contentItems.push({ title: 'کتاب‌ها', href: '/admin/books', icon: BookOpen });
    }
    if (can('videos.view')) {
        contentItems.push({ title: 'ویدیوها', href: '/admin/videos', icon: Video });
    }
    if (can('audios.view')) {
        contentItems.push({ title: 'صوتی‌ها', href: '/admin/audios', icon: Headphones });
    }
    if (can('fatwas.view')) {
        contentItems.push({ title: 'دارالإفتاء', href: '/admin/fatwas', icon: MessageSquare });
    }
    if (can('articles.view')) {
        contentItems.push({ title: 'مقاله‌ها', href: '/admin/articles', icon: FileText });
    }
    if (can('magazines.view')) {
        contentItems.push({ title: 'مجله', href: '/admin/magazines', icon: Newspaper });
    }
    if (can('categories.manage')) {
        contentItems.push({ title: 'دسته‌بندی‌ها', href: '/admin/categories', icon: Layers });
    }

    const contentGroups = contentItems.length > 0 ? [{
        title: 'مدیریت محتوا',
        icon: BookOpen,
        items: contentItems,
    }] : [];

    // ── Settings ──────────────────────────────────────────
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
                {contentGroups.length > 0 && <NavGroup groups={contentGroups} label="مدیریت محتوا" />}
                <NavGroup groups={settingsGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
