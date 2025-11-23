import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import { Cpu, Activity, Users, Server, Zap, Globe, Shield } from 'lucide-react';

export default function DashboardPage() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
            datasets: [
                {
                    label: 'Sistem Yükü',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: true,
                    borderColor: '#06b6d4', // Cyan
                    backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    tension: 0.4
                },
                {
                    label: 'Aktif Bağlantılar',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: true,
                    borderColor: '#a855f7', // Purple
                    backgroundColor: 'rgba(168, 85, 247, 0.2)',
                    tension: 0.4
                }
            ]
        };

        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: { labels: { color: '#94a3b8' } }
            },
            scales: {
                x: {
                    ticks: { color: '#64748b' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    ticks: { color: '#64748b' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-md transition-all hover:border-gray-600 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] group">
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl transition-all group-hover:opacity-20 ${color}`}></div>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-white tracking-wide">{value}</h3>
                </div>
                <div className={`rounded-lg p-3 bg-gray-800/50 ${color.replace('bg-', 'text-')}`}>
                    <Icon size={24} />
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="flex items-center text-green-400 font-bold">
                    <Activity size={14} className="mr-1" /> {trend}
                </span>
                <span className="text-gray-500">geçen saate göre</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black/90 p-6 text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black">

            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        Komuta Merkezi
                    </h1>
                    <p className="mt-2 text-gray-400 flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Sistem Çevrimiçi • v2.4.0 (Stable)
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button label="Rapor İndir" icon="pi pi-download" className="p-button-outlined !border-gray-700 !text-gray-300 hover:!bg-gray-800 hover:!text-white !text-sm" />
                    <Button label="Sistemi Yenile" icon="pi pi-refresh" className="!bg-cyan-600 !border-none hover:!bg-cyan-500 !text-sm shadow-[0_0_15px_rgba(8,145,178,0.5)]" />
                </div>
            </div>

            {/* İstatistik Gridleri */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard title="Toplam Kullanıcı" value="12,450" icon={Users} color="bg-cyan-500" trend="+12%" />
                <StatCard title="Sunucu Yükü" value="45%" icon={Cpu} color="bg-purple-500" trend="-5%" />
                <StatCard title="Ağ Trafiği" value="1.2 TB" icon={Globe} color="bg-blue-500" trend="+24%" />
                <StatCard title="Güvenlik Skoru" value="98/100" icon={Shield} color="bg-green-500" trend="Güvenli" />
            </div>

            {/* Orta Bölüm: Grafik ve Loglar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Sol: Büyük Grafik */}
                <div className="col-span-1 lg:col-span-2 rounded-xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                            <Activity className="text-cyan-400" size={20} /> Performans Analizi
                        </h3>
                    </div>
                    <div className="h-[300px]">
                        <Chart type="line" data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Sağ: Server Durumu / Hızlı İşlemler */}
                <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-md flex flex-col gap-6">
                    <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                        <Server className="text-purple-400" size={20} /> Sunucu Nodları
                    </h3>

                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="group flex items-center justify-between rounded-lg bg-black/40 p-4 border border-gray-800 hover:border-cyan-500/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className={`h-2 w-2 rounded-full ${item === 3 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-300">Node-Alpha-0{item}</p>
                                        <p className="text-xs text-gray-500">IP: 192.168.1.{100+item}</p>
                                    </div>
                                </div>
                                <div className="text-xs font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    CONNECTING...
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto rounded-lg bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-4 border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="text-yellow-400" size={20} fill="currentColor" />
                            <span className="font-bold text-gray-200">Pro Plan</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">GPU kaynaklarınız %80 kapasiteye ulaştı.</p>
                        <Button label="Yükselt" className="w-full !bg-white/10 !border-white/20 hover:!bg-white/20 !text-xs" />
                    </div>
                </div>
            </div>
        </div>
    );
}