import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header";

export default function MainLayout() {
    const { user, loading } = useAuth();

    // 1️⃣ AuthProvider hala kullanıcıyı yüklerken hiçbir şey yapma
    if (loading) {
        return <div className="text-white">Yükleniyor...</div>;
    }

    // 2️⃣ Yükleme bitti ama kullanıcı yoksa login'e yönlendir
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-black to-black"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[100px] rounded-full"></div>
            </div>

            <Header />

            <main className="relative z-10 container mx-auto px-4 pt-24 pb-10">
                <Outlet />
            </main>
        </div>
    );
}
