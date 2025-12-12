import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useAuth } from "../../../context/AuthContext";
import { serviceContainer } from "../../../containers/serviceContainer";
import {
    User,
    Mail,
    Lock,
    Camera,
    Save,
    Loader2,
    ShieldCheck,
    Calendar as CalendarIcon,
    ChevronDown,
    AlertCircle,
} from "lucide-react";

interface ToastState {
    message: string;
    type: "success" | "error";
}

interface ProfileFormData {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    gender: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    bio: string;
    [key: string]: string;
}

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [blogCount, setBlogCount] = useState(0);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [formData, setFormData] = useState<ProfileFormData>({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        birthDate: "",
        gender: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        bio: "",
    });

    const showToast = (message: string, type: ToastState["type"] = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const fetchBlogCount = async () => {
            if (!user?.id) return;
            try {
                const blogs = await serviceContainer.blogService.getBlogs();
                const userBlogs = blogs.filter(
                    (blog) => blog.author?.id === user.id
                );
                setBlogCount(userBlogs.length);
            } catch (error) {
                console.error("Blog sayısı alınamadı:", error);
            }
        };
        void fetchBlogCount();
    }, [user]);

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                username: user.username ?? "",
                firstName: user.name ?? "",
                lastName: user.surname ?? "",
                email: user.email ?? "",
                birthDate: user.dateofbirth ?? "",
                gender: user.gender ?? "",
                bio: user.bio ?? "",
            }));
            setAvatarPreview(user.image || user.avatar || null);
        }
    }, [user]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        const data = new FormData();
        data.append("file", file);

        try {
            const uploadRes = await serviceContainer.userService.uploadAvatar(file);
            const newImageUrl: string = uploadRes.url;

            const oldImage = user.image || user.avatar;
            if (oldImage) {
                const oldFilename = oldImage.split("/").pop();
                if (
                    oldFilename &&
                    !oldImage.includes("dicebear") &&
                    !oldImage.includes("google")
                ) {
                    try {
                        await serviceContainer.userService.deleteAvatar(oldFilename);
                    } catch (err) {
                        console.warn("Eski resim silinemedi:", err);
                    }
                }
            }

            const payload = {
                username: formData.username,
                name: formData.firstName,
                surname: formData.lastName,
                email: formData.email,
                image: newImageUrl || "",
                bio: formData.bio || "",
                gender: formData.gender,
                dateofbirth: formData.birthDate,
            };

            await serviceContainer.userService.updateUser({ user: payload });

            setAvatarPreview(newImageUrl);
            updateUser({ image: newImageUrl });
            showToast("Profil fotoğrafı güncellendi.");
        } catch (error: any) {
            console.error("Avatar yükleme hatası:", error);
            const errorMsg = error?.response?.data?.message || "Profil fotoğrafı güncellenemedi.";
            showToast(errorMsg, "error");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            showToast("Yeni şifreler uyuşmuyor!", "error");
            return;
        }

        setLoading(true);
        try {
            const payload: Record<string, any> = {
                username: formData.username,
                name: formData.firstName,
                surname: formData.lastName,
                email: formData.email,
                bio: formData.bio || "",
                image: avatarPreview || "",
                gender: formData.gender,
                dateofbirth: formData.birthDate,
            };
            if (formData.newPassword) {
                payload.password = formData.newPassword;
            }

            await serviceContainer.userService.updateUser({ user: payload });

            updateUser({
                username: formData.username,
                name: formData.firstName,
                surname: formData.lastName,
                email: formData.email,
                bio: formData.bio,
                image: avatarPreview || "",
                gender: formData.gender,
                dateofbirth: formData.birthDate,
            });

            showToast("Profil bilgileri güncellendi.");

            setFormData(prev => ({
                ...prev,
                newPassword: "",
                confirmPassword: "",
            }));
        } catch (error: any) {
            console.error("Hata:", error);
            const errorMsg = error?.response?.data?.message || "Güncelleme başarısız.";
            showToast(errorMsg, "error");
        } finally {
            setLoading(false);
        }
    };

    const labelClass =
        "text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider mb-1 block";
    const inputWrapperClass = "relative flex items-center";
    const iconClass = "absolute left-4 text-gray-500 z-10 pointer-events-none";
    const inputClass = `
        w-full bg-black/50 border border-white/10 text-white p-3 pl-12 rounded-xl 
        focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 
        transition-all duration-300 shadow-inner placeholder:text-gray-600
    `;

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {toast && (
                <div
                    className={`fixed top-24 right-8 z-50 px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.3)] backdrop-blur-md flex items-center gap-3 animate-in slide-in-from-right border transition-all duration-300
                    ${toast.type === "error"
                            ? "bg-red-500/10 border-red-500 text-red-400"
                            : "bg-green-500/10 border-green-500 text-green-400"
                        }`}
                >
                    {toast.type === "error" ? (
                        <AlertCircle size={24} />
                    ) : (
                        <ShieldCheck size={24} />
                    )}
                    <div>
                        <h4 className="font-bold">
                            {toast.type === "error" ? "Hata!" : "Başarılı!"}
                        </h4>
                        <p className="text-sm opacity-90">{toast.message}</p>
                    </div>
                </div>
            )}

            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        Profil Ayarları
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Hesap bilgilerinizi ve tercihlerinizi yönetin.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-cyan-900/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                    <ShieldCheck size={16} />
                    <span>Hesabınız Güvende</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none"></div>

                        <div className="relative w-32 h-32 mx-auto mb-4 group">
                            <div className="w-full h-full rounded-full p-1 bg-gradient-to-tr from-cyan-400 to-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                <img
                                    src={
                                        avatarPreview ||
                                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                    }
                                    alt="Avatar"
                                    className="w-full h-full rounded-full object-cover bg-black border-4 border-black"
                                />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full shadow-lg transition-all hover:scale-110 border-2 border-black group-hover:rotate-12"
                            >
                                <Camera size={18} />
                            </button>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-1">
                            {user?.username || "Kullanıcı"}
                        </h2>
                        <p className="text-cyan-400 text-sm mb-6">{user?.email}</p>

                        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-white">
                                    {blogCount}
                                </span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">
                                    Blog
                                </span>
                            </div>
                            <div className="text-center border-l border-white/10">
                                <span className="block text-2xl font-bold text-white">2.4k</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">
                                    Okunma
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-8 shadow-xl"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-2">
                                <User className="text-purple-400" size={20} /> Kişisel Bilgiler
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Kullanıcı Adı</label>
                                    <div className={inputWrapperClass}>
                                        <User size={18} className={iconClass} />
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Kullanıcı Adı"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Ad</label>
                                    <div className={inputWrapperClass}>
                                        <User size={18} className={iconClass} />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="Adınız"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Soyad</label>
                                    <div className={inputWrapperClass}>
                                        <User size={18} className={iconClass} />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Soyadınız"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Email Adresi</label>
                                    <div className={inputWrapperClass}>
                                        <Mail size={18} className={iconClass} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="ornek@mail.com"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Doğum Tarihi</label>
                                    <div className={inputWrapperClass}>
                                        <CalendarIcon size={18} className={iconClass} />
                                        <input
                                            type="date"
                                            name="birthDate"
                                            value={formData.birthDate}
                                            onChange={handleChange}
                                            className={`${inputClass} [color-scheme:dark]`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Cinsiyet</label>
                                    <div className={inputWrapperClass}>
                                        <User size={18} className={iconClass} />
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className={`${inputClass} appearance-none cursor-pointer`}
                                        >
                                            <option value="" className="bg-gray-900">
                                                Seçiniz
                                            </option>
                                            <option value="male" className="bg-gray-900">
                                                Erkek
                                            </option>
                                            <option value="female" className="bg-gray-900">
                                                Kadın
                                            </option>
                                            <option value="other" className="bg-gray-900">
                                                Belirtmek İstemiyorum
                                            </option>
                                        </select>
                                        <ChevronDown
                                            size={16}
                                            className="absolute right-4 text-gray-500 pointer-events-none"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Biyografi</label>
                                    <div className={inputWrapperClass}>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                            placeholder="Kendinizden bahsedin..."
                                            className={`${inputClass} min-h-[100px] resize-none`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-2">
                                <Lock className="text-cyan-400" size={20} /> Şifre Değiştir
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className={labelClass}>Yeni Şifre</label>
                                    <div className={inputWrapperClass}>
                                        <Lock size={18} className={iconClass} />
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="Değiştirmek istemiyorsanız boş bırakın"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Şifre Tekrarı</label>
                                    <div className={inputWrapperClass}>
                                        <Lock size={18} className={iconClass} />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Yeni şifreyi tekrar girin"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-4 border-t border-white/10 mt-8">
                            <button
                                type="button"
                                className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-semibold transition-colors"
                            >
                                Vazgeç
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <Save size={20} />
                                )}
                                {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


