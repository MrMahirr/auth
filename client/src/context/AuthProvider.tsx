import {ReactNode, useEffect, useState} from "react";
import AuthContext from "./AuthContext";
import type {AuthUser} from "../types/auth";
import {apiClient} from "../client/apiClient";

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
                const res = await apiClient.get<{ user: AuthUser }>("/user");
                setUser(res.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const loginSuccess = (userData: AuthUser, tokens: { access: string }) => {
        localStorage.setItem("access_token", tokens.access);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setUser(null);
    };

    if (loading) {
        return <div className="text-white">Yükleniyor...</div>;
    }

    return (
        <AuthContext.Provider value={{user, loading, loginSuccess, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

