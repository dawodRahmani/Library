export type Permission = {
    id: number;
    name: string;
    group: string;
};

export type RoleData = {
    id: number;
    name: string;
    permissions: Permission[];
    users_count: number;
    created_at: string;
    updated_at: string;
};

export type RoleFormData = {
    name: string;
    permissions: number[];
};
