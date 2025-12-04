import { ReactNode, useState, useEffect } from "react";
import api from "../services/api";
import AuthContext from "./AuthContext";
import type { AuthUser } from "../types/auth";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await api.get("/user");
                    setUser(response.data.user as AuthUser);
                } catch (error) {
                    console.error("Token verification failed:", error);
                    localStorage.removeItem("token");
                    setUser(null);
                }
            }
            setLoading(false);
        };
        void checkUser();
    }, []);

    const loginSuccess = (userData: AuthUser, token: string) => {
        localStorage.setItem("token", token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginSuccess, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};



