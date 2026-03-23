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
    ListChecks,
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
import { usePermissions } from '@/hooks/use-permissions';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { t } = useTranslation();
    const { can } = usePermissions();

    // ── Core nav items (filtered by permission) ──────────────
    const coreNavItems: NavItem[] = [
        {
            title: t('sidebar.dashboard'),
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(can('orders.create') ? [{
            title: t('sidebar.pos'),
            href: '/pos',
            icon: Monitor,
        }] : []),
        ...(can('orders.view') ? [{
            title: t('sidebar.orders'),
            href: '/orders',
            icon: ClipboardList,
        }] : []),
        ...(can('orders.view') ? [{
            title: t('sidebar.activeOrders'),
            href: '/orders/active',
            icon: ListChecks,
        }] : []),
        ...(can('tables.view') ? [{
            title: t('sidebar.tables'),
            href: '/tables',
            icon: SquareMenu,
        }] : []),
        ...(can('menu.view') ? [{
            title: t('sidebar.menu'),
            href: '/menu',
            icon: UtensilsCrossed,
        }] : []),
        ...(can('kitchen.view') ? [{
            title: t('sidebar.kitchen'),
            href: '/kitchen',
            icon: ChefHat,
        }] : []),
    ];

    // ── Inventory group ──────────────────────────────────────
    const inventoryItems: NavItem[] = [];
    if (can('inventory.view')) {
        inventoryItems.push(
            { title: t('sidebar.inventory'), href: '/inventory', icon: Package },
            { title: t('sidebar.suppliers'), href: '/inventory/suppliers', icon: Truck },
            { title: t('sidebar.purchaseOrders'), href: '/inventory/purchase-orders', icon: PackageSearch },
        );
    }

    const inventoryGroups = inventoryItems.length > 0 ? [{
        title: t('sidebar.inventoryGroup'),
        icon: Package,
        items: inventoryItems,
    }] : [];

    // ── Finance group ────────────────────────────────────────
    const financeItems: NavItem[] = [];
    if (can('finance.view')) {
        financeItems.push({ title: t('sidebar.accounting'), href: '/accounting', icon: BookOpen });
    }
    if (can('expenses.view')) {
        financeItems.push({ title: t('sidebar.expenses'), href: '/expenses', icon: CreditCard });
    }
    if (can('reports.view')) {
        financeItems.push({ title: t('sidebar.reports'), href: '/reports', icon: ScrollText });
    }

    const hrItems: NavItem[] = [];
    if (can('employees.view')) {
        hrItems.push({ title: t('sidebar.employees'), href: '/employees', icon: Users });
    }
    if (can('salaries.view')) {
        hrItems.push({ title: t('sidebar.salaries'), href: '/salaries', icon: Wallet });
    }

    const financeGroups = [];
    if (financeItems.length > 0) {
        financeGroups.push({
            title: t('sidebar.financeGroup'),
            icon: Landmark,
            items: financeItems,
        });
    }
    if (hrItems.length > 0) {
        financeGroups.push({
            title: t('sidebar.hrGroup'),
            icon: Users,
            items: hrItems,
        });
    }

    // ── Settings group ───────────────────────────────────────
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

    // ── Customer pages (always visible) ──────────────────────
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
                {inventoryGroups.length > 0 && (
                    <NavGroup groups={inventoryGroups} label={t('sidebar.inventorySection')} />
                )}
                {financeGroups.length > 0 && (
                    <NavGroup groups={financeGroups} label={t('sidebar.financeSection')} />
                )}
                <NavMain items={customerNavItems} label={t('sidebar.customerPages')} />
                <NavGroup groups={settingsGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
