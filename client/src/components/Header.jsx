import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, User, LogOut, Bell } from 'lucide-react';

export default function Header() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const NavLink = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border border-transparent
                ${isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
                <Icon size={18} />
                <span className="font-medium text-sm">{label}</span>
            </Link>
        )
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-20 z-50 flex items-center justify-between px-6 md:px-10 bg-black/80 backdrop-blur-xl border-b border-white/10">

            {/* SOL: LOGO */}
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    <div className="h-full w-full rounded-lg bg-black flex items-center justify-center">
                        <span className="font-bold text-white text-xl">M</span>
                    </div>
                </div>
                <div className="hidden md:block">
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wider">
                        MrMahir
                    </h1>
                </div>
            </div>

            <nav className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/5">
                <NavLink to="/" icon={LayoutDashboard} label="Dashboard" />
                <NavLink to="/profile" icon={User} label="Profilim" />
            </nav>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_#06b6d4]"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-semibold text-gray-200">{user?.username}</p>
                        <p className="text-xs text-cyan-500">Admin</p>
                    </div>

                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 p-[2px]">
                        <img
                            src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                            alt="Avatar"
                            className="h-full w-full rounded-full object-cover bg-black"
                        />
                    </div>

                    <button
                        onClick={logout}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full transition-all"
                        title="Çıkış Yap"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
}