import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";


import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

import appBackground from './assets/background-image.avif';


function App() {
    const [isMounted, setIsMounted] = useState(false);


    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);



    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gray-900">
            <img
                src={appBackground}
                alt="Digital background"
                className="absolute inset-0 z-0 h-full w-full object-cover opacity-50 blur-sm"
            />
            <div className="absolute  z-10 bg-black/50"></div>

            <h1
                className={`absolute left-8 top-8 z-20 text-3xl font-bold text-white transition-all duration-1000 ease-out ${
                    isMounted
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-10 opacity-0"
                }`}
            >
                MrMahir
            </h1>

            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </div>
    );
}

export default App;