import {Link, useLocation} from 'react-router-dom';
import {useState, useRef, useEffect} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import {LayoutDashboard, User, LogOut, Bell, FileText, PlusCircle, List, ChevronDown, ChevronRight} from 'lucide-react';

export default function Header() {
    const {user, logout} = useAuth();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false); // Ana menü açık mı?
    const [isBlogExpanded, setIsBlogExpanded] = useState(false); // Blog alt menüsü açık mı?
    const menuRef = useRef(null); // Dışarı tıklamayı algılamak için

    // Menü açıkken dışarı tıklanırsa kapat
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
                setIsBlogExpanded(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const NavLink = ({to, icon: Icon, label}) => {
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
                <Icon size={18}/>
                <span className="font-medium text-sm">{label}</span>
            </Link>
        )
    };

    return (
        <header
            className="fixed top-0 left-0 right-0 h-20 z-50 flex items-center justify-between px-6 md:px-10 bg-black/80 backdrop-blur-xl border-b border-white/10">

            {/* SOL: LOGO */}
            <div className="flex items-center gap-3">
                <div
                    className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.4)]">
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
                <NavLink to="/" icon={LayoutDashboard} label="Dashboard"/>
                <NavLink to="/blog" icon={FileText} label="Bloğum"/>
                <NavLink to="/profile" icon={User} label="Profilim"/>
            </nav>

            <div className="flex items-center gap-4">
                <button
                    className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                    <Bell size={20}/>
                    <span
                        className="absolute top-2 right-2 h-2 w-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_#06b6d4]"></span>
                </button>

                <div className="relative pl-4 border-l border-white/10" ref={menuRef}>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-3 group focus:outline-none"
                    >
                        <div className="text-right hidden lg:block">
                            <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{user?.username}</p>
                            <p className="text-xs text-cyan-500">Admin</p>
                        </div>

                        <div
                            className={`h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 p-[2px] transition-transform duration-300 ${isMenuOpen ? 'scale-110 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : ''}`}>
                            <img
                                src={user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                alt="Avatar"
                                className="h-full w-full rounded-full object-cover bg-black"
                            />
                        </div>

                        <ChevronDown size={16}
                                     className={`text-gray-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}/>
                    </button>

                    {isMenuOpen && (
                        <div
                            className="absolute right-0 top-full mt-4 w-64 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-5 duration-200 z-50">

                            <div className="p-2 space-y-1">

                                <div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsBlogExpanded(!isBlogExpanded);
                                        }}
                                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FileText size={18} className="text-cyan-400"/>
                                            <span>Blog Yönetimi</span>
                                        </div>
                                        <ChevronRight size={16}
                                                      className={`transition-transform duration-200 ${isBlogExpanded ? 'rotate-90' : ''}`}/>
                                    </button>


                                    {isBlogExpanded && (
                                        <div
                                            className="ml-4 pl-4 border-l border-white/10 space-y-1 my-1 animate-in slide-in-from-left-2 duration-200">
                                            <Link
                                                to="/blogManager/*"
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <PlusCircle size={16}/>
                                                <span>Blog Ekle</span>
                                            </Link>
                                            <Link
                                                to="/blogManager/*"
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <List size={16}/>
                                                <span>Blog Görüntüle</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <div className="h-px bg-white/10 my-1 mx-2"></div>


                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User size={18} className="text-purple-400"/>
                                    <span>Profilim</span>
                                </Link>

                                <div className="h-px bg-white/10 my-1 mx-2"></div>


                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <LogOut size={18}/>
                                    <span>Çıkış Yap</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}