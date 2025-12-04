import {ReactNode, useEffect, useState} from "react";
import AuthContext from "./AuthContext";
import type {AuthUser} from "../types/auth";
import { apiClient } from "../client/apiClient";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await apiClient.get<{ user: AuthUser }>("/auth/me");
                setUser(res.data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        void loadUser();
    }, []);

    const loginSuccess = (userData: AuthUser, tokens: { access: string; refresh: string }) => {
        localStorage.setItem("access_token", tokens.access);
        localStorage.setItem("refresh_token", tokens.refresh);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, loading, loginSuccess, logout}}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
