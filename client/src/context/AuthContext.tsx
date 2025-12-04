import { createContext, useContext } from "react";

export interface AuthUser {
    id?: string | number;
    name?: string;
    email?: string;
    [key: string]: unknown;
}

export interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    loginSuccess: (userData: AuthUser, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
};

export default AuthContext;



