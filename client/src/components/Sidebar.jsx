import React from 'react';
import { FaHome, FaChartBar, FaCog, FaUser } from 'react-icons/fa';
import appİmage from '../assets/react.svg'
import { Button } from 'primereact/button';


function Sidebar() {
    return (
        <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
            <div className="p-5 h-20 flex items-center justify-center border-b border-gray-700">
                <h1 className="text-2xl font-bold"></h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">


                <a
                    href="#"
                    className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-700 transition-colors hover:bg-blue-950"
                >
                    <FaHome size={20} />
                    <div>Ana Sayfa</div>
                </a>
                <a
                    href="#"
                    className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-700 transition-colors"
                >
                    <FaChartBar size={20} />
                    <h1>Analiz</h1>
                </a>
                <a
                    href="#"
                    className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-700 transition-colors"
                >
                    <FaUser size={20} />
                    <span>Kullanıcılar</span>
                </a>
                <a
                    href="#"
                    className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-700 transition-colors"
                >
                    <FaCog size={20} />
                    <span>Ayarlar</span>
                </a>
            </nav>

            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center space-x-3">
                    <img
                        src={appİmage}
                        alt="Profil"
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <p className="font-semibold">Kullanıcı Adı</p>
                        <p className="text-sm text-gray-400">Çıkış Yap</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;