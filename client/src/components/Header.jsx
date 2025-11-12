import React from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import appProfile from '../assets/react.svg';

function Header() {
    return (
        <header className="w-full h-20 bg-white shadow-md flex items-center justify-between p-6">
            <div className="flex items-center bg-gray-100 rounded-lg p-2">
                <FaSearch className="text-gray-500" />
                <input
                    type="text"
                    placeholder="Arama yap..."
                    className="bg-transparent outline-none ml-2 text-gray-700"
                />
            </div>

            <div className="flex items-center space-x-6">
                <button className="text-gray-600 hover:text-black relative">
                    <FaBell size={24} />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </button>
                <img
                    src={appProfile}
                    alt="Profil"
                    className="w-10 h-10 rounded-full cursor-pointer"
                />
            </div>
        </header>
    );
}

export default Header;