export type Role = {
    id: number;
    name: string;
};

export type UserData = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    is_active: boolean;
    roles: Role[];
    created_at: string;
    updated_at: string;
};

export type UserFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    is_active: boolean;
};

export type UsersPageProps = {
    users: {
        data: UserData[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    roles: Role[];
    filters: {
        search?: string;
        role?: string;
    };
};
