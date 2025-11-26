import React, { useState } from 'react';
import { Calendar, Clock, ArrowLeft, Tag, Share2, ChevronRight } from 'lucide-react';

// Demo Veriler (Gerçekte API'den gelecek)
const MOCK_BLOGS = [
    {
        id: 1,
        title: "React 19: Frontend Dünyasında Devrim",
        content: `
            <p>React 19, frontend geliştirme süreçlerini kökten değiştirmeye hazırlanıyor. Özellikle <strong>React Compiler</strong> sayesinde artık <code>useMemo</code> ve <code>useCallback</code> gibi hook'lara olan ihtiyaç büyük ölçüde azalıyor.</p>
            <h3>Öne Çıkan Özellikler</h3>
            <ul>
                <li>Otomatik Memoization</li>
                <li>Gelişmiş Server Actions</li>
                <li>SEO Dostu Meta Tag Yönetimi</li>
            </ul>
            <p>Bu güncelleme ile birlikte performans optimizasyonu artık geliştiricinin sırtında bir yük olmaktan çıkıyor.</p>
        `,
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
        category: "Teknoloji",
        date: "26 Kasım 2025",
        readTime: "5 dk"
    },
    {
        id: 2,
        title: "Uzay Temalı UI Tasarımı Nasıl Yapılır?",
        content: `
            <p>Modern web tasarımlarında <i>Glassmorphism</i> ve Neon renklerin birleşimi, kullanıcılara derinlik hissi veren fütüristik deneyimler sunuyor.</p>
            <blockquote>"Tasarım sadece nasıl göründüğü değil, nasıl hissettirdiğiyle ilgilidir."</blockquote>
            <p>Karanlık modun yükselişiyle birlikte, yarı saydam paneller ve parlak vurgu renkleri (Cyan, Magenta) vazgeçilmez hale geldi.</p>
        `,
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
        category: "Tasarım",
        date: "25 Kasım 2025",
        readTime: "3 dk"
    },
    {
        id: 3,
        title: "Yapay Zeka Destekli Kodlama",
        content: "<p>GitHub Copilot ve ChatGPT gibi araçlar, yazılım geliştirme hızını ikiye katlıyor. Ancak kodun güvenliği ve doğruluğu hala insan denetimine muhtaç.</p>",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
        category: "Yapay Zeka",
        date: "24 Kasım 2025",
        readTime: "7 dk"
    },
];

export default function Blog() {
    const [selectedBlog, setSelectedBlog] = useState(null);

    // Blog Detayına Git
    const handleReadMore = (blog) => {
        setSelectedBlog(blog);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Listeye Geri Dön
    const handleBack = () => {
        setSelectedBlog(null);
    };

    return (
        <div className="min-h-screen text-gray-100 pb-20">

            {/* --- HERO / BAŞLIK ALANI --- */}
            <div className="relative py-20 px-6 text-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] -z-10"></div>
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 tracking-tight">
                    Evrensel Günlük
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                    Teknoloji, tasarım ve geleceğe dair fikirlerin paylaşıldığı dijital uzay istasyonuna hoş geldiniz.
                </p>
            </div>

            <div className="container mx-auto px-4 md:px-8">

                {selectedBlog ? (
                    // --- DETAY GÖRÜNÜMÜ ---
                    <article className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button
                            onClick={handleBack}
                            className="group flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors"
                        >
                            <div className="p-2 rounded-full bg-cyan-500/10 group-hover:bg-cyan-500/20">
                                <ArrowLeft size={20} />
                            </div>
                            <span className="font-medium">Bloglara Dön</span>
                        </button>

                        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                            {/* Kapak Görseli */}
                            <div className="h-[400px] w-full relative">
                                <img
                                    src={selectedBlog.image}
                                    alt={selectedBlog.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-sm font-semibold mb-3 backdrop-blur-md">
                                        {selectedBlog.category}
                                    </span>
                                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                        {selectedBlog.title}
                                    </h1>
                                    <div className="flex items-center gap-6 text-gray-300 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-purple-400" />
                                            {selectedBlog.date}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-purple-400" />
                                            {selectedBlog.readTime} okuma süresi
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* İçerik */}
                            <div className="p-8 md:p-12">
                                <div
                                    className="prose prose-invert prose-lg max-w-none
                                    prose-headings:text-white prose-a:text-cyan-400 prose-strong:text-cyan-300
                                    prose-blockquote:border-l-cyan-500 prose-blockquote:bg-black/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                                    prose-img:rounded-xl prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10"
                                    dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                                ></div>

                                {/* Alt Paylaşım Alanı */}
                                <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                                    <p className="text-gray-400 italic">Okuduğunuz için teşekkürler.</p>
                                    <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                                        <Share2 size={18} /> <span className="text-sm">Paylaş</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>

                ) : (
                    // --- LİSTE GÖRÜNÜMÜ ---
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {MOCK_BLOGS.map((blog) => (
                            <div
                                key={blog.id}
                                onClick={() => handleReadMore(blog)}
                                className="group relative bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30"
                            >
                                {/* Görsel */}
                                <div className="h-56 overflow-hidden relative">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-xs font-bold text-white rounded-full border border-white/10">
                                            {blog.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Kart İçeriği */}
                                <div className="p-6">
                                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {blog.date}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime}</span>
                                    </div>

                                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                                        {blog.title}
                                    </h2>

                                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                                        {blog.content.replace(/<[^>]+>/g, '')}
                                    </p>

                                    <div className="flex items-center text-cyan-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                                        Devamını Oku <ChevronRight size={16} className="ml-1" />
                                    </div>
                                </div>

                                {/* Hover Glow Efekti */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-500/20 rounded-2xl pointer-events-none transition-colors"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}