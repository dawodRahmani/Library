export type PermissionData = {
    id: number;
    name: string;
    group: string;
    roles: { id: number; name: string }[];
    created_at: string;
    updated_at: string;
};

export type PermissionFormData = {
    name: string;
    group: string;
};
