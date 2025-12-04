import { useState, useEffect, useRef, ChangeEvent, DragEvent } from "react";
import {
    Plus,
    Search,
    Trash2,
    FileText,
    Image as ImageIcon,
    ChevronRight,
    Upload,
    Loader2,
    Save,
    Check,
    AlertCircle,
} from "lucide-react";
import Editor from "../../Editor";
import api from "../../../services/api";
import { collection, addDoc, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import DatabaseSwitch from "../../DatabaseSwitch";
import type { BlogFormData } from "../../../types/blog";

interface ToastState {
    message: string;
    type: "success" | "error";
}

export default function BlogManager() {
    const [blogs, setBlogs] = useState<BlogFormData[]>([]);
    const [selectedId, setSelectedId] = useState<string>("new");
    const [formData, setFormData] = useState<BlogFormData>({
        title: "",
        content: "",
        image: "",
        category: "",
    });
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [isFirestore, setIsFirestore] = useState<boolean>(() => {
        const storedValue = localStorage.getItem("isFirestoreActive");
        return storedValue === "true";
    });

    const handleSetIsFirestore = (newValue: boolean) => {
        setIsFirestore(newValue);
        localStorage.setItem("isFirestoreActive", newValue.toString());
    };

    const saveToFirestore = async (payload: BlogFormData, blogId: string) => {
        try {
            const firestorePayload = {
                ...payload,
                created_at: blogId === "new" ? new Date() : formData.created_at || new Date(),
                updated_at: new Date(),
            };

            if (blogId === "new") {
                const res = await addDoc(collection(db, "blogs"), firestorePayload);
                return { id: res.id, db: "firestore" as const };
            } else {
                await setDoc(doc(db, "blogs", blogId), firestorePayload, { merge: true });
                return { id: blogId, db: "firestore" as const };
            }
        } catch (error: any) {
            console.error("Firestore save error:", error);
            throw new Error(`Firestore kayıt hatası: ${error.message}`);
        }
    };

    const showToast = (message: string, type: ToastState["type"] = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchBlogs = async () => {
        setIsLoading(true);
        try {
            const apiPromise = api.get("/blogs").catch((err) => {
                console.error("API fetch error:", err);
                return { data: [] as BlogFormData[] };
            });

            const firestorePromise = getDocs(collection(db, "blogs")).catch((err) => {
                console.error("Firestore fetch error:", err);
                return { docs: [] as any[] };
            });

            const [apiRes, firestoreSnapshot] = await Promise.all([apiPromise, firestorePromise]);

            const apiBlogs: BlogFormData[] = (Array.isArray(apiRes.data) ? apiRes.data : []).map(
                (b) => ({ ...b, dbSource: "postgres" as const })
            );

            const firestoreBlogs: BlogFormData[] = [];
            if (firestoreSnapshot && firestoreSnapshot.docs) {
                // @ts-expect-error - docs is not strongly typed
                firestoreSnapshot.forEach((d: any) => {
                    firestoreBlogs.push({
                        id: d.id,
                        ...d.data(),
                        dbSource: "firestore" as const,
                    });
                });
            }

            setBlogs([...firestoreBlogs, ...apiBlogs]);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            showToast("Bloglar yüklenirken hata oluştu", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectBlog = (id: string) => {
        setSelectedId(id);
        if (id === "new") {
            setFormData({ title: "", content: "", image: "", category: "" });
        } else {
            const blog = blogs.find((b) => String(b.id) === String(id));
            if (blog) {
                setFormData(blog);
                const isSourceFirestore = blog.dbSource === "firestore";
                handleSetIsFirestore(isSourceFirestore);
            }
        }
    };

    useEffect(() => {
        void fetchBlogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedId !== "new" && blogs.length > 0) {
            const blog = blogs.find((b) => String(b.id) === String(selectedId));
            if (blog) {
                setFormData(blog);
                const isSourceFirestore = blog.dbSource === "firestore";
                handleSetIsFirestore(isSourceFirestore);
            }
        }
    }, [blogs, selectedId]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (val: string) => {
        setFormData((prev) => ({ ...prev, content: val }));
    };

    const uploadImage = async (file?: File) => {
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showToast("Dosya boyutu 5MB'dan büyük olamaz!", "error");
            return;
        }

        const data = new FormData();
        data.append("file", file);

        setUploading(true);
        try {
            const response = await api.post("/upload?folder=blogs", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const imageUrl = response.data?.url as string | undefined;
            if (imageUrl) {
                setFormData((prev) => ({ ...prev, image: imageUrl }));
                showToast("Görsel başarıyla yüklendi!");
            } else {
                showToast("Görsel URL'i alınamadı.", "error");
            }
        } catch (error) {
            console.error("Upload error:", error);
            showToast("Yükleme sırasında hata oluştu.", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) =>
        void uploadImage(e.target.files?.[0]);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        await uploadImage(file);
    };

    const handleSave = async () => {
        if (!formData.title) {
            showToast("Lütfen bir başlık girin.", "error");
            return;
        }
        if (!formData.content) {
            showToast("Lütfen içerik girin.", "error");
            return;
        }
        if (!formData.category) {
            showToast("Lütfen bir kategori girin.", "error");
            return;
        }

        const payload: BlogFormData = {
            title: formData.title,
            content: formData.content,
            category: formData.category,
            image: formData.image,
        };

        try {
            if (isFirestore) {
                const result = await saveToFirestore(payload, selectedId);

                if (selectedId === "new") {
                    await fetchBlogs();
                    if (result?.id) handleSelectBlog(result.id);
                } else {
                    await fetchBlogs();
                }
                showToast("Blog başarıyla Firestore'a kaydedildi!");
            } else {
                if (selectedId === "new") {
                    const res = await api.post("/blogs", payload);
                    await fetchBlogs();
                    if (res.data?.id) handleSelectBlog(res.data.id);
                } else {
                    await api.put(`/blogs/${selectedId}`, payload);
                    await fetchBlogs();
                }
                showToast("Blog başarıyla PostgreSQL'e kaydedildi!");
            }
        } catch (e: any) {
            console.error("Save error:", e);
            const errorMessage =
                e.message || e.response?.data?.message || "Kaydetme hatası oluştu.";
            showToast(
                Array.isArray(errorMessage) ? (errorMessage[0] as string) : (errorMessage as string),
                "error"
            );
        }
    };

    const handleDelete = async () => {
        try {
            const blogToDelete = blogs.find((b) => String(b.id) === String(selectedId));
            if (!blogToDelete) {
                showToast("Silinecek blog bulunamadı.", "error");
                return;
            }

            if (blogToDelete.dbSource === "firestore") {
                await deleteDoc(doc(db, "blogs", selectedId));
            } else {
                await api.delete(`/blogs/${selectedId}`);
            }

            await fetchBlogs();
            handleSelectBlog("new");
            setShowDeleteModal(false);
            showToast("Blog silindi.");
        } catch (error) {
            console.error(error);
            showToast("Silme işlemi başarısız.", "error");
        }
    };

    const filteredBlogs = blogs.filter(
        (blog) =>
            blog.title && blog.title.toLowerCase().includes(searchTerm.toLocaleLowerCase("tr-TR"))
    );

    return (
        <div className="flex h-[calc(100vh-2rem)] gap-6 text-gray-100 overflow-hidden bg-gray-950 p-4 font-sans relative">
            {toast && (
                <div
                    className={`absolute top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in-down border backdrop-blur-md transition-all duration-300
                    ${
                        toast.type === "error"
                            ? "bg-red-500/20 border-red-500/50 text-red-200"
                            : "bg-cyan-500/20 border-cyan-500/50 text-cyan-200"
                    }`}
                >
                    {toast.type === "error" ? (
                        <AlertCircle size={20} />
                    ) : (
                        <Check size={20} />
                    )}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}

            {showDeleteModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl shadow-2xl w-full max-w-sm transform scale-100 transition-all">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="p-3 bg-red-500/10 rounded-full text-red-400">
                                <Trash2 size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">
                                    Silmek İstediğine Emin misin?
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Bu işlem geri alınamaz ve blog yazısı kalıcı olarak silinir.
                                </p>
                            </div>
                            <div className="flex w-full gap-3 mt-2">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
                                >
                                    Evet, Sil
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <aside className="w-1/3 min-w-[300px] flex flex-col bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                    <h2 className="font-bold text-lg text-cyan-400">Blog Yazıları</h2>
                    <button
                        onClick={() => handleSelectBlog("new")}
                        className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)]"
                    >
                        <Plus size={18} />
                    </button>
                </div>
                <div className="p-4 pb-2 relative">
                    <Search
                        className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-500"
                        size={16}
                    />
                    <input
                        type="text"
                        placeholder="Ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 text-gray-300"
                    />
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {filteredBlogs.length === 0 && (
                        <div className="text-center text-gray-500 mt-10 text-sm">
                            Liste boş.
                        </div>
                    )}
                    {filteredBlogs.map((blog) => (
                        <div
                            key={blog.id}
                            onClick={() => handleSelectBlog(String(blog.id))}
                            className={`group p-3 rounded-xl border cursor-pointer transition-all ${
                                String(selectedId) === String(blog.id)
                                    ? "bg-cyan-900/20 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                                    : "border-transparent hover:bg-white/5"
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h3
                                    className={`font-semibold text-sm truncate pr-2 ${
                                        String(selectedId) === String(blog.id)
                                            ? "text-cyan-300"
                                            : "text-gray-300"
                                    }`}
                                >
                                    {blog.title || "Başlıksız"}
                                </h3>
                                {String(selectedId) === String(blog.id) && (
                                    <ChevronRight
                                        size={16}
                                        className="text-cyan-500 animate-pulse"
                                    />
                                )}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">
                                {blog.content ? blog.content.substring(0, 60) : ""}
                            </p>
                        </div>
                    ))}
                </div>
            </aside>

            <main className="flex-1 bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col overflow-hidden relative shadow-xl">
                <header className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                    <div className="flex items-center gap-3">
                        <div
                            className={`p-2 rounded-lg ${
                                selectedId === "new"
                                    ? "bg-cyan-500/20 text-cyan-400"
                                    : "bg-purple-500/20 text-purple-400"
                            }`}
                        >
                            {selectedId === "new" ? <Plus size={20} /> : <FileText size={20} />}
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-white">
                                {selectedId === "new" ? "Yeni Blog" : "Düzenle"}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {selectedId !== "new" && (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg hover:text-red-300 transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        )}

                        <div>
                            <DatabaseSwitch
                                isFirestore={isFirestore}
                                setIsFirestore={handleSetIsFirestore}
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            className="p-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center gap-2 text-sm font-semibold shadow-[0_0_15px_rgba(8,145,178,0.4)]"
                        >
                            <Save size={18} /> Kaydet
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-6 pb-10">
                        <div
                            onClick={() => !uploading && fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className={`
                                relative group w-full h-64 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 overflow-hidden cursor-pointer
                                ${
                                    formData.image
                                        ? "border-cyan-500/30 bg-black/40"
                                        : "border-gray-700 hover:border-cyan-500/50 bg-black/20 hover:bg-black/30"
                                }
                                ${uploading ? "cursor-not-allowed opacity-90" : ""}
                            `}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                                accept="image/*"
                            />

                            {uploading ? (
                                <div className="flex flex-col items-center text-cyan-400 z-10">
                                    <Loader2
                                        size={48}
                                        className="animate-spin mb-3 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                    />
                                    <span className="text-sm font-semibold tracking-wider animate-pulse">
                                        GÖRSEL YÜKLENİYOR...
                                    </span>
                                </div>
                            ) : formData.image ? (
                                <>
                                    <img
                                        src={formData.image}
                                        alt="Kapak"
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                                        <div className="p-3 bg-cyan-600/20 rounded-full border border-cyan-500/30">
                                            <Upload size={32} className="text-cyan-400" />
                                        </div>
                                        <p className="text-white text-sm font-bold">
                                            Görseli Değiştir
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            Tıkla veya Sürükle
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-gray-500 group-hover:text-cyan-400 transition-colors duration-300">
                                    <div className="p-4 bg-white/5 rounded-full mb-3 group-hover:bg-cyan-500/10 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300">
                                        <ImageIcon size={40} />
                                    </div>
                                    <span className="text-base font-bold text-gray-400 group-hover:text-white transition-colors">
                                        Kapak Görseli Yükle
                                    </span>
                                    <span className="text-xs text-gray-600 mt-2">
                                        Dosyayı buraya sürükle veya seç
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                    Blog Başlığı
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Başlık..."
                                    className="w-full bg-black/50 border border-gray-700 focus:border-cyan-500 text-lg font-bold text-white p-3 rounded-xl outline-none transition-all focus:bg-black/70"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                    Kategori
                                </label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    placeholder="Kategori..."
                                    className="w-full bg-black/50 border border-gray-700 focus:border-cyan-500 text-white p-3 rounded-xl outline-none transition-all focus:bg-black/70"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 h-[500px] flex flex-col">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                İçerik
                            </label>
                            <div className="flex-1 rounded-xl overflow-hidden shadow-inner ...">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full text-cyan-500">
                                        <Loader2 className="animate-spin" size={32} />
                                    </div>
                                ) : (
                                    <Editor
                                        key={selectedId}
                                        value={formData.content || ""}
                                        onChange={handleContentChange}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}



