import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";

import AuthLayout from "./components/layouts/AuthLayout";
import MainLayout from "./components/layouts/MainLayout";
import LoginPage from "./components/pages/auth/LoginPage";
import RegisterPage from "./components/pages/auth/RegisterPage";
import DashboardPage from "./components/pages/dashboard/DashboardPage";
import Profile from "./components/pages/dashboard/Profile";
import Blog from "./components/pages/dashboard/Blog";
import BlogManager from "./components/pages/blog/BlogManager";

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Login & Register Grubu */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Dashboard Grubu */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blogManager" element={<BlogManager />} />
                    <Route path="blogManager/*" element={<Navigate to="/blogManager" replace />} />
                </Route>

                {/* Hatalı URL gelirse Login'e at */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;




