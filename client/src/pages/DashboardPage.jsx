import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function DashboardLayout() {
    return (
        <div className="flex h-screen bg-gray-100 w-full relative opacity-75">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <div className="container mx-auto">

                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                            Dashboard Ana Sayfa
                        </h2>

                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h1>ljşbhlad</h1>
                            <p>deneme Deneme</p>
                            <p> `react-router-dom` kullanarak bu alanı dinamik olarak değiştirilecek.</p>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;