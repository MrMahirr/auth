import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { signInWithGoogle } from "../../../firebase";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import type { ToastMessage } from "primereact/toast";

function LoginPage() {
    const navigate = useNavigate();
    const toast = useRef<Toast | null>(null);
    const { loginSuccess } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const showToast = (message: ToastMessage) => {
        toast.current?.show(message);
    };

    const handleGoogleLogin = async () => {
        try {
            const googleUser = await signInWithGoogle();

            const payload = {
                user: {
                    email: googleUser.email,
                    username: googleUser.displayName,
                },
            };

            const response = await api.post("/users/google-login", payload);

            const token = response.data.user.token as string;
            const userData = response.data.user;

            loginSuccess(userData, token);

            showToast({
                severity: "success",
                summary: "Başarılı",
                detail: `Hoşgeldin ${userData.username}`,
            });
            navigate("/");
        } catch (error: any) {
            console.error("Google Login Hatası:", error);
            const errorMsg =
                error.response?.data?.message || "Google girişi sırasında hata oluştu.";
            showToast({ severity: "error", summary: "Hata", detail: errorMsg });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            showToast({
                severity: "warn",
                summary: "Uyarı",
                detail: "Lütfen tüm alanları doldurun.",
            });
            return;
        }
        setLoading(true);
        try {
            const response = await api.post("/users/login", { user: { email, password } });
            const token = response.data.user.token as string;
            const userData = { email, ...response.data.user };
            loginSuccess(userData, token);
            navigate("/");
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || "Giriş başarısız.";
            showToast({
                severity: "error",
                summary: "Hata",
                detail: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full !bg-gray-800 !text-white !pl-10 p-3 rounded-md border-none focus:ring-2 focus:ring-blue-500";

    return (
        <div
            className={`relative z-20 w-full max-w-md rounded-2xl border border-blue-500/50 bg-gray-900/60 p-8 text-white backdrop-blur-lg transition-all duration-1000 ease-out ${
                isMounted ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
        >
            <Toast ref={toast} />
            <h2 className="mb-6 text-center text-3xl font-bold text-blue-300">
                Giriş Yap
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <span className="p-input-icon-left w-full relative">
                    <i
                        className="pi pi-envelope text-gray-400 pl-2"
                        style={{
                            zIndex: 1,
                            position: "absolute",
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                    />
                    <InputText
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className={inputClass}
                    />
                </span>
                <span className="p-input-icon-left w-full relative">
                    <i
                        className="pi pi-lock text-gray-400 pl-2"
                        style={{
                            zIndex: 1,
                            position: "absolute",
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                    />
                    <Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Şifre"
                        className="w-full"
                        inputClassName={inputClass}
                        toggleMask
                        feedback={false}
                    />
                </span>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            inputId="rememberMe"
                            checked={rememberMe}
                            onChange={(e: CheckboxChangeEvent) =>
                                setRememberMe(!!e.checked)
                            }
                            className="!border-gray-500"
                        />
                        <label
                            htmlFor="rememberMe"
                            className="text-gray-300 cursor-pointer"
                        >
                            Beni Hatırla
                        </label>
                    </div>
                    <a href="#" className="text-blue-400 hover:underline">
                        Şifremi Unuttum?
                    </a>
                </div>

                <Button
                    label={loading ? "..." : "Giriş Yap"}
                    type="submit"
                    disabled={loading}
                    className="w-full !bg-blue-600 !py-3 font-bold !text-white hover:!bg-blue-700 border-none shadow-lg shadow-blue-500/30"
                />
            </form>

            <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="mx-4 text-gray-500 text-sm">veya</span>
                <div className="flex-grow border-t border-gray-700"></div>
            </div>

            <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors shadow-md"
            >
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                />
                Google ile Devam Et
            </button>

            <div className="mt-6 text-center text-gray-400">
                Hesabın yok mu?{" "}
                <Link to="/register" className="text-blue-400 hover:underline">
                    Kayıt Ol
                </Link>
            </div>
        </div>
    );
}

export default LoginPage;



