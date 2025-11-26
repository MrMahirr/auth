import React, { useState, useEffect } from 'react';
import Editor from '../../components/Editor'; // Özel Editör Bileşenimiz
import api from '../../services/api';

import { Plus, Search, Trash2, FileText, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export default function BlogManager() {
    const [blogs, setBlogs] = useState([]);
    const [selectedId, setSelectedId] = useState('new');
    const [formData, setFormData] = useState({ title: '', content: '', image: '', category: '' });

    const fetchBlogs = async () => {
        try {
            const response = await api.get('/blogs');
            setBlogs(response.data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Seçim değiştiğinde formu doldur veya temizle ('Yeni' veya Mevcut Blog)
    useEffect(() => {
        if (selectedId === 'new') {
            setFormData({ title: '', content: '', image: '', category: '' });
        } else {
            const blog = blogs.find(b => b.id === selectedId);
            if (blog) setFormData(blog);
        }
    }, [selectedId, blogs]);

    // Normal Inputlar (Başlık, Kategori, Resim URL) için Handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Editörden gelen HTML içeriği için Handler
    const handleContentChange = (htmlValue) => {
        setFormData(prev => ({ ...prev, content: htmlValue }));
    };

    // Kaydetme İşlemi (Hem Ekleme Hem Güncelleme)
    const handleSave = async () => {
        if (!formData.title) {
            alert("Lütfen en azından bir başlık girin.");
            return;
        }

        try {
            if (selectedId === 'new') {
                // YENİ EKLEME
                const response = await api.post('/blogs', formData);
                await fetchBlogs();
                setSelectedId(response.data.id); // Kaydettikten sonra o blogu seçili hale getir
            } else {
                // GÜNCELLEME
                await api.put(`/blogs/${selectedId}`, formData);
                await fetchBlogs();
            }
            alert("Blog başarıyla kaydedildi!");
        } catch (error) {
            console.error("Error saving blog:", error);
            alert("Kaydetme sırasında bir hata oluştu.");
        }
    };

    // Silme İşlemi
    const handleDelete = async () => {
        if (window.confirm("Bu bloğu silmek istediğine emin misin? Bu işlem geri alınamaz.")) {
            try {
                await api.delete(`/blogs/${selectedId}`);
                await fetchBlogs();
                setSelectedId('new'); // Silince 'Yeni Ekle' moduna dön
            } catch (error) {
                console.error("Error deleting blog:", error);
                alert("Silme sırasında bir hata oluştu.");
            }
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6 text-gray-100 overflow-hidden">

            {/* --- SOL PANEL (BLOG LİSTESİ) --- */}
            <aside className="w-1/3 min-w-[300px] flex flex-col bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">

                {/* Sol Üst Başlık ve Yeni Ekle Butonu */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                    <h2 className="font-bold text-lg text-cyan-400">Blog Yazıları</h2>
                    <button
                        onClick={() => setSelectedId('new')}
                        className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)] flex items-center gap-2 text-sm font-semibold"
                    >
                        <Plus size={18} /> Yeni Ekle
                    </button>
                </div>

                {/* Arama Kutusu */}
                <div className="p-4 pb-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Bloglarda ara..."
                            className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-gray-600 text-gray-300"
                        />
                    </div>
                </div>

                {/* Liste Alanı */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {blogs.length === 0 && (
                        <div className="text-center text-gray-500 mt-10 text-sm">Henüz blog yazısı yok.</div>
                    )}

                    {blogs.map((blog) => (
                        <div
                            key={blog.id}
                            onClick={() => setSelectedId(blog.id)}
                            className={`group p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:bg-white/5 relative overflow-hidden 
                                ${selectedId === blog.id
                                    ? 'bg-cyan-900/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                    : 'bg-transparent border-transparent hover:border-white/10'
                                }`
                            }
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h3 className={`font-semibold text-sm truncate pr-2 ${selectedId === blog.id ? 'text-cyan-300' : 'text-gray-300'}`}>
                                    {blog.title || 'Başlıksız Yazı'}
                                </h3>
                                {selectedId === blog.id && <ChevronRight size={16} className="text-cyan-500 animate-pulse" />}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">
                                {/* HTML etiketlerini temizleyerek sadece metni göster (Önizleme için) */}
                                {blog.content?.replace(/<[^>]+>/g, '') || 'İçerik yok...'}
                            </p>
                        </div>
                    ))}
                </div>
            </aside>


            {/* --- SAĞ PANEL (EDİTÖR & FORM) --- */}
            <main className="flex-1 bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col overflow-hidden relative shadow-xl">

                {/* Editör Header */}
                <header className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${selectedId === 'new' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'}`}>
                            {selectedId === 'new' ? <Plus size={20} /> : <FileText size={20} />}
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-white">
                                {selectedId === 'new' ? 'Yeni Blog Oluştur' : 'Bloğu Düzenle'}
                            </h1>
                            <p className="text-xs text-gray-500">
                                {selectedId === 'new' ? 'Yeni bir hikaye yazmaya başla.' : 'Mevcut içeriği düzenliyorsun.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {selectedId !== 'new' && (
                            <button
                                onClick={handleDelete}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                                title="Bu Bloğu Sil"
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                        <Button
                            label="Kaydet"
                            icon="pi pi-save"
                            onClick={handleSave}
                            className="!bg-cyan-600 !border-none hover:!bg-cyan-500 !py-2 !px-5 !text-sm !font-bold shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all hover:scale-105"
                        />
                    </div>
                </header>

                {/* Form İçeriği */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-6 pb-10">

                        {/* Görsel Yükleme / URL Alanı */}
                        <div className="relative group w-full h-48 rounded-xl border-2 border-dashed border-gray-700 hover:border-cyan-500/50 flex flex-col items-center justify-center transition-all bg-black/20 overflow-hidden">
                            {formData.image ? (
                                <>
                                    <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white text-sm font-medium">Görseli Değiştirmek İçin URL Girin</p>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-gray-500 group-hover:text-cyan-400 transition-colors">
                                    <ImageIcon size={32} className="mb-2" />
                                    <span className="text-sm font-medium">Kapak Görseli URL'si Ekleyin</span>
                                </div>
                            )}

                            {/* URL Input'u üzerine gelince görünür yapalım veya her zaman altta tutalım */}
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                className="absolute bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 text-white text-xs p-3 focus:outline-none focus:border-cyan-500 transition-all translate-y-full group-hover:translate-y-0"
                                placeholder="https://ornek-gorsel.com/resim.jpg"
                            />
                        </div>

                        {/* Başlık ve Kategori Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Blog Başlığı</label>
                                <InputText
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Etkileyici bir başlık girin..."
                                    className="w-full !bg-black/50 !border-gray-700 focus:!border-cyan-500 !text-lg !font-bold !text-white !p-3 !rounded-xl transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Kategori</label>
                                <InputText
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    placeholder="Örn: Teknoloji"
                                    className="w-full !bg-black/50 !border-gray-700 focus:!border-cyan-500 !text-white !p-3 !rounded-xl transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {/* --- ÖZEL EDİTÖR --- */}
                        <div className="space-y-2 h-[500px] flex flex-col">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">İçerik</label>

                            <div className="flex-1 rounded-xl overflow-hidden shadow-inner ring-1 ring-white/5">
                                <Editor
                                    value={formData.content}
                                    onChange={handleContentChange}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}