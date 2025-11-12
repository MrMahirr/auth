import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import { useNavigate } from 'react-router-dom';


import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Checkbox} from "primereact/checkbox";
import {Password} from "primereact/password";


function LoginPage() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form gönderildi ve yönlendirme yapılıyor...');
        navigate('/dashboard');
    };

    return (

        <div className={`relative z-20 w-full max-w-md rounded-2xl border border-blue-500/50 bg-gray-900/60 p-8 text-white backdrop-blur-lg animate-pulse-glow transition-all duration-1000 ease-out ${isMounted ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>


            <h2 className="mb-6 animate-pulse text-center text-3xl font-bold text-blue-300">
                Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">


                <span className="p-input-icon-left w-full">
                    <i className="pi pi-envelope text-gray-400 pl-2"/>
                    <InputText
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Adresi"
                        className="w-full text-white pl-7 p-1 rounded-md"

                    />
                </span>
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-lock text-gray-400 pl-2"/>
                    <Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Şifre"
                        className="w-full"
                        inputClassName="w-full !text-white pl-7 p-1 rounded-md"
                        toggleMask
                    />
                </span>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            inputId="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.checked)}
                        />
                        <label htmlFor="rememberMe" className="text-gray-300">
                            Beni Hatırla
                        </label>
                    </div>
                    <a
                        href="#"
                        className="text-blue-400 transition-colors hover:text-blue-300 hover:underline"
                    >
                        Şifremi Unuttum?
                    </a>
                </div>

                <Button
                    label="Giriş Yap"
                    type="submit"
                    className="w-full !bg-blue-600 !py-3 !text-base font-bold !text-white hover:!bg-blue-700"
                />

                <div className="mt-6 text-center text-gray-400">
                    Hesabın yok mu?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-blue-400 transition-colors hover:text-blue-300 hover:underline"
                    >
                        <i className="pi pi-star-fill mr-1 text-xs"/>
                        Kayıt Ol
                    </Link>
                </div>
            </form>
        </div>);
}

export default LoginPage;