import {Routes, Route, Navigate} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import Profile from "./pages/dashboard/Profile";

function App() {
    return (
        <AuthProvider>
            <Routes>

                {/* Login & Register Grubu */}
                <Route element={<AuthLayout/>}>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                </Route>

                {/* Dashboard Grubu */}
                <Route path="/" element={<MainLayout/>}>
                    <Route index element={<DashboardPage/>}/>
                    <Route path="profile" element={<Profile/>}/>
                </Route>

                {/* Hatalı URL gelirse Login'e at */}
                <Route path="*" element={<Navigate to="/login"/>}/>

            </Routes>
        </AuthProvider>
    );
}

export default App;