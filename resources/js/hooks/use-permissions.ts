import { usePage } from '@inertiajs/react';

interface PageProps {
    auth: {
        user: Record<string, unknown>;
        roles: string[];
        permissions: string[];
    };
    [key: string]: unknown;
}

export function usePermissions() {
    const { auth } = usePage<PageProps>().props;
    const permissions = auth.permissions ?? [];
    const roles = auth.roles ?? [];

    function can(permission: string): boolean {
        return permissions.includes(permission);
    }

    function hasRole(role: string): boolean {
        return roles.includes(role);
    }

    function hasAnyPermission(...perms: string[]): boolean {
        return perms.some((p) => permissions.includes(p));
    }

    return { can, hasRole, hasAnyPermission, permissions, roles };
}
