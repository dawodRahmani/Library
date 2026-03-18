import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    BookOpen,
    ChefHat,
    ClipboardList,
    CreditCard,
    KeyRound,
    Landmark,
    LayoutGrid,
    Monitor,
    Package,
    PackageSearch,
    QrCode,
    ScrollText,
    Settings,
    Shield,
    ShieldCheck,
    Smartphone,
    SquareMenu,
    Truck,
    Users,
    UtensilsCrossed,
    Wallet,
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
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { t } = useTranslation();

    const coreNavItems: NavItem[] = [
        {
            title: t('sidebar.dashboard'),
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: t('sidebar.pos'),
            href: '/pos',
            icon: Monitor,
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
    ];

    const inventoryGroups = [
        {
            title: t('sidebar.inventoryGroup'),
            icon: Package,
            items: [
                {
                    title: t('sidebar.inventory'),
                    href: '/inventory',
                    icon: Package,
                },
                {
                    title: t('sidebar.suppliers'),
                    href: '/inventory/suppliers',
                    icon: Truck,
                },
                {
                    title: t('sidebar.purchaseOrders'),
                    href: '/inventory/purchase-orders',
                    icon: PackageSearch,
                },
            ],
        },
    ];

    const financeGroups = [
        {
            title: t('sidebar.financeGroup'),
            icon: Landmark,
            items: [
                {
                    title: t('sidebar.accounting'),
                    href: '/accounting',
                    icon: BookOpen,
                },
                {
                    title: t('sidebar.expenses'),
                    href: '/expenses',
                    icon: CreditCard,
                },
                {
                    title: t('sidebar.reports'),
                    href: '/reports',
                    icon: ScrollText,
                },
            ],
        },
        {
            title: t('sidebar.hrGroup'),
            icon: Users,
            items: [
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
            ],
        },
    ];

    const settingsGroups = [
        {
            title: t('sidebar.settingsGroup'),
            icon: Settings,
            items: [
                { title: t('sidebar.users'), href: '/users', icon: ShieldCheck },
                { title: t('sidebar.roles'), href: '/roles', icon: Shield },
                { title: t('sidebar.permissions'), href: '/permissions', icon: KeyRound },
                { title: t('sidebar.settings'), href: '/settings/profile', icon: Settings },
            ],
        },
    ];

    const customerNavItems: NavItem[] = [
        {
            title: t('sidebar.kiosk'),
            href: '/kiosk',
            icon: Smartphone,
        },
        {
            title: t('sidebar.digitalMenu'),
            href: '/digital-menu',
            icon: QrCode,
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
                <NavMain items={coreNavItems} />
                <NavGroup groups={inventoryGroups} label={t('sidebar.inventorySection')} />
                <NavGroup groups={financeGroups} label={t('sidebar.financeSection')} />
                <NavMain items={customerNavItems} label={t('sidebar.customerPages')} />
                <NavGroup groups={settingsGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
