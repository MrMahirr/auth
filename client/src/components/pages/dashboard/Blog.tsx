import { useState, useEffect } from "react";
import { Calendar, Clock, ArrowLeft, Share2, ChevronRight } from "lucide-react";
import { serviceContainer } from "../../../containers/serviceContainer";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import type { Blog } from "../../../types/blog";

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const apiPromise = serviceContainer.blogService.getBlogs().catch((err) => {
                    console.error("API fetch error:", err);
                    return [] as Blog[];
                });

                const firestorePromise = getDocs(collection(db, "blogs")).catch(() => null);

                const [apiBlogs, firestoreSnapshot] = await Promise.all([apiPromise, firestorePromise]);
                const firestoreBlogs: Blog[] = [];


                if (firestoreSnapshot && firestoreSnapshot.docs) {
                    // Firestore snapshot tipi dinamik, bu yüzden gevşek tanım kullanıyoruz
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    firestoreSnapshot.forEach((doc: any) => {
                        const data = doc.data();
                        const blogData: Blog = {
                            id: doc.id,
                            ...data,
                            createdAt: data.created_at?.toDate
                                ? data.created_at.toDate().toISOString()
                                : data.created_at || new Date().toISOString(),
                            created_at: data.created_at?.toDate
                                ? data.created_at.toDate().toISOString()
                                : data.created_at || new Date().toISOString(),
                        };
                        firestoreBlogs.push(blogData);
                    });
                }

                const allBlogs: Blog[] = [...firestoreBlogs, ...apiBlogs].sort((a, b) => {
                    const dateA = new Date(a.createdAt || a.created_at || 0);
                    const dateB = new Date(b.createdAt || b.created_at || 0);
                    return dateB.getTime() - dateA.getTime();
                });

                setBlogs(allBlogs);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };
        void fetchBlogs();
    }, []);

    const calculateReadTime = (content?: string) => {
        if (!content) return "1 dk";
        const wordsPerMinute = 200;
        const text = content.replace(/<[^>]+>/g, "");
        const wordCount = text.trim().split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readTime} dk`;
    };

    const formatDate = (dateValue?: string | Date) => {
        if (!dateValue) return "";

        const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
        if (Number.isNaN(date.getTime())) return "";

        return date.toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleReadMore = (blog: Blog) => {
        setSelectedBlog(blog);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleBack = () => {
        setSelectedBlog(null);
    };

    const handleShare = async () => {
        if (!selectedBlog) return;

        const shareData = {
            title: selectedBlog.title || document.title,
            text: `Okuduğum bu makaleyi incele: ${selectedBlog.title}  https://gbtalks.com/`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log("İçerik başarıyla paylaşıldı.");
            } catch (error: any) {
                console.log("Paylaşım iptal edildi veya başarısız oldu:", error.message);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareData.url);
                // basit alert, ek UI yok
                alert("Makalenin bağlantısı panoya kopyalandı!");
            } catch (err) {
                console.error("Panoya kopyalama başarısız:", err);
                alert("Makalenin bağlantısı kopyalanamadı.");
            }
        }
    };

    return (
        <div className="min-h-screen text-gray-100 pb-20">
            <div className="relative py-20 px-6 text-center overflow-hidden">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] -z-10"></div>
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 tracking-tight">
                    Evrensel Günlük
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                    Teknoloji, tasarım ve geleceğe dair fikirlerin paylaşıldığı dijital uzay istasyonuna hoş geldiniz.
                </p>
            </div>

            <div className="container mx-auto px-4 md:px-8">
                {selectedBlog ? (
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

                        <div
                            className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                            <div className="h-[400px] w-full relative">
                                {selectedBlog.image && (
                                    <img
                                        src={selectedBlog.image}
                                        alt={selectedBlog.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    {selectedBlog.category && (
                                        <span
                                            className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-sm font-semibold mb-3 backdrop-blur-md">
                                            {selectedBlog.category}
                                        </span>
                                    )}
                                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                        {selectedBlog.title}
                                    </h1>
                                    <div className="flex items-center gap-6 text-gray-300 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-purple-400" />
                                            {formatDate(
                                                selectedBlog.createdAt || selectedBlog.created_at
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-purple-400" />
                                            {calculateReadTime(selectedBlog.content)} okuma süresi
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 md:p-12">
                                <div
                                    className="prose prose-invert prose-lg max-w-none
                                    prose-headings:text-white prose-a:text-cyan-400 prose-strong:text-cyan-300
                                    prose-blockquote:border-l-cyan-500 prose-blockquote:bg-black/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                                    prose-img:rounded-xl prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10"
                                    dangerouslySetInnerHTML={{
                                        __html: selectedBlog.content || "",
                                    }}
                                ></div>

                                <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                                    <p className="text-gray-400 italic">Okuduğunuz için teşekkürler.</p>
                                    <button
                                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                        onClick={handleShare}
                                    >
                                        <Share2 size={18} /> <span className="text-sm">Paylaş</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <div
                                key={blog.id}
                                onClick={() => handleReadMore(blog)}
                                className="group relative bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30"
                            >
                                <div className="h-56 overflow-hidden relative">
                                    {blog.image && (
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    )}
                                    <div className="absolute top-4 left-4">
                                        {blog.category && (
                                            <span
                                                className="px-3 py-1 bg-black/60 backdrop-blur-md text-xs font-bold text-white rounded-full border border-white/10">
                                                {blog.category}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />{" "}
                                            {formatDate(blog.createdAt || blog.created_at)}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} /> {calculateReadTime(blog.content)}
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                                        {blog.title}
                                    </h2>

                                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                                        {(blog.content || "").replace(/<[^>]+>/g, "")}
                                    </p>

                                    <div
                                        className="flex items-center text-cyan-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                                        <>Devamını O</>
                                        ku <ChevronRight size={16} className="ml-1" />
                                    </div>
                                </div>

                                <div
                                    className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-500/20 rounded-2xl pointer-events-none transition-colors"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}



