export interface AuthUser {
    id?: string | number;
    username?: string;
    name?: string;
    surname?: string;
    email?: string;
    image?: string;
    avatar?: string;
    bio?: string;
    gender?: string;
    dateofbirth?: string;
    tokens?: { access: string; refresh: string }
    [key: string]: unknown;
}

export interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    loginSuccess: (user: AuthUser, tokens: { access: string; refresh: string }) => void;
    logout: () => void;
    updateUser: (userData: Partial<AuthUser>) => void;
}





