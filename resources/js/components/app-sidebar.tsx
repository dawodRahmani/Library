import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    ChefHat,
    ClipboardList,
    CreditCard,
    KeyRound,
    LayoutGrid,
    ScrollText,
    Settings,
    Shield,
    ShieldCheck,
    SquareMenu,
    Users,
    UtensilsCrossed,
    Wallet,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
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
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { t } = useTranslation();

    const mainNavItems: NavItem[] = [
        {
            title: t('sidebar.dashboard'),
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: t('sidebar.orders'),
            href: '/orders',
            icon: ClipboardList,
        },
        {
            title: t('sidebar.tables'),
            href: '/tables',
            icon: SquareMenu,
        },
        {
            title: t('sidebar.menu'),
            href: '/menu',
            icon: UtensilsCrossed,
        },
        {
            title: t('sidebar.kitchen'),
            href: '/kitchen',
            icon: ChefHat,
        },
        {
            title: t('sidebar.expenses'),
            href: '/expenses',
            icon: CreditCard,
        },
        {
            title: t('sidebar.employees'),
            href: '/employees',
            icon: Users,
        },
        {
            title: t('sidebar.salaries'),
            href: '/salaries',
            icon: Wallet,
        },
        {
            title: t('sidebar.reports'),
            href: '/reports',
            icon: ScrollText,
        },
    ];

    const adminNavItems: NavItem[] = [
        {
            title: t('sidebar.users'),
            href: '/users',
            icon: ShieldCheck,
        },
        {
            title: t('sidebar.roles'),
            href: '/roles',
            icon: Shield,
        },
        {
            title: t('sidebar.permissions'),
            href: '/permissions',
            icon: KeyRound,
        },
        {
            title: t('sidebar.settings'),
            href: '/settings/profile',
            icon: Settings,
        },
    ];

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
                <NavMain items={adminNavItems} label={t('sidebar.settings')} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
